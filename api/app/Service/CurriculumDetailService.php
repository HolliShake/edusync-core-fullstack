<?php

namespace App\Service;

use App\Interface\IService\ICurriculumDetailService;
use App\Interface\IRepo\ICurriculumDetailRepo;

class CurriculumDetailService extends GenericService implements ICurriculumDetailService
{
    public function __construct(ICurriculumDetailRepo $curriculumDetailRepository)
    {
        parent::__construct($curriculumDetailRepository);
    }
}
