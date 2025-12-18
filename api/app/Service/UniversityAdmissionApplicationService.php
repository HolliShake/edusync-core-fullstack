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
            /*
                format:
                    [
                        'user_id' => [1, 2, 3],
                        'university_admission_id' => [1, 2, 3],
                        'university_admission_criteria_id' => [1, 2, 3],
                        'file' => [file1, file2, file3],
                    ]
                
                Note: All arrays should have the same length, but user_id and university_admission_id
                should contain unique values (no duplicates within each array).
            */ 
        
            return DB::transaction(function () use ($data) {
                // Ensure user_id and university_admission_id arrays contain unique values
                $data['user_id'] = array_values(array_unique($data['user_id']));
                $data['university_admission_id'] = array_values(array_unique($data['university_admission_id']));
                
                // Extract application data - use first element from arrays
                $applicationData = [
                    'user_id'                 => $data['user_id'][0],
                    'university_admission_id' => $data['university_admission_id'][0],
                    'remark' => 'Pending',
                ];

                // Create the university admission application
                $universityAdmissionApplication = $this->repository->create($applicationData);

                // Handle criteria files if provided
                foreach (array_map(null, $data['university_admission_criteria_id'], $data['file']) as [$criteriaId, $file]) {
                    // Process each criteria_id and file pair
                    $criteriaSubmission = $this->universityAdmissionApplicationCriteriaSubmissionRepository->create([
                        'university_admission_application_id' => $universityAdmissionApplication->id,
                        'university_admission_criteria_id' => $criteriaId,
                    ]);

                    if ($file instanceof \Illuminate\Http\UploadedFile) {
                        $criteriaSubmission->addMedia($file)
                            ->preservingOriginal()
                            ->usingFileName($file->getClientOriginalName())
                            ->toMediaCollection(UniversityAdmissionApplicationCriteriaSubmission::$COLLECTION_NAME);
                    } else {
                        throw new \Exception('File is not an instance of Illuminate\Http\UploadedFile');
                    }
                }

                // Refresh the model to get the latest data with media
                $universityAdmissionApplication->refresh();

                return $universityAdmissionApplication;
            });
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
