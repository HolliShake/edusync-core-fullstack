<?php

namespace App\Repo;

use App\Interface\IRepo\IRoomRepo;
use App\Models\Room;
use Spatie\QueryBuilder\AllowedFilter;

class RoomRepo extends GenericRepo implements IRoomRepo
{
    public function __construct()
    {
        parent::__construct(Room::class);
    }

    /**
     * Define allowed filters for the query builder
     * @return array
     */
    protected function getAllowedFilters(): array
    {
        return [
            // Add room-specific filters here
            AllowedFilter::exact('building_id'),
            AllowedFilter::exact('floor'),
            AllowedFilter::exact('room_type'),
            AllowedFilter::partial('name'),
            AllowedFilter::partial('room_code'),
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
            'floor',
            'room_capacity',
            'room_code',
        ];
    }

    /**
     * Define allowed includes for the query builder
     * @return array
     */
    protected function getAllowedIncludes(): array
    {
        return [
            'building',
        ];
    }
}
