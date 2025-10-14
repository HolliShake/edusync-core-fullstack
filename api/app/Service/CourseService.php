<?php

namespace App\Service;

use App\Interface\IService\ICourseService;
use App\Interface\IRepo\ICourseRepo;

class CourseService extends GenericService implements ICourseService
{
    public function __construct(ICourseRepo $courseRepository)
    {
        parent::__construct($courseRepository);
    }
}
