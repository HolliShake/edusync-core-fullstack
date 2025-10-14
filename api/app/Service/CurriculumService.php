<?php

namespace App\Service;

use App\Interface\IRepo\ICurriculumRepo;
use App\Interface\IService\ICurriculumService;

class CurriculumService extends GenericService implements ICurriculumService
{
    public function __construct(ICurriculumRepo $curriculumRepository)
    {
        parent::__construct($curriculumRepository);
    }
}
