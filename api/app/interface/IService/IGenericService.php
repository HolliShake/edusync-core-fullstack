<?php

namespace App\interface\IService;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface IGenericService
{
    /**
     * Get all records with optional filters
     * @param array $filters Optional filters to apply
     * @return Collection Collection of models
     */
    public function getAll(array $filters = []): Collection;
    
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