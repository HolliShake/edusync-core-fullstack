<?php

namespace App\Service;

use App\interface\IService\IProgramTypeService;
use App\interface\IRepo\IProgramTypeRepo;

class ProgramTypeService extends GenericService implements IProgramTypeService
{
    public function __construct(IProgramTypeRepo $programTypeRepository)
    {
        parent::__construct($programTypeRepository);
    }
}
