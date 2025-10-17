<?php

namespace App\Repo;

use App\Interface\IRepo\IGenericRepo;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

abstract class GenericRepo implements IGenericRepo
{
    protected $model;

    public function __construct($model)
    {
        $this->model = $model;
    }

    /**
     * Get all records with optional filters
     * @param bool $paginate Whether to paginate the results
     * @param int $page The page number
     * @param int $rows The number of rows per page
     * @return Collection|LengthAwarePaginator Collection of models
     */
    public function getAll(bool $paginate = false, int $page = 1, int $rows = 10): Collection|LengthAwarePaginator
    {
        $query = QueryBuilder::for($this->model)
            ->allowedFilters($this->getAllowedFilters())
            ->allowedSorts($this->getAllowedSorts())
            ->allowedIncludes($this->getAllowedIncludes());

        // Apply additional filters if provided

        if (!$paginate) {
            return $query->get();
        }

        return $query->paginate($rows, ['*'], "Page {$page}", $page);
    }

    /**
     * Get a record by ID with optional relations
     * @param int|string $id The ID of the record
     * @param array $relations Optional relations to load
     * @return Model The found model
     */
    public function getById(int|string $id, array $relations = []): Model
    {
        $query = QueryBuilder::for($this->model)
            ->allowedIncludes($this->getAllowedIncludes());

        if (!empty($relations)) {
            $query->with($relations);
        }

        return $query->findOrFail($id);
    }

    /**
     * Create a new record
     * @param array $data Data for creating the record
     * @return Model The created model
     */
    public function create(array $data): Model
    {
        return $this->model::create($data);
    }

    /**
     * Create multiple records
     * @param array $data Data for creating the records
     * @return array The created models
     */
    public function createMultiple(array $data): array 
    {
        return collect($data)->map(fn($item) => $this->model::create($item))->toArray();
    }

    /**
     * Update a record by ID
     * @param int|string $id The ID of the record to update
     * @param array $data Data for updating the record
     * @param array $relations Optional relations to load
     * @return Model The updated model
     */
    public function update(int|string $id, array $data, array $relations = []): Model
    {
        $model = $this->getById($id, $relations);
        $model->update($data);
        return $model->fresh($relations);
    }

    /**
     * Delete a record by ID
     * @param int|string $id The ID of the record to delete
     * @param array $relations Optional relations to load before deletion
     * @return bool True if deletion was successful
     */
    public function delete(int|string $id, array $relations = []): bool
    {
        $model = $this->getById($id, $relations);
        return $model->delete();
    }

    /**
     * Define allowed filters for the query builder
     * Override this method in child classes to define specific filters
     * @return array
     */
    protected function getAllowedFilters(): array
    {
        return [
            // Define your allowed filters here
            // Example: AllowedFilter::exact('status'),
            // Example: AllowedFilter::partial('name'),
        ];
    }

    /**
     * Define allowed sorts for the query builder
     * Override this method in child classes to define specific sorts
     * @return array
     */
    protected function getAllowedSorts(): array
    {
        return [
            // Define your allowed sorts here
            // Example: 'created_at', 'updated_at', 'name'
        ];
    }

    /**
     * Define allowed includes for the query builder
     * Override this method in child classes to define specific includes
     * @return array
     */
    protected function getAllowedIncludes(): array
    {
        return [
            // Define your allowed includes here
            // Example: 'posts', 'comments', 'user'
        ];
    }
}
