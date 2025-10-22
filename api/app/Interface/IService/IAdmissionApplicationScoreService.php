<?php

namespace App\Interface\IService;

interface IAdmissionApplicationScoreService extends IGenericService
{
    // Add custom service methods here
    public function createOrUpdateMultiple(array $data): array;
}
