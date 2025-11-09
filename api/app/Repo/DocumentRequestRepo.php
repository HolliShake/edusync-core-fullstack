<?php

namespace App\Repo;

use App\Interface\IRepo\IDocumentRequestRepo;
use App\Models\DocumentRequest;
use Spatie\QueryBuilder\AllowedFilter;

class DocumentRequestRepo extends GenericRepo implements IDocumentRequestRepo
{
    public function __construct()
    {
        parent::__construct(DocumentRequest::class);
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
            AllowedFilter::callback('latest_status', function ($query, $value) {
                $query->whereHas('latestStatus', function ($q) use ($value) {
                    $q->where('action', $value);
                });
            }),
            AllowedFilter::exact('user_id'),
            AllowedFilter::exact('campus_id'),
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
