<?php

namespace App\Service;

use App\Interface\IService\ICurriculumTaggingService;
use App\Interface\IRepo\ICurriculumTaggingRepo;

class CurriculumTaggingService extends GenericService implements ICurriculumTaggingService
{
    public function __construct(ICurriculumTaggingRepo $curriculumTaggingRepository)
    {
        parent::__construct($curriculumTaggingRepository);
    }
}
