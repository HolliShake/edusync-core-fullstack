<?php

namespace App\Service;

use App\Interface\IService\IGradeBookItemDetailService;
use App\Interface\IRepo\IGradeBookItemDetailRepo;

class GradeBookItemDetailService extends GenericService implements IGradeBookItemDetailService
{
    public function __construct(IGradeBookItemDetailRepo $gradeBookItemDetailRepository)
    {
        parent::__construct($gradeBookItemDetailRepository);
    }
}
