<?php

namespace App\Service;

use App\Constant\AdmissionAndScholarshipOffice;
use App\Interface\IService\IOfficeService;
use App\Interface\IRepo\IOfficeRepo;

class OfficeService extends GenericService implements IOfficeService
{
    public function __construct(IOfficeRepo $officeRepository)
    {
        parent::__construct($officeRepository);
    }

    protected function beforeDelete(int|string $id): void
    {
        $restrict = [
            AdmissionAndScholarshipOffice::ID
        ];
        if (\in_array($id, $restrict)) {
            throw new \Exception('Office is restricted and cannot be deleted');
        }
        parent::beforeDelete($id);
    }
}
