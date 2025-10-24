<?php

namespace App\Interface\IService;

interface IEnrollmentService extends IGenericService
{
    // Add custom service methods here
    public function createMultiple(array $data): array;
}
