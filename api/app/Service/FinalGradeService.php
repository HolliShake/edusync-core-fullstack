<?php

namespace App\Service;

use App\Enum\EnrollmentLogActionEnum;
use App\Interface\IRepo\IEnrollmentRepo;
use App\Interface\IService\IFinalGradeService;
use App\Interface\IRepo\IFinalGradeRepo;
use Illuminate\Support\Facades\DB;

class FinalGradeService extends GenericService implements IFinalGradeService
{
    private IEnrollmentRepo $enrollmentRepository;

    public function __construct(IFinalGradeRepo $finalGradeRepository, IEnrollmentRepo $enrollmentRepository)
    {
        parent::__construct($finalGradeRepository);
        $this->enrollmentRepository = $enrollmentRepository;
    }

    public function getSync(int $section_id): array
    {
        return $this->enrollmentRepository->query()
            ->where('section_id', $section_id)
            ->whereDoesntHave('enrollmentLogs', function ($q) {
                $q->where('action', EnrollmentLogActionEnum::REGISTRAR_DROPPED_APPROVED->value);
            })
            ->whereHas('enrollmentLogs', function ($q) {
                $q->where('action', EnrollmentLogActionEnum::REGISTRAR_APPROVED->value);
            })
            ->with(['finalGrade', 'gradingPeriodGrades'])
            ->get()
            ->flatMap(function ($enrollment) {
                // Get all grading periods for this section's gradebook
                $gradingPeriods = $enrollment->section
                    ->gradeBook()->first()
                    ->gradeBookGradingPeriods()
                    ->get();

                // Calculate recommended grade from posted grading period grades
                $recommendedGrade = $gradingPeriods->reduce(function($carry, $period) use ($enrollment) {
                    // Find the grading period grade for this enrollment and period
                    $gradingPeriodGrade = $enrollment->gradingPeriodGrades()
                        ->where('gradebook_grading_period_id', $period->id)
                        ->where('is_posted', true)
                        ->first();

                    // If no posted grade exists for this period, skip it
                    if (!$gradingPeriodGrade) {
                        return $carry;
                    }

                    // Add the weighted contribution of this period's grade
                    $periodGrade = (float) $gradingPeriodGrade->grade;
                    $periodWeight = (float) $period->weight;

                    return $carry + ($periodGrade * ($periodWeight / 100));
                }, 0);

                $recommendedGradeFormatted = number_format($recommendedGrade, 2, '.', '');

                $existingGrade = $enrollment->finalGrade;
                $existingGradeValue = $existingGrade ? (float)$existingGrade->grade : null;
                $recommendedGradeValue = (float) $recommendedGradeFormatted;
                $finalGrade = (float)($existingGradeValue ?? $recommendedGradeValue);

                return [(object)[
                    'id'                => $existingGrade?->id ?? null,
                    'enrollment_id'     => $enrollment->id,
                    'grade'             => $finalGrade,
                    'recommended_grade' => $recommendedGradeValue,
                    'credited_units'    => $existingGrade?->credited_units ?? 0,
                    'is_overridden'     => $existingGradeValue !== null && $existingGradeValue !== $recommendedGradeValue,
                    'is_posted'         => $existingGrade?->is_posted ?? false,
                    'is_passed'         => $finalGrade >= env('PASSING_GRADE', 100),
                ]];
            })->values()->all();
    }

    public function syncFinalGradeForSection(int $section_id, array $data): array
    {
        try {
            DB::beginTransaction();
            $synced /*created or updated*/ = [];
            foreach ($data as $item) {
                if (isset($item['id']) && $item['id'] !== null) {
                    $synced[] = $this->repository->update($item['id'], $item);
                } else {
                    $synced[] = $this->repository->create($item);
                }
            }
            DB::commit();
            return $synced;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
