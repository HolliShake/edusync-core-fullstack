<?php

namespace App\Service;

use App\Interface\IService\IAdmissionApplicationLogService;
use App\Interface\IRepo\IAdmissionApplicationLogRepo;

class AdmissionApplicationLogService extends GenericService implements IAdmissionApplicationLogService
{
    public function __construct(IAdmissionApplicationLogRepo $admissionApplicationLogRepository)
    {
        parent::__construct($admissionApplicationLogRepository);
    }
}
