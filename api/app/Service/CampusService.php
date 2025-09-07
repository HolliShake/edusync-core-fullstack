<?php

namespace App\Service;

use App\interface\IService\ICampusService;
use App\interface\IRepo\ICampusRepo;

class CampusService extends GenericService implements ICampusService
{
    public function __construct(ICampusRepo $campusRepository)
    {
        parent::__construct($campusRepository);
    }
}
