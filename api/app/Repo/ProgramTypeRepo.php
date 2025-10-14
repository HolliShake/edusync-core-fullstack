<?php

namespace App\Repo;

use App\Interface\IRepo\IProgramTypeRepo;
use App\Models\ProgramType;
use Spatie\QueryBuilder\AllowedFilter;

class ProgramTypeRepo extends GenericRepo implements IProgramTypeRepo
{
    public function __construct()
    {
        parent::__construct(ProgramType::class);
    }

    /**
     * Define allowed filters for the query builder
     * @return array
     */
    protected function getAllowedFilters(): array
    {
        return [
            // Add room-specific filters here
            AllowedFilter::partial('name'),
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
            'name',
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
