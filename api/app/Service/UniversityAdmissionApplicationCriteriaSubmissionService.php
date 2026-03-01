<?php

namespace App\Service;

use App\Interface\IService\IUniversityAdmissionApplicationCriteriaSubmissionService;
use App\Interface\IRepo\IUniversityAdmissionApplicationCriteriaSubmissionRepo;
use Illuminate\Support\Facades\DB;

class UniversityAdmissionApplicationCriteriaSubmissionService extends GenericService implements IUniversityAdmissionApplicationCriteriaSubmissionService
{
    public function __construct(IUniversityAdmissionApplicationCriteriaSubmissionRepo $universityAdmissionApplicationCriteriaSubmissionRepository)
    {
        parent::__construct($universityAdmissionApplicationCriteriaSubmissionRepository);
    }

    public function updateScores(array $scores): array
    {
        // Index scores by submission ID for O(1) lookup
        $scoresById = array_column($scores, 'score', 'university_admission_criteria_submission_id');

        $submissionIds = array_keys($scoresById);

        $submissions = $this->repository->query()
            ->whereIn('id', $submissionIds)
            ->get();

        // Prepare bulk update data
        $updateData = [];
        foreach ($submissions as $submission) {
            if (isset($scoresById[$submission->id])) {
                $updateData[] = [
                    'id' => $submission->id,
                    'score' => $scoresById[$submission->id]
                ];
            }
        }

        // Perform bulk update if possible, otherwise update individually
        if (!empty($updateData)) {
            // Use bulk update via raw query for better performance
            $cases = [];
            $ids = [];
            foreach ($updateData as $data) {
                $cases[] = "WHEN {$data['id']} THEN {$data['score']}";
                $ids[] = $data['id'];
            }

            $casesString = implode(' ', $cases);
            $idsString = implode(',', $ids);

            DB::update("UPDATE university_admission_application_criteria_submission SET score = CASE id {$casesString} END WHERE id IN ({$idsString})");

            // Refresh the models to reflect the updated values
            foreach ($submissions as $submission) {
                if (isset($scoresById[$submission->id])) {
                    $submission->score = $scoresById[$submission->id];
                }
            }
        }

        return $submissions->toArray();
    }
}
