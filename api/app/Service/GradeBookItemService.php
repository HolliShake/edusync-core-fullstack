<?php

namespace App\Service;

use App\Interface\IService\IGradeBookItemService;
use App\Interface\IRepo\IGradeBookItemRepo;

class GradeBookItemService extends GenericService implements IGradeBookItemService
{
    public function __construct(IGradeBookItemRepo $gradeBookItemRepository)
    {
        parent::__construct($gradeBookItemRepository);
    }
}
