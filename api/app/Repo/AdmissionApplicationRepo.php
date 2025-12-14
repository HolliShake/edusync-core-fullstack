<?php

namespace App\Repo;

use App\Enum\AcademicCalendarEventEnum;
use App\Interface\IRepo\IAdmissionApplicationRepo;
use App\Models\AdmissionApplication;
use Spatie\QueryBuilder\AllowedFilter;

class AdmissionApplicationRepo extends GenericRepo implements IAdmissionApplicationRepo
{
    public function __construct()
    {
        parent::__construct(AdmissionApplication::class);
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
            AllowedFilter::exact('admission_schedule_id'),
            AllowedFilter::callback('name', function ($query, $value) {
                $query->where(function ($q) use ($value) {
                    $q->where('first_name', 'LIKE', "%{$value}%")
                      ->orWhere('last_name', 'LIKE', "%{$value}%");
                });
            }),
            AllowedFilter::callback('latest_status', function ($query, $value) {
                $query->whereHas('latestStatus', function ($q) use ($value) {
                    $q->where('type', $value);
                });
            }),
            AllowedFilter::callback('open_enrollment', function ($query, $value) {
                $query->whereHas('admissionSchedule', function ($q) {
                    $q->where('start_date', '<=', now())
                      ->where('end_date', '>=', now());
                });
            }),
            AllowedFilter::exact('user_id'),
            AllowedFilter::callback('school_year_id', function ($query, $value) {
                $query->whereHas('admissionSchedule.universityAdmission.schoolYear', function ($q) use ($value) {
                    $q->where('id', $value);
                });
            }),
            AllowedFilter::callback('academic_program_id', function ($query, $value) {
                $query->whereHas('admissionSchedule.academicProgram', function ($q) use ($value) {
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
