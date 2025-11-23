<?php

namespace App\Interface\IService;

interface IGradingPeriodGradeService extends IGenericService
{
    // Add custom service methods here
    public function getSync($section_id);

    public function syncGradingPeriodGradeForSection($section_id, array $data);
}
