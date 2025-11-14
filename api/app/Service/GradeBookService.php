<?php

namespace App\Service;

use App\Interface\IService\IGradeBookService;
use App\Interface\IRepo\IGradeBookRepo;

class GradeBookService extends GenericService implements IGradeBookService
{
    public function __construct(IGradeBookRepo $gradeBookRepository)
    {
        parent::__construct($gradeBookRepository);
    }
}
