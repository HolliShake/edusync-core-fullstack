<?php

namespace App\Interface\IService;

interface IAcademicCalendarService extends IGenericService
{
    // Add custom service methods here
    public function updateMultiple(array $data): array;
}
