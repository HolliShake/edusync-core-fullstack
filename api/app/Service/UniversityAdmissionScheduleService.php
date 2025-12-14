<?php

namespace App\Service;

use App\Interface\IService\IUniversityAdmissionScheduleService;
use App\Interface\IRepo\IUniversityAdmissionScheduleRepo;

class UniversityAdmissionScheduleService extends GenericService implements IUniversityAdmissionScheduleService
{
    public function __construct(IUniversityAdmissionScheduleRepo $universityAdmissionScheduleRepository)
    {
        parent::__construct($universityAdmissionScheduleRepository);
    }
}
