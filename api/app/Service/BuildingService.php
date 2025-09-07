<?php

namespace App\Service;

use App\interface\IService\IBuildingService;
use App\interface\IRepo\IBuildingRepo;

class BuildingService extends GenericService implements IBuildingService
{
    public function __construct(IBuildingRepo $buildingRepository)
    {
        parent::__construct($buildingRepository);
    }
}
