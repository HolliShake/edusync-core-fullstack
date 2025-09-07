<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Building",
    title: "Building",
    type: "object",
    required: [
        "name",
        "short_name",
        "latitude",
        "longitude",
        "campus_id"
    ],
    properties: [
        new OA\Property(property: "id", type: "integer"),
        new OA\Property(property: "name", type: "string", maxLength: 50),
        new OA\Property(property: "short_name", type: "string", maxLength: 25),
        new OA\Property(property: "latitude", type: "number", format: "float"),
        new OA\Property(property: "longitude", type: "number", format: "float"),
        new OA\Property(property: "campus_id", type: "integer"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time")
    ]
)]

#[OA\Schema(
    schema: "PaginatedBuilding",
    title:"PaginatedBuilding",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Building")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedBuildingResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedBuilding")
    ]
)]

#[OA\Schema(
    schema: "GetBuildingResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Building")
    ]
)]

#[OA\Schema(
    schema: "CreateBuildingResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Building")
    ]
)]

#[OA\Schema(
    schema: "UpdateBuildingResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Building")
    ]
)]

#[OA\Schema(
    schema: "DeleteBuildingResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class Building extends Model
{
    protected $table = 'building';

    protected $fillable = [
        'name',
        'short_name',
        'latitude',
        'longitude',
        'campus_id'
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8'
    ];

    /**
     * Get the campus that owns the building.
     */
    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }
}
