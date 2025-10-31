<?php

namespace App\Service;

use App\Interface\IService\ICourseRequisiteService;
use App\Interface\IRepo\ICourseRequisiteRepo;

class CourseRequisiteService extends GenericService implements ICourseRequisiteService
{
    public function __construct(ICourseRequisiteRepo $courseRequisiteRepository)
    {
        parent::__construct($courseRequisiteRepository);
    }
}
