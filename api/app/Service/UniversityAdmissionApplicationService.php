<?php

namespace App\Service;

use App\Interface\IRepo\IUniversityAdmissionApplicationCriteriaSubmissionRepo;
use App\Interface\IService\IUniversityAdmissionApplicationCriteriaSubmissionService;
use App\Interface\IService\IUniversityAdmissionApplicationService;
use App\Interface\IRepo\IUniversityAdmissionApplicationRepo;
use App\Models\UniversityAdmissionApplicationCriteriaSubmission;
use DB;

class UniversityAdmissionApplicationService extends GenericService implements IUniversityAdmissionApplicationService
{
    protected IUniversityAdmissionApplicationCriteriaSubmissionRepo $universityAdmissionApplicationCriteriaSubmissionRepository;

    public function __construct(IUniversityAdmissionApplicationRepo $universityAdmissionApplicationRepository, IUniversityAdmissionApplicationCriteriaSubmissionRepo $universityAdmissionApplicationCriteriaSubmissionRepository)
    {
        parent::__construct($universityAdmissionApplicationRepository);
        $this->universityAdmissionApplicationCriteriaSubmissionRepository = $universityAdmissionApplicationCriteriaSubmissionRepository;
    }

    public function submitApplicationForm(array $data) {
        try {
            return DB::transaction(function () use ($data) {
                // Extract application data
                $applicationData = [
                    'user_id'                 => $data['user_id'],
                    'university_admission_id' => $data['university_admission_id'],
                    'remark' => 'Pending',
                ];

                // Create the university admission application
                $universityAdmissionApplication = $this->repository->create($applicationData);

                // Handle criteria files if provided
                foreach (array_map(null, $data['criteria_ids'], $data['files']) as [$criteriaId, $file]) {
                    // Process each criteria_id and file pair
                    $criteriaSubmission = $this->universityAdmissionApplicationCriteriaSubmissionRepository->create([
                        'university_admission_application_id' => $universityAdmissionApplication->id,
                        'university_admission_criteria_id' => $criteriaId,
                    ]);

                    if ($file instanceof \Illuminate\Http\UploadedFile) {
                        $criteriaSubmission->addMedia($file)
                            ->toMediaCollection(UniversityAdmissionApplicationCriteriaSubmission::$COLLECTION_NAME);
                    }
                }

                return $universityAdmissionApplication;
            });
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
