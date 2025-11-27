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
            AllowedFilter::callback('school_year_id', function ($query, $value) {
                $query->whereHas('curriculumDetail', function ($q) use ($value) {
                    $q->whereHas('curriculum', function ($q) use ($value) {
                        $q->where('school_year_id', $value);
                    });
                });
            }),
            AllowedFilter::callback('academic_program_id', function ($query, $value) {
                $query->whereHas('curriculumDetail', function ($q) use ($value) {
                    $q->whereHas('curriculum', function ($q) use ($value) {
                        $q->where('academic_program_id', $value);
                    });
                });
            }),
            AllowedFilter::callback('curriculum_id', function ($query, $value) {
                $query->whereHas('curriculumDetail', function ($q) use ($value) {
                    $q->where('curriculum_id', $value);
                });
            })
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
