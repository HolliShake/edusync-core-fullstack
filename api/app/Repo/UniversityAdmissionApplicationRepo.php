<?php

namespace App\Repo;

use App\Interface\IRepo\IUniversityAdmissionApplicationRepo;
use App\Models\UniversityAdmissionApplication;
use Spatie\QueryBuilder\AllowedFilter;

class UniversityAdmissionApplicationRepo extends GenericRepo implements IUniversityAdmissionApplicationRepo
{
    public function __construct()
    {
        parent::__construct(UniversityAdmissionApplication::class);
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
            AllowedFilter::exact('university_admission_id'),
            AllowedFilter::callback('university_admission_schedule_id', function ($query, $value) {
                $query->whereHas('universityAdmissionSchedule', function ($q) use ($value) {
                    $q->where('id', $value);
                });
            }),
            AllowedFilter::callback('latest_status', function ($query, $value) {
                $query->whereHas('latestStatus', function ($q) use ($value) {
                    $q->where('type', $value);
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
