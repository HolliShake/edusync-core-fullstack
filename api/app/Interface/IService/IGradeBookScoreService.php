<?php

namespace App\Interface\IService;

interface IGradeBookScoreService extends IGenericService
{
    // Add custom service methods here
    public function getSync($section_id);

    public function syncScoreForSection($section_id, array $data);
}
