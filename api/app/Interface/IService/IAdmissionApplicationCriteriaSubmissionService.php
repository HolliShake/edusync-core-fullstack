<?php

namespace App\Interface\IService;

interface IAdmissionApplicationCriteriaSubmissionService extends IGenericService
{
    // Add custom service methods here
    public function createOrUpdateMultiple(array $data): array;
}
