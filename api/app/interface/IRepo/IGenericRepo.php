<?php

namespace App\interface\IRepo;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface IGenericRepo
{
    /**
     * Get all records with optional filters
     * @param bool $paginate Whether to paginate the results
     * @param int $page The page number
     * @param int $rows The number of rows per page
     * @return Collection|LengthAwarePaginator Collection of models
     */
    public function getAll(bool $paginate = false, int $page = 1, int $rows = 10): Collection|LengthAwarePaginator;

    /**
     * Get a record by ID with optional relations
     * @param int|string $id The ID of the record
     * @param array $relations Optional relations to load
     * @return Model The found model
     */
    public function getById(int|string $id, array $relations = []): Model;

    /**
     * Create a new record
     * @param array $data Data for creating the record
     * @return Model The created model
     */
    public function create(array $data): Model;

    /**
     * Update a record by ID
     * @param int|string $id The ID of the record to update
     * @param array $data Data for updating the record
     * @param array $relations Optional relations to load
     * @return Model The updated model
     */
    public function update(int|string $id, array $data, array $relations = []): Model;

    /**
     * Delete a record by ID
     * @param int|string $id The ID of the record to delete
     * @param array $relations Optional relations to load before deletion
     * @return bool True if deletion was successful
     */
    public function delete(int|string $id, array $relations = []): bool;
}
