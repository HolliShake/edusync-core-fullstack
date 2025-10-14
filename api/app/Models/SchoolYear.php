<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "SchoolYear",
    title: "SchoolYear",
    type: "object",
    required: [
        "school_year_code",
        "name",
        "start_date",
        "end_date",
        "is_active",
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "school_year_code", type: "string", example: "2024-2025"),
        new OA\Property(property: "name", type: "string", example: "AY 2024-2025"),
        new OA\Property(property: "start_date", type: "string", format: "date", example: "2024-06-01"),
        new OA\Property(property: "end_date", type: "string", format: "date", example: "2025-05-31"),
        new OA\Property(property: "is_active", type: "boolean", example: false),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Computed props
        new OA\Property(property: "is_locked", type: "boolean", readOnly: true),
        new OA\Property(property: "is_current", type: "boolean", readOnly: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedSchoolYear",
    title:"PaginatedSchoolYear",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/SchoolYear")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedSchoolYearResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedSchoolYear")
    ]
)]

#[OA\Schema(
    schema: "GetSchoolYearResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/SchoolYear")
    ]
)]

#[OA\Schema(
    schema: "GetSchoolYearsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/SchoolYear"))
    ]
)]

#[OA\Schema(
    schema: "CreateSchoolYearResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/SchoolYear")
    ]
)]

#[OA\Schema(
    schema: "UpdateSchoolYearResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/SchoolYear")
    ]
)]

#[OA\Schema(
    schema: "DeleteSchoolYearResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class SchoolYear extends Model
{
    //
    protected $table = 'school_year';

    public $timestamps = true;

    protected $fillable = [
        'school_year_code',
        'name',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'is_locked',
        'is_current',
    ];

    /**
     * Get the is_locked attribute.
     *
     * @return bool
     */
    public function getIsLockedAttribute(): bool
    {
        // Locked if not active or today is not within the date range
        return $this->is_active === false ||
            !(now()->between($this->start_date, $this->end_date));
    }

    /**
     * Get the is_current attribute.
     *
     * @return bool
     */
    public function getIsCurrentAttribute(): bool
    {
        $current = now();
        // Get all school years that start after this one ends
        $newer = self::where('start_date', '>', $this->end_date)->count();
        // Mark as current only if today is within range and there are no newer school years
        return $current->between($this->start_date, $this->end_date) && $newer === 0;
    }
}
