<?php

namespace App\Repo;

use App\Enum\EnrollmentLogActionEnum;
use App\Interface\IRepo\IEnrollmentRepo;
use App\Models\Enrollment;
use Spatie\QueryBuilder\AllowedFilter;

class EnrollmentRepo extends GenericRepo implements IEnrollmentRepo
{
    public function __construct()
    {
        parent::__construct(Enrollment::class);
    }

    /**
     * Define allowed filters for the query builder
     * @return array
     */
    protected function getAllowedFilters(): array
    {
        return [
            // Add campus-specific filters here
            // Example: AllowedFilter::exact('status'),
            // Example: AllowedFilter::partial('name'),
            AllowedFilter::exact('user_id'),
            AllowedFilter::exact('section_id'),
            AllowedFilter::callback('officially_enrolled', function ($query, $value) {
                $query->whereDoesntHave('enrollmentLogs', function ($q) {
                    $q->where('action', EnrollmentLogActionEnum::REGISTRAR_DROPPED_APPROVED->value);
                });
            }),
        ];
    }

    /**
     * Define allowed sorts for the query builder
     * @return array
     */
    protected function getAllowedSorts(): array
    {
        return [
            'created_at',
            'updated_at',
            // Add other campus-specific sortable fields
        ];
    }

    /**
     * Define allowed includes for the query builder
     * @return array
     */
    protected function getAllowedIncludes(): array
    {
        return [
            // Add campus-specific relationships here
            // Example: 'departments', 'buildings', 'students'
        ];
    }
}
