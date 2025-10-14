<?php

namespace App\Service;

use App\Interface\IService\ICampusService;
use App\Interface\IRepo\ICampusRepo;

class CampusService extends GenericService implements ICampusService
{
    public function __construct(ICampusRepo $campusRepository)
    {
        parent::__construct($campusRepository);
    }
}
