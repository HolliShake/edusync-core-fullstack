<?php

namespace App\Service;

use App\interface\IService\IAcademicProgramService;
use App\interface\IRepo\IAcademicProgramRepo;
use App\Service\GenericService;

class AcademicProgramService extends GenericService implements IAcademicProgramService
{
    public function __construct(IAcademicProgramRepo $academicProgramRepository)
    {
        parent::__construct($academicProgramRepository);
    }
}
