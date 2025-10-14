<?php

namespace App\Service;

use App\Interface\IService\ICollegeService;
use App\Interface\IRepo\ICollegeRepo;

class CollegeService extends GenericService implements ICollegeService
{
    public function __construct(ICollegeRepo $collegeRepository)
    {
        parent::__construct($collegeRepository);
    }
}
