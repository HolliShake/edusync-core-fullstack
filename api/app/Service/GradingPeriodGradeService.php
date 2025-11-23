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

                $recommendedGrades = $enrollment->section
                    ->gradeBook()->first()
                    ->gradeBookGradingPeriods()
                    ->get()->mapWithKeys(function($period) use ($enrollment) {
                        // Get all grade book items for this period
                        $periodColumns = $period->gradeBookItems()
                            ->with('gradeBookItemDetails')
                            ->get()
                            ->flatMap(function($item) use ($period) {
                                return array_map(function($detail) use ($item) {
                                    return (object)[
                                        'detailId'       => $detail['id'],
                                        'detailMaxScore' => $detail['max_score'],
                                        'detailWeight'   => $detail['weight'],
                                        'itemWeight'     => $item['weight'],
                                    ];
                                }, $item->gradeBookItemDetails);
                            })
                            ->filter(fn($col) => $col->detailMaxScore > 0);

                        if ($periodColumns->isEmpty()) {
                            return [$period->id => '0.00'];
                        }

                        $totalPeriodGrade = 0;

                        foreach ($periodColumns as $col) {
                            // Get the score for this enrollment and detail
                            $gradeBookScore = $enrollment->gradeBookScores()
                                ->where('gradebook_item_detail_id', $col->detailId)
                                ->first();

                            $score = $gradeBookScore ? $gradeBookScore->score : 0;

                            $normalizedScore = $score / $col->detailMaxScore;
                            // Contribution = (Score / Max) * DetailWeight% * (ItemWeight% / 100)
                            $term = $normalizedScore * $col->detailWeight * ($col->itemWeight / 100);
                            $totalPeriodGrade += $term;
                        }

                        return [$period->id => number_format($totalPeriodGrade, 2, '.', '')];
                    });

                return $enrollment->gradingPeriodGrades->isEmpty()
                    ? $enrollment->section->gradeBook()->first()->gradeBookGradingPeriods()->get()->map(fn($period) => (object)[
                        'id'                          => null,
                        'gradebook_grading_period_id' => $period->id,
                        'enrollment_id'               => $enrollment->id,
                        'grade'                       => $recommendedGrades[$period->id],
                        'recommended_grade'           => $recommendedGrades[$period->id],
                        'is_overridden'               => false,
                        'is_posted'                   => false
                    ])
                    : $enrollment->section->gradeBook()->first()->gradeBookGradingPeriods()->get()->map(function($period) use ($enrollment, $recommendedGrades) {
                        $existingGrade = $enrollment->gradingPeriodGrades->firstWhere('gradebook_grading_period_id', $period->id);
                        $existingGradeValue = $existingGrade ? (float)$existingGrade->grade : null;
                        $recommendedGradeValue = (float) $recommendedGrades[$period->id];
                        $finalGrade = (float)($existingGradeValue ?? (float) $recommendedGradeValue);

                        return (object)[
                            'id'                          => $existingGrade?->id ?? null,
                            'gradebook_grading_period_id' => $period->id,
                            'enrollment_id'               => $enrollment->id,
                            'grade'                       => $finalGrade,
                            'recommended_grade'           => $recommendedGradeValue,
                            'is_overridden'               => $existingGradeValue !== null && $existingGradeValue !== $recommendedGradeValue,
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
