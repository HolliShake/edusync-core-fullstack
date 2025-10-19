<?php

namespace App\Service;

use App\Interface\IService\IDesignitionService;
use App\Interface\IRepo\IDesignitionRepo;

class DesignitionService extends GenericService implements IDesignitionService
{
    public function __construct(IDesignitionRepo $designitionRepository)
    {
        parent::__construct($designitionRepository);
    }
}
