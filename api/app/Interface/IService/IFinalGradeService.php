<?php

namespace App\Interface\IService;

interface IFinalGradeService extends IGenericService
{
    // Add custom service methods here
    public function getSync(int $section_id): array;

    public function syncFinalGradeForSection(int $section_id, array $data): array;
}
