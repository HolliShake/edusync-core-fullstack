<?php

namespace App\Repo;

use App\Interface\IRepo\IAcademicCalendarRepo;
use App\Models\AcademicCalendar;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedInclude;
use Spatie\QueryBuilder\AllowedSort;

class AcademicCalendarRepo extends GenericRepo implements IAcademicCalendarRepo
{
    public function __construct()
    {
        parent::__construct(AcademicCalendar::class);
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
            AllowedFilter::exact('school_year_id'),
            AllowedFilter::exact('event'),
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
            AllowedSort::field('order', 'order'),
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
            AllowedInclude::relationship('schoolYear'),
        ];
    }
}
