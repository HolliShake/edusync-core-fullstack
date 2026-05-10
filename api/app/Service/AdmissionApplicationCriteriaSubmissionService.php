<?php

namespace App\Service;

use App\Interface\IService\IAdmissionApplicationCriteriaSubmissionService;
use App\Interface\IRepo\IAdmissionApplicationCriteriaSubmissionRepo;
use Illuminate\Support\Facades\DB;

class AdmissionApplicationCriteriaSubmissionService extends GenericService implements IAdmissionApplicationCriteriaSubmissionService
{
    public function __construct(IAdmissionApplicationCriteriaSubmissionRepo $admissionApplicationCriteriaSubmissionRepository)
    {
        parent::__construct($admissionApplicationCriteriaSubmissionRepository);
    }
    
    public function createOrUpdateMultiple(array $data): array
    {
        try {
            DB::beginTransaction();
            
            // $data is an array of AdmissionApplicationCriteriaSubmission objects
            // Extract all admission_application_ids and criteria IDs for batch query
            $applicationIds = array_unique(array_column($data, 'admission_application_id'));
            $criteriaIds = array_unique(array_column($data, 'admission_criteria_id'));

            // Fetch all existing scores in one query
            $existingScores = $this->repository->query()
                ->whereIn('admission_application_id', $applicationIds)
                ->whereIn('admission_criteria_id', $criteriaIds)
                ->get()
                ->keyBy(function ($score) {
                    return $score->admission_application_id . '_' . $score->admission_criteria_id;
                });

            $toCreate = [];
            $toUpdate = [];
            $now = now();

            foreach ($data as $scoreData) {
                $key = $scoreData['admission_application_id'] . '_' . $scoreData['admission_criteria_id'];
                $existingScore = $existingScores->get($key);

                if ($existingScore) {
                    // Pool for update
                    $toUpdate[] = [
                        'id' => $existingScore->id,
                        'data' => [
                            'score' => $scoreData['score'],
                            'comments' => $scoreData['comments'] ?? null,
                            'updated_at' => $now,
                            'is_posted' => $scoreData['is_posted'],
                        ]
                    ];
                } else {
                    // Pool for creation
                    $toCreate[] = [
                        'admission_application_id' => $scoreData['admission_application_id'],
                        'admission_criteria_id' => $scoreData['admission_criteria_id'],
                        'score' => $scoreData['score'],
                        'comments' => $scoreData['comments'] ?? null,
                        'created_at' => $now,
                        'updated_at' => $now,
                        'is_posted' => $scoreData['is_posted'],
                    ];
                }
            }

            $admissionApplicationCriteriaSubmissions = [];

            // Batch create new scores
            if (!empty($toCreate)) {
                $this->repository->createMultiple($toCreate);
                
                // Fetch the newly created records
                $createdScores = $this->repository->query()
                    ->whereIn('admission_application_id', array_column($toCreate, 'admission_application_id'))
                    ->whereIn('admission_criteria_id', array_column($toCreate, 'admission_criteria_id'))
                    ->where('created_at', '>=', $now)
                    ->get();
                
                $admissionApplicationCriteriaSubmissions = array_merge($admissionApplicationCriteriaSubmissions, $createdScores->toArray());
            }

            // Batch update existing scores
            foreach ($toUpdate as $updateData) {
                $updated = $this->update($updateData['id'], $updateData['data']);
                $admissionApplicationCriteriaSubmissions[] = $updated;
            }

            DB::commit();
            
            return $admissionApplicationCriteriaSubmissions;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
