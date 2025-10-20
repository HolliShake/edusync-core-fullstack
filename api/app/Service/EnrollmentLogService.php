<?php

namespace App\Service;

use App\Interface\IService\IEnrollmentLogService;
use App\Interface\IRepo\IEnrollmentLogRepo;

class EnrollmentLogService extends GenericService implements IEnrollmentLogService
{
    public function __construct(IEnrollmentLogRepo $enrollmentLogRepository)
    {
        parent::__construct($enrollmentLogRepository);
    }
}
