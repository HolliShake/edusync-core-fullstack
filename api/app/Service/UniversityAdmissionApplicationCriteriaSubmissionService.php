<?php

namespace App\Service;

use App\Interface\IService\IUniversityAdmissionApplicationCriteriaSubmissionService;
use App\Interface\IRepo\IUniversityAdmissionApplicationCriteriaSubmissionRepo;

class UniversityAdmissionApplicationCriteriaSubmissionService extends GenericService implements IUniversityAdmissionApplicationCriteriaSubmissionService
{
    public function __construct(IUniversityAdmissionApplicationCriteriaSubmissionRepo $universityAdmissionApplicationCriteriaSubmissionRepository)
    {
        parent::__construct($universityAdmissionApplicationCriteriaSubmissionRepository);
    }
}
