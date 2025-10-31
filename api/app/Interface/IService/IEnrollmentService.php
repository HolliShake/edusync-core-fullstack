<?php

namespace App\Interface\IService;


interface IEnrollmentService extends IGenericService
{
    // Add custom service methods here
    public function createMultiple(array $data): array;

    public function getScholasticFilter(int $academicProgramId, ?string $latestStatus, int $schoolYearId): array;

    public function getEnrollmentsByAcademicProgramId(int $academicProgramId, ?string $latestStatus, int $schoolYearId, int $yearId, int $termId, int $page = 1, int $rows = 10);
}
