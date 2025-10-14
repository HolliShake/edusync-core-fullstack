<?php

namespace App\Service;

use App\Interface\IService\IAcademicProgramService;
use App\Interface\IRepo\IAcademicProgramRepo;
use App\Service\GenericService;

class AcademicProgramService extends GenericService implements IAcademicProgramService
{
    public function __construct(IAcademicProgramRepo $academicProgramRepository)
    {
        parent::__construct($academicProgramRepository);
    }
}
