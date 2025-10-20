<?php

namespace App\Repo;

use App\Interface\IRepo\IAdmissionApplicationRepo;
use App\Models\AdmissionApplication;
use Spatie\QueryBuilder\AllowedFilter;

class AdmissionApplicationRepo extends GenericRepo implements IAdmissionApplicationRepo
{
    public function __construct()
    {
        parent::__construct(AdmissionApplication::class);
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
            AllowedFilter::exact('school_year_id'),
            AllowedFilter::exact('academic_program_id'),
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
