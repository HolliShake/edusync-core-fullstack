<?php

namespace App\Repo;

use App\Interface\IRepo\ISectionTeacherRepo;
use App\Models\SectionTeacher;
use Spatie\QueryBuilder\AllowedFilter;

class SectionTeacherRepo extends GenericRepo implements ISectionTeacherRepo
{
    public function __construct()
    {
        parent::__construct(SectionTeacher::class);
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
            AllowedFilter::callback('academic_program_id', function ($query, $value) {
                $query->whereHas('section.curriculumDetail.curriculum', function ($q) use ($value) {
                    $q->where('academic_program_id', $value);
                });
            }),
            AllowedFilter::callback('school_year_id', function ($query, $value) {
                $query->whereHas('section.curriculumDetail.curriculum', function ($q) use ($value) {
                    $q->whereHas('schoolYear', function ($q) use ($value) {
                        $q->where('id', $value);
                    });
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
