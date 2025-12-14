<?php

namespace App\Repo;

use App\Interface\IRepo\IAdmissionScheduleRepo;
use App\Models\AdmissionSchedule;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

class AdmissionScheduleRepo extends GenericRepo implements IAdmissionScheduleRepo
{
    public function __construct()
    {
        parent::__construct(AdmissionSchedule::class);
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
            AllowedFilter::exact('academic_program_id'),
            AllowedFilter::exact('university_admission_id'),
            AllowedFilter::exact('admission_schedule_id'),
            AllowedFilter::callback('college_id', function ($query, $value) {
                $query->where('start_date', '<=', now())
                    ->where('end_date', '>=', now())
                    ->whereHas('academicProgram.college', function ($q) use ($value) {
                        $q->where('id', $value);
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
            AllowedSort::field('start_date', 'start_date'),
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
