<?php

namespace App\Repo;

use App\Interface\IRepo\ISectionRepo;
use App\Models\Section;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedInclude;

class SectionRepo extends GenericRepo implements ISectionRepo
{
    public function __construct()
    {
        parent::__construct(Section::class);
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
            AllowedFilter::exact('curriculumDetail.curriculum_id'),
            AllowedFilter::exact('school_year_id'),
        ];
    }

    /**
     * Define allowed sorts for the query builder
     * @return array
     */
    protected function getAllowedSorts(): array
    {
        return [
            // 'created_at',
            // 'updated_at',
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
            // Example: 'departments', 'buildings', 'students',
            AllowedInclude::relationship('curriculumDetail'),
            AllowedInclude::relationship('schoolYear'),
        ];
    }
}
