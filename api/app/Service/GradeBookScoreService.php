<?php

namespace App\Service;

use App\Enum\EnrollmentLogActionEnum;
use App\Interface\IRepo\IEnrollmentRepo;
use App\Interface\IService\IGradeBookScoreService;
use App\Interface\IRepo\IGradeBookScoreRepo;
use Illuminate\Support\Facades\DB;

class GradeBookScoreService extends GenericService implements IGradeBookScoreService
{
    private IEnrollmentRepo $enrollmentRepository;

    public function __construct(IGradeBookScoreRepo $gradeBookScoreRepository, IEnrollmentRepo $enrollmentRepository)
    {
        parent::__construct($gradeBookScoreRepository);
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
            ->with(['gradebookScores'])
            ->get()
            ->flatMap(function ($enrollment) {
                return $enrollment->gradebookScores->isEmpty()
                    ? $enrollment->section->gradeBook()->first()->gradeBookGradingPeriods()->get()->flatMap(fn($period) => $period->gradeBookItems()->get()->flatMap(fn($item) => $item->gradeBookItemDetails()->get()->map(fn($detail) => (object)[
                        'id'                       => null,
                        'gradebook_item_detail_id' => $detail->id,
                        'enrollment_id'            => $enrollment->id,
                        'score'                    => 0
                    ])))
                    : $enrollment->section->gradeBook()->first()->gradeBookGradingPeriods()->get()->flatMap(fn($period) => $period->gradeBookItems()->get()->flatMap(fn($item) => $item->gradeBookItemDetails()->get()->map(function($detail) use ($enrollment) {
                        $existingScore = $enrollment->gradebookScores->firstWhere('gradebook_item_detail_id', $detail->id);
                        return (object)[
                            'id'                       => $existingScore?->id ?? null,
                            'gradebook_item_detail_id' => $detail->id,
                            'enrollment_id'            => $enrollment->id,
                            'score'                    => $existingScore?->score ?? 0
                        ];
                    })));
            });
    }

    public function syncScoreForSection($section_id, array $data)
    {
        try {
            DB::beginTransaction();

            $synced /*created or updated*/ = [];

            foreach ($data as $item) {
                if (isset($item['id']) && $item['id'] !== null) {
                    // Update existing score
                    $synced[] = $this->repository->update($item['id'], [
                        'gradebook_item_detail_id' => $item['gradebook_item_detail_id'],
                        'enrollment_id' => $item['enrollment_id'],
                        'score' => $item['score'],
                    ]);
                } else {
                    // Create new score
                    $synced[] = $this->repository->create([
                        'gradebook_item_detail_id' => $item['gradebook_item_detail_id'],
                        'enrollment_id' => $item['enrollment_id'],
                        'score' => $item['score'],
                    ]);
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
