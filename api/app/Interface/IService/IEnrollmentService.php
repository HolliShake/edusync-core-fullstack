<?php

namespace App\Interface\IService;

use Illuminate\Pagination\LengthAwarePaginator;

interface IEnrollmentService extends IGenericService
{
    // Add custom service methods here
    public function createMultiple(array $data): array;
    public function getScholasticFilterByCampusId(int $campusId, ?string $latestStatus, int $schoolYearId): array;
    public function getScholasticFilterByProgramId(int $academicProgramId, ?string $latestStatus, int $schoolYearId): array;
    public function getEnrollmentsByCampusId(int $campusId, ?string $latestStatus, int $schoolYearId, int $yearId, int $termId, int $page = 1, int $rows = 10): LengthAwarePaginator;
    public function getEnrollmentsByProgramId(int $academicProgramId, ?string $latestStatus, int $schoolYearId, int $yearId, int $termId, int $page = 1, int $rows = 10): LengthAwarePaginator;
}
