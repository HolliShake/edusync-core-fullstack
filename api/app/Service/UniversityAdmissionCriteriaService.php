<?php

namespace App\Service;

use App\Interface\IService\IUniversityAdmissionCriteriaService;
use App\Interface\IRepo\IUniversityAdmissionCriteriaRepo;

class UniversityAdmissionCriteriaService extends GenericService implements IUniversityAdmissionCriteriaService
{
    public function __construct(IUniversityAdmissionCriteriaRepo $universityAdmissionCriteriaRepository)
    {
        parent::__construct($universityAdmissionCriteriaRepository);
    }
}
