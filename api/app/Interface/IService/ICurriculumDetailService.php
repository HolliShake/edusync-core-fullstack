<?php

namespace App\Interface\IService;

interface ICurriculumDetailService extends IGenericService
{
    // Add custom service methods here
    public function createMultiple(array $data): array;
}
