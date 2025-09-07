<?php

namespace App\Service;

use App\interface\IService\IGenericService;
use App\interface\IRepo\IGenericRepo;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class GenericService implements IGenericService
{
    protected IGenericRepo $repository;

    public function __construct(IGenericRepo $repository)
    {
        $this->repository = $repository;
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
        return $this->repository->getAll($paginate, $page, $rows);
    }

    /**
     * Get a record by ID with optional relations
     * @param int|string $id The ID of the record
     * @param array $relations Optional relations to load
     * @return Model The found model
     */
    public function getById(int|string $id, array $relations = []): Model
    {
        return $this->repository->getById($id, $relations);
    }

    /**
     * Create a new record
     * @param array $data Data for creating the record
     * @return Model The created model
     */
    public function create(array $data): Model
    {
        // Apply any business logic before creation
        $data = $this->beforeCreate($data);

        $model = $this->repository->create($data);

        // Apply any business logic after creation
        $this->afterCreate($model, $data);

        return $model;
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
        // Apply any business logic before update
        $data = $this->beforeUpdate($id, $data);

        $model = $this->repository->update($id, $data, $relations);

        // Apply any business logic after update
        $this->afterUpdate($model, $data);

        return $model;
    }

    /**
     * Delete a record by ID
     * @param int|string $id The ID of the record to delete
     * @param array $relations Optional relations to load before deletion
     * @return bool True if deletion was successful
     */
    public function delete(int|string $id, array $relations = []): bool
    {
        // Apply any business logic before deletion
        $this->beforeDelete($id);

        $result = $this->repository->delete($id, $relations);

        // Apply any business logic after deletion
        if ($result) {
            $this->afterDelete($id);
        }

        return $result;
    }

    /**
     * Hook method called before creating a record
     * Override this method in child classes to add custom business logic
     * @param array $data Data for creating the record
     * @return array Modified data
     */
    protected function beforeCreate(array $data): array
    {
        return $data;
    }

    /**
     * Hook method called after creating a record
     * Override this method in child classes to add custom business logic
     * @param Model $model The created model
     * @param array $data The data used for creation
     * @return void
     */
    protected function afterCreate(Model $model, array $data): void
    {
        // Override in child classes if needed
    }

    /**
     * Hook method called before updating a record
     * Override this method in child classes to add custom business logic
     * @param int|string $id The ID of the record to update
     * @param array $data Data for updating the record
     * @return array Modified data
     */
    protected function beforeUpdate(int|string $id, array $data): array
    {
        return $data;
    }

    /**
     * Hook method called after updating a record
     * Override this method in child classes to add custom business logic
     * @param Model $model The updated model
     * @param array $data The data used for update
     * @return void
     */
    protected function afterUpdate(Model $model, array $data): void
    {
        // Override in child classes if needed
    }

    /**
     * Hook method called before deleting a record
     * Override this method in child classes to add custom business logic
     * @param int|string $id The ID of the record to delete
     * @return void
     */
    protected function beforeDelete(int|string $id): void
    {
        // Override in child classes if needed
    }

    /**
     * Hook method called after deleting a record
     * Override this method in child classes to add custom business logic
     * @param int|string $id The ID of the deleted record
     * @return void
     */
    protected function afterDelete(int|string $id): void
    {
        // Override in child classes if needed
    }
}
