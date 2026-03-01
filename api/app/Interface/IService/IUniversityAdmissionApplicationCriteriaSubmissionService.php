<?php

namespace App\Interface\IService;

interface IUniversityAdmissionApplicationCriteriaSubmissionService extends IGenericService
{
    // Add custom service methods here
    public function updateScores(array $scores): array;
}
