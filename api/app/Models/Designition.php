<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Designition",
    title: "Designition",
    type: "object",
    required: [
        // Override required
        'user_id',
        'designitionable_id',
        'designitionable_type',
        'is_active',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "user_id", type: "integer", example: 1),
        new OA\Property(property: "is_active", type: "boolean", example: true),
        new OA\Property(property: "designitionable_id", type: "integer", example: 1),
        new OA\Property(property: "designitionable_type", type: "string", example: "App\\Models\\AcademicProgram"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00.000000Z"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedDesignition",
    title:"PaginatedDesignition",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Designition")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
        // relation
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
        new OA\Property(property: "designitionable", oneOf: [
            new OA\Schema(ref: "#/components/schemas/AcademicProgram"),
            new OA\Schema(ref: "#/components/schemas/College"),
            new OA\Schema(ref: "#/components/schemas/Campus"),
        ]),
    ]
)]

#[OA\Schema(
    schema: "PaginatedDesignitionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedDesignition")
    ]
)]

#[OA\Schema(
    schema: "GetDesignitionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Designition")
    ]
)]

#[OA\Schema(
    schema: "GetDesignitionsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Designition"))
    ]
)]

#[OA\Schema(
    schema: "CreateDesignitionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Designition")
    ]
)]

#[OA\Schema(
    schema: "UpdateDesignitionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Designition")
    ]
)]

#[OA\Schema(
    schema: "DeleteDesignitionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class Designition extends Model
{
    protected $table = 'designition';

    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'designitionable_id',
        'designitionable_type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'designitionable_type' => 'string',
        'designitionable_id' => 'integer',
        'user_id' => 'integer',
    ];

    protected $appends = [
        'user',
        'designitionable',
    ];

    /**
     * Get the user that owns the designition.
     *
     * @return \App\Models\User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first();
    }

    /**
     * Get the designitionable that owns the designition.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function getDesignitionableAttribute(): Model
    {
        return $this->designitionable()->first();
    }

    /**
     * Get the user that owns the designition.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the designitionable that owns the designition.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function designitionable(): MorphTo
    {
        return $this->morphTo();
    }
}
