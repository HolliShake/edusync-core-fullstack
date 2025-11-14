<?php

namespace App\Repo;

use App\Interface\IRepo\ICurriculumTaggingRepo;
use App\Models\CurriculumTagging;
use Spatie\QueryBuilder\AllowedFilter;

class CurriculumTaggingRepo extends GenericRepo implements ICurriculumTaggingRepo
{
    public function __construct()
    {
        parent::__construct(CurriculumTagging::class);
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
            AllowedFilter::exact('curriculum_id'),
            AllowedFilter::callback('academic_program_id', function ($query, $value) {
                $query->whereHas('curriculum', function ($q) use ($value) {
                    $q->where('academic_program_id', $value);
                });
            }),
            AllowedFilter::callback('college_id', function ($query, $value) {
                $query->whereHas('curriculum.academicProgram', function ($q) use ($value) {
                    $q->whereHas('college', function ($q) use ($value) {
                        $q->where('id', $value);
                    });
                });
            }),
            AllowedFilter::callback('campus_id', function ($query, $value) {
                $query->whereHas('curriculum.academicProgram.college', function ($q) use ($value) {
                    $q->whereHas('campus', function ($q) use ($value) {
                        $q->where('id', $value);
                    });
                });
            }),
            AllowedFilter::callback('search', function ($query, $value) {
                $query->where(function ($q) use ($value) {
                    $q->whereHas('user', function ($userQuery) use ($value) {
                        $userQuery->where('name', 'LIKE', "%{$value}%")
                            ->orWhere('email', 'LIKE', "%{$value}%");
                    })
                    ->orWhereHas('curriculum', function ($curriculumQuery) use ($value) {
                        $curriculumQuery->where('curriculum_name', 'LIKE', "%{$value}%")
                            ->orWhereHas('academicProgram', function ($programQuery) use ($value) {
                                $programQuery->where('program_name', 'LIKE', "%{$value}%")
                                    ->orWhereHas('college', function ($collegeQuery) use ($value) {
                                        $collegeQuery->where('college_name', 'LIKE', "%{$value}%");
                                    });
                            });
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
