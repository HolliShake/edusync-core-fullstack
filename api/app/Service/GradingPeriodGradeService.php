<?php

namespace App\Service;

use App\Enum\EnrollmentLogActionEnum;
use App\Interface\IRepo\IEnrollmentRepo;
use App\Interface\IService\IGradingPeriodGradeService;
use App\Interface\IRepo\IGradingPeriodGradeRepo;
use Illuminate\Support\Facades\DB;

class GradingPeriodGradeService extends GenericService implements IGradingPeriodGradeService
{
    private IEnrollmentRepo $enrollmentRepository;

    public function __construct(IGradingPeriodGradeRepo $gradingPeriodGradeRepository, IEnrollmentRepo $enrollmentRepository)
    {
        parent::__construct($gradingPeriodGradeRepository);
        $this->enrollmentRepository = $enrollmentRepository;
    }

    public function getSync($section_id)
    {
        return $this->enrollmentRepository->query()
            ->where('section_id', $section_id)
            ->whereDoesntHave('enrollmentLogs', function ($q) {
                $q->where('action', EnrollmentLogActionEnum::REGISTRAR_DROPPED_APPROVED->value);
            })
            ->whereHas('enrollmentLogs', function ($q) {
                $q->where('action', EnrollmentLogActionEnum::REGISTRAR_APPROVED->value);
            })
            ->with(['gradingPeriodGrades'])
            ->get()
            ->flatMap(function ($enrollment) {
                return $enrollment->gradingPeriodGrades->isEmpty()
                    ? $enrollment->section->gradeBook()->first()->gradeBookGradingPeriods()->get()->map(fn($period) => (object)[
                        'id'                          => null,
                        'gradebook_grading_period_id' => $period->id,
                        'enrollment_id'               => $enrollment->id,
                        'grade'                       => 0,
                        'is_posted'                   => false
                    ])
                    : $enrollment->section->gradeBook()->first()->gradeBookGradingPeriods()->get()->map(function($period) use ($enrollment) {
                        $existingGrade = $enrollment->gradingPeriodGrades->firstWhere('gradebook_grading_period_id', $period->id);
                        return (object)[
                            'id'                          => $existingGrade?->id ?? null,
                            'gradebook_grading_period_id' => $period->id,
                            'enrollment_id'               => $enrollment->id,
                            'grade'                       => $existingGrade?->grade ?? 0,
                            'is_posted'                   => $existingGrade?->is_posted ?? false
                        ];
                    });
            });
    }

    public function syncGradingPeriodGradeForSection($section_id, array $data)
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
            return $data;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
