<?php

namespace App\Repo;

use App\Interface\IRepo\IAdmissionApplicationScoreRepo;
use App\Models\AdmissionApplicationScore;
use Spatie\QueryBuilder\AllowedFilter;

class AdmissionApplicationScoreRepo extends GenericRepo implements IAdmissionApplicationScoreRepo
{
    public function __construct()
    {
        parent::__construct(AdmissionApplicationScore::class);
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
            AllowedFilter::exact('admission_application_id'),
            AllowedFilter::exact('academic_program_criteria_id'),
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
