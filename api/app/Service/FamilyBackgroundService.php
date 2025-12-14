<?php

namespace App\Service;

use App\Interface\IService\IFamilyBackgroundService;
use App\Interface\IRepo\IFamilyBackgroundRepo;

class FamilyBackgroundService extends GenericService implements IFamilyBackgroundService
{
    public function __construct(IFamilyBackgroundRepo $familyBackgroundRepository)
    {
        parent::__construct($familyBackgroundRepository);
    }
}
