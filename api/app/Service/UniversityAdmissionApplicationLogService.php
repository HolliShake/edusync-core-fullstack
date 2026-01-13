<?php

namespace App\Service;

use App\Interface\IService\IUniversityAdmissionApplicationLogService;
use App\Interface\IRepo\IUniversityAdmissionApplicationLogRepo;

class UniversityAdmissionApplicationLogService extends GenericService implements IUniversityAdmissionApplicationLogService
{
    public function __construct(IUniversityAdmissionApplicationLogRepo $universityAdmissionApplicationLogRepository)
    {
        parent::__construct($universityAdmissionApplicationLogRepository);
    }
}
