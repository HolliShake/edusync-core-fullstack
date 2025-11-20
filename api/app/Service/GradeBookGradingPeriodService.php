<?php

namespace App\Service;

use App\Interface\IService\IGradeBookGradingPeriodService;
use App\Interface\IRepo\IGradeBookGradingPeriodRepo;

class GradeBookGradingPeriodService extends GenericService implements IGradeBookGradingPeriodService
{
    public function __construct(IGradeBookGradingPeriodRepo $gradeBookGradingPeriodRepository)
    {
        parent::__construct($gradeBookGradingPeriodRepository);
    }
}
