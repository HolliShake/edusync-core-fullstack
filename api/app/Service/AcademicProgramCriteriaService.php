<?php

namespace App\Service;

use App\Interface\IService\IAcademicProgramCriteriaService;
use App\Interface\IRepo\IAcademicProgramCriteriaRepo;

class AcademicProgramCriteriaService extends GenericService implements IAcademicProgramCriteriaService
{
    public function __construct(IAcademicProgramCriteriaRepo $academicProgramCriteriaRepository)
    {
        parent::__construct($academicProgramCriteriaRepository);
    }
}
