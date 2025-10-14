<?php

namespace App\Service;

use App\Interface\IService\IBuildingService;
use App\Interface\IRepo\IBuildingRepo;

class BuildingService extends GenericService implements IBuildingService
{
    public function __construct(IBuildingRepo $buildingRepository)
    {
        parent::__construct($buildingRepository);
    }
}
