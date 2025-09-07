<?php

namespace App\Service;

use App\interface\IService\ICollegeService;
use App\interface\IRepo\ICollegeRepo;

class CollegeService extends GenericService implements ICollegeService
{
    public function __construct(ICollegeRepo $collegeRepository)
    {
        parent::__construct($collegeRepository);
    }
}
