<?php

namespace App\Repo;

use App\Interface\IRepo\IAdmissionCriteriaRepo;
use App\Models\AdmissionCriteria;
use Spatie\QueryBuilder\AllowedFilter;

class AdmissionCriteriaRepo extends GenericRepo implements IAdmissionCriteriaRepo
{
    public function __construct()
    {
        parent::__construct(AdmissionCriteria::class);
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
            AllowedFilter::exact('academic_program_id'),
            AllowedFilter::exact('admission_schedule_id'),
            AllowedFilter::exact('requirement_id'),
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
