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
            AllowedFilter::callback('for_freshmen', function ($query, $value) {
                if (!filter_var($value, FILTER_VALIDATE_BOOLEAN)) return;
                $query
                    ->where('is_posted', true)
                    ->whereHas('curriculumDetail', function ($q) use ($query) {
                    $q->where('year_order', 1)
                      ->whereIn('curriculum_id', function ($subQuery) {
                        $subQuery->selectRaw('MAX(id)')
                            ->from('curriculum')
                            ->groupBy('academic_program_id');
                    })
                    ->whereRaw('term_order = (
                        SELECT COUNT(*)
                        FROM academic_calendar
                        WHERE academic_calendar.school_year_id = (
                            SELECT school_year_id
                            FROM section
                            WHERE section.curriculum_detail_id = curriculum_detail.id
                            LIMIT 1
                        )
                        AND academic_calendar.event = "ACADEMIC_TRANSITION"
                        AND DATE(academic_calendar.start_date) <= (
                            SELECT DATE(ac2.start_date)
                            FROM academic_calendar ac2
                            WHERE ac2.school_year_id = (
                                SELECT school_year_id
                                FROM section
                                WHERE section.curriculum_detail_id = curriculum_detail.id
                                LIMIT 1
                            )
                            AND ac2.event = "ACADEMIC_TRANSITION"
                            AND DATE(ac2.start_date) <= CURDATE()
                            ORDER BY ABS(DATEDIFF(ac2.start_date, CURDATE()))
                            LIMIT 1
                        )
                    )');
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
