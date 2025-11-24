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
            AllowedFilter::callback('campus_id', function ($query, $value) { // For campus registrar | scheduler to filter rooms by building
                $valueNum = filter_var($value, FILTER_VALIDATE_INT);
                $query->whereHas('building', function ($q) use ($valueNum) {
                    $q->where('campus_id', $valueNum);
                });
            }),
            AllowedFilter::callback('college_id', function ($query, $value) { // For college dean to filter rooms by college
                $valueNum = filter_var($value, FILTER_VALIDATE_INT);
                $query->whereHas('building', function ($q) use ($valueNum) {
                    $q->whereHas('campus', function ($q) use ($valueNum) {
                        $q->where('college_id', $valueNum);
                    });
                });
            }),
            AllowedFilter::callback('academic_program_id', function ($query, $value) { // For program chair to filter rooms by academic program
                $valueNum = filter_var($value, FILTER_VALIDATE_INT);
                $query->whereHas('building.campus.colleges.academicPrograms', function ($q) use ($valueNum) {
                    $q->where('academic_program.id', $valueNum);
                });
            })
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
