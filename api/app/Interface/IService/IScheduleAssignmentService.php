<?php

namespace App\Interface\IService;

interface IScheduleAssignmentService extends IGenericService
{
    // Add custom service methods here
    public function getBySectionCode(string $section_code);
}
