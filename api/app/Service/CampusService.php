<?php

namespace App\Service;

use App\Model\Campus;
use App\Repository\CampusRepository;

class CampusService extends GenericService implements ICampusService
{
    public function __construct(CampusRepository $campusRepository)
    {
        parent::__construct($campusRepository);
    }
}