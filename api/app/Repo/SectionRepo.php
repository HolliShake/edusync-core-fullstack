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
            }),
            AllowedFilter::callback('for_freshmen', function ($query, $value) {
                if (!filter_var($value, FILTER_VALIDATE_BOOLEAN)) return;

                $query->whereHas('curriculumDetail', function ($q) {
                    $q->where('year_order', 1)
                      ->whereHas('curriculum', function ($q) {
                        $q->whereHas('schoolYear', function ($q) {
                            $q->whereHas('academicCalendars', function ($q) {
                                $q->where('event', 'ENROLLMENT')
                                    ->whereDate('start_date', '<=', now())
                                    ->whereDate('end_date', '>=', now());
                            });
                        });
                    })->where('term_order', '=', function ($subQuery) use ($q) {
                        $subQuery->selectRaw('COUNT(*)')
                            ->from('academic_calendar as ac')
                            ->join('curriculum', 'curriculum.school_year_id', '=', 'ac.school_year_id')
                            ->whereColumn('curriculum.id', 'curriculum_detail.curriculum_id')
                            ->where('ac.event', 'ACADEMIC_TRANSITION')
                            ->whereDate('ac.start_date', '<=', now());
                    });
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
