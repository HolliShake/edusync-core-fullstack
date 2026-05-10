<?php

namespace App\Service;

use App\Interface\IService\IAdmissionApplicationService;
use App\Interface\IRepo\IAdmissionApplicationRepo;
use App\Interface\IRepo\IAdmissionApplicationCriteriaSubmissionRepo;
use App\Models\AdmissionApplicationCriteriaSubmission;
use Illuminate\Support\Facades\DB;

class AdmissionApplicationService extends GenericService implements IAdmissionApplicationService
{
    public function __construct(
        IAdmissionApplicationRepo $admissionApplicationRepository,
        private IAdmissionApplicationCriteriaSubmissionRepo $admissionApplicationCriteriaSubmissionRepository
    ) {
        parent::__construct($admissionApplicationRepository);
    }

    public function submitApplicationForm(array $data)
    {
        try {
            return DB::transaction(function () use ($data) {
                // Ensure arrays are deduplicated/re-indexed for single creation
                $data['user_id'] = array_values(array_unique($data['user_id']));
                $data['admission_schedule_id'] = array_values(array_unique($data['admission_schedule_id']));

                $applicationData = [
                    'user_id' => $data['user_id'][0],
                    'admission_schedule_id' => $data['admission_schedule_id'][0],
                    'remark' => 'Pending',
                ];

                $admissionApplication = $this->repository->create($applicationData);

                foreach (array_map(null, $data['admission_criteria_id'], $data['file']) as [$criteriaId, $file]) {
                    $criteriaSubmission = $this->admissionApplicationCriteriaSubmissionRepository->create([
                        'admission_application_id' => $admissionApplication->id,
                        'admission_criteria_id' => $criteriaId,
                        'score' => 0,
                        'is_posted' => false,
                    ]);

                    if ($file instanceof \Illuminate\Http\UploadedFile) {
                        $criteriaSubmission->addMedia($file)
                            ->preservingOriginal()
                            ->usingFileName($file->getClientOriginalName())
                            ->toMediaCollection(AdmissionApplicationCriteriaSubmission::$COLLECTION_NAME);
                    } else {
                        throw new \Exception('File is not an instance of Illuminate\\Http\\UploadedFile');
                    }
                }

                $admissionApplication->refresh();

                return $admissionApplication;
            });
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
