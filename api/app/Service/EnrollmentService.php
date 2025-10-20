<?php

namespace App\Service;

use App\Interface\IService\IEnrollmentService;
use App\Interface\IRepo\IEnrollmentRepo;

class EnrollmentService extends GenericService implements IEnrollmentService
{
    public function __construct(IEnrollmentRepo $enrollmentRepository)
    {
        parent::__construct($enrollmentRepository);
    }
}
