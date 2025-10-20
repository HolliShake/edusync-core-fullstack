<?php

namespace App\Service;

use App\Interface\IService\IAcademicProgramRequirementService;
use App\Interface\IRepo\IAcademicProgramRequirementRepo;

class AcademicProgramRequirementService extends GenericService implements IAcademicProgramRequirementService
{
    public function __construct(IAcademicProgramRequirementRepo $academicProgramRequirementRepository)
    {
        parent::__construct($academicProgramRequirementRepository);
    }
}
