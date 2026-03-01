<?php

namespace App\Service;

use App\Enum\AdmissionApplicationLogTypeEnum;
use App\Interface\IService\IUniversityAdmissionApplicationLogService;
use App\Interface\IRepo\IUniversityAdmissionApplicationLogRepo;
use App\Models\UniversityAdmissionApplicationLog;

class UniversityAdmissionApplicationLogService extends GenericService implements IUniversityAdmissionApplicationLogService
{
    public function __construct(IUniversityAdmissionApplicationLogRepo $universityAdmissionApplicationLogRepository)
    {
        parent::__construct($universityAdmissionApplicationLogRepository);
    }

    protected function beforeCreate(array $data): array
    {
        $applicationId = $data['university_admission_application_id'];
        $newType = $data['type'];

        $duplicateExists = UniversityAdmissionApplicationLog::where('university_admission_application_id', $applicationId)
            ->where('type', $newType)
            ->exists();

        if ($duplicateExists) {
            throw new \Exception('A log entry with this status already exists for this application.');
        }

        if ($newType === AdmissionApplicationLogTypeEnum::REJECTED->value) {
            $alreadyApproved = UniversityAdmissionApplicationLog::where('university_admission_application_id', $applicationId)
                ->where('type', AdmissionApplicationLogTypeEnum::APPROVED->value)
                ->exists();

            if ($alreadyApproved) {
                throw new \Exception('Cannot reject an application that has already been approved.');
            }
        }

        return parent::beforeCreate($data);
    }

    protected function beforeUpdate(int|string $id, array $data): array
    {
        $existing = UniversityAdmissionApplicationLog::find($id);
        if (!$existing) {
            return parent::beforeUpdate($id, $data);
        }

        $applicationId = $data['university_admission_application_id'] ?? $existing->university_admission_application_id;
        $newType = $data['type'] ?? $existing->type;
        $newTypeValue = $newType instanceof AdmissionApplicationLogTypeEnum ? $newType->value : (string) $newType;

        $duplicateExists = UniversityAdmissionApplicationLog::where('university_admission_application_id', $applicationId)
            ->where('type', $newTypeValue)
            ->where('id', '!=', $id)
            ->exists();

        if ($duplicateExists) {
            throw new \Exception('A log entry with this status already exists for this application.');
        }

        if ($newTypeValue === AdmissionApplicationLogTypeEnum::REJECTED->value) {
            $alreadyApproved = UniversityAdmissionApplicationLog::where('university_admission_application_id', $applicationId)
                ->where('type', AdmissionApplicationLogTypeEnum::APPROVED->value)
                ->where('id', '!=', $id)
                ->exists();

            if ($alreadyApproved) {
                throw new \Exception('Cannot reject an application that has already been approved.');
            }
        }

        return parent::beforeUpdate($id, $data);
    }
}
