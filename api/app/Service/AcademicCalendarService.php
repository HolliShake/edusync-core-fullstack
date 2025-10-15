<?php

namespace App\Service;

use App\Interface\IService\IAcademicCalendarService;
use App\Interface\IRepo\IAcademicCalendarRepo;

class AcademicCalendarService extends GenericService implements IAcademicCalendarService
{
    public function __construct(IAcademicCalendarRepo $academicCalendarRepository)
    {
        parent::__construct($academicCalendarRepository);
    }
}
