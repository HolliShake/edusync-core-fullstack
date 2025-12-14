<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "TestingCenter",
    title: "TestingCenter",
    type: "object",
    required: [
        // Override required
        'room_id',
        'code',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "room_id", type: "integer", example: 1),
        new OA\Property(property: "code", type: "string", example: "TC-001"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00.000000Z"),
        // Relation
        new OA\Property(property: "room", ref: "#/components/schemas/Room"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedTestingCenter",
    title:"PaginatedTestingCenter",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/TestingCenter")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedTestingCenterResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedTestingCenter")
    ]
)]

#[OA\Schema(
    schema: "GetTestingCenterResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/TestingCenter")
    ]
)]

#[OA\Schema(
    schema: "GetTestingCentersResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/TestingCenter"))
    ]
)]

#[OA\Schema(
    schema: "CreateTestingCenterResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/TestingCenter")
    ]
)]

#[OA\Schema(
    schema: "UpdateTestingCenterResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/TestingCenter")
    ]
)]

#[OA\Schema(
    schema: "DeleteTestingCenterResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class TestingCenter extends Model
{
    protected $table = 'testing_center';

    protected $fillable = [
        'room_id',
        'code',
    ];

    protected $appends = [
        'room',
    ];

    /**
     * Get the room that the testing center belongs to.
     *
     * @return Room
     */
    public function getRoomAttribute(): Room
    {
        return $this->room()->first();
    }

    /**
     * Get the room that the testing center belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
