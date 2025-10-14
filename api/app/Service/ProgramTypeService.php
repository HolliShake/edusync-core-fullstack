<?php

namespace App\Service;

use App\Interface\IService\IProgramTypeService;
use App\Interface\IRepo\IProgramTypeRepo;

class ProgramTypeService extends GenericService implements IProgramTypeService
{
    public function __construct(IProgramTypeRepo $programTypeRepository)
    {
        parent::__construct($programTypeRepository);
    }
}
