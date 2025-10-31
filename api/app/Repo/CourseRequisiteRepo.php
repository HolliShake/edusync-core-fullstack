<?php

namespace App\Repo;

use App\Interface\IRepo\ICourseRequisiteRepo;
use App\Models\CourseRequisite;
use Spatie\QueryBuilder\AllowedFilter;

class CourseRequisiteRepo extends GenericRepo implements ICourseRequisiteRepo
{
    public function __construct()
    {
        parent::__construct(CourseRequisite::class);
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
            AllowedFilter::exact('course_id'),
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
