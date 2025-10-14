<?php

namespace App\Repo;

use App\Interface\IRepo\IAcademicProgramRepo;
use App\Models\AcademicProgram;
use App\Repo\GenericRepo;
use Spatie\QueryBuilder\AllowedFilter;

class AcademicProgramRepo extends GenericRepo implements IAcademicProgramRepo
{
    public function __construct()
    {
        parent::__construct(AcademicProgram::class);
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
            AllowedFilter::exact('college_id'),
            AllowedFilter::exact('program_type_id'),
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
            'program_name',
            'short_name',
            'year_first_implemented',
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
            'programType',
        ];
    }
}
