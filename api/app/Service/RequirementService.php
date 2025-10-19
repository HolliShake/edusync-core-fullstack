<?php

namespace App\Service;

use App\Interface\IService\IRequirementService;
use App\Interface\IRepo\IRequirementRepo;

class RequirementService extends GenericService implements IRequirementService
{
    public function __construct(IRequirementRepo $requirementRepository)
    {
        parent::__construct($requirementRepository);
    }
}
