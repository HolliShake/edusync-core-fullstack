<?php

namespace App\Service;

use App\Interface\IService\ISchoolYearService;
use App\Interface\IRepo\ISchoolYearRepo;

class SchoolYearService extends GenericService implements ISchoolYearService
{
    public function __construct(ISchoolYearRepo $schoolYearRepository)
    {
        parent::__construct($schoolYearRepository);
    }
}
