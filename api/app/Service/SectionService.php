<?php

namespace App\Service;

use App\Interface\IService\ISectionService;
use App\Interface\IRepo\ISectionRepo;

class SectionService extends GenericService implements ISectionService
{
    public function __construct(ISectionRepo $sectionRepository)
    {
        parent::__construct($sectionRepository);
    }
}
