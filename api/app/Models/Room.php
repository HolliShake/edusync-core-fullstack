<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Room",
    title: "Room",
    type: "object",
    required: [
        // Override required
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "name", type: "string", example: "Computer Laboratory 1"),
        new OA\Property(property: "short_name", type: "string", example: "CompLab1"),
        new OA\Property(property: "building_id", type: "integer", example: 1),
        new OA\Property(property: "floor", type: "integer", example: 2),
        new OA\Property(property: "room_code", type: "string", example: "CL-201"),
        new OA\Property(property: "is_lab", type: "boolean", example: true),
        new OA\Property(property: "room_capacity", type: "integer", example: 30),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00Z"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedRoom",
    title:"PaginatedRoom",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Room")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedRoomResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedRoom")
    ]
)]

#[OA\Schema(
    schema: "GetRoomResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Room")
    ]
)]

#[OA\Schema(
    schema: "CreateRoomResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Room")
    ]
)]

#[OA\Schema(
    schema: "UpdateRoomResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Room")
    ]
)]

#[OA\Schema(
    schema: "DeleteRoomResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class Room extends Model
{
    protected $table = 'room';

    protected $fillable = [
        'name',
        'short_name',
        'building_id',
        'floor',
        'room_code',
        'is_lab',
        'room_capacity',
    ];

    protected $casts = [
        'building_id' => 'integer',
        'floor' => 'integer',
        'room_capacity' => 'integer',
        'is_lab' => 'boolean',
    ];

    /**
     * Get the building that owns the room.
     */
    public function building()
    {
        return $this->belongsTo(Building::class);
    }
}
