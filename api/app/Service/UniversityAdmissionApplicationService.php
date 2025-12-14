<?php

namespace App\Service;

use App\Interface\IService\IUniversityAdmissionApplicationService;
use App\Interface\IRepo\IUniversityAdmissionApplicationRepo;

class UniversityAdmissionApplicationService extends GenericService implements IUniversityAdmissionApplicationService
{
    public function __construct(IUniversityAdmissionApplicationRepo $universityAdmissionApplicationRepository)
    {
        parent::__construct($universityAdmissionApplicationRepository);
    }
}
