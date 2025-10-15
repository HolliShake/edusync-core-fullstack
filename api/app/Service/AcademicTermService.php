<?php

namespace App\Service;

use App\Interface\IService\IAcademicTermService;
use App\Interface\IRepo\IAcademicTermRepo;

class AcademicTermService extends GenericService implements IAcademicTermService
{
    public function __construct(IAcademicTermRepo $academicTermRepository)
    {
        parent::__construct($academicTermRepository);
    }
}
