<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "GradeBookGradingPeriod",
    title: "GradeBookGradingPeriod",
    type: "object",
    required: [
        // Override required
        'title',
        'weight',
        'gradebook_id',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "gradebook_id", type: "integer"),
        new OA\Property(property: "title", type: "string", example: "Grading Period 1"),
        new OA\Property(property: "weight", type: "number", example: 100),
        // Relations
        new OA\Property(property: "gradebook", ref: "#/components/schemas/GradeBook"),
        new OA\Property(property: "gradebook_items", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookItem")),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradeBookGradingPeriod",
    title:"PaginatedGradeBookGradingPeriod",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookGradingPeriod")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradeBookGradingPeriodResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedGradeBookGradingPeriod")
    ]
)]

#[OA\Schema(
    schema: "GetGradeBookGradingPeriodResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookGradingPeriod")
    ]
)]

#[OA\Schema(
    schema: "GetGradeBookGradingPeriodsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookGradingPeriod"))
    ]
)]

#[OA\Schema(
    schema: "CreateGradeBookGradingPeriodResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookGradingPeriod")
    ]
)]

#[OA\Schema(
    schema: "UpdateGradeBookGradingPeriodResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookGradingPeriod")
    ]
)]

#[OA\Schema(
    schema: "DeleteGradeBookGradingPeriodResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class GradeBookGradingPeriod extends Model
{
    protected $table = 'gradebook_grading_period';

    protected $fillable = [
        'gradebook_id',
        'title',
        'weight',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
    ];

    protected $appends = [
        'gradebook',
        'gradebook_items',
    ];

    /**
     * Get the gradebook that owns the gradebook grading period.
     *
     * @return GradeBook
     */
    public function getGradebookAttribute(): GradeBook
    {
        return $this->gradebook()->first();
    }

    /**
     * Get the gradebook items for the gradebook grading period.
     *
     * @return array<GradeBookItem>
     */
    public function getGradebookItemsAttribute(): array
    {
        return $this->gradebookItems()->get()->makeHidden(['gradebook_grading_period'])->toArray();
    }

    /**
     * Get the gradebook that owns the gradebook grading period.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function gradebook(): BelongsTo
    {
        return $this->belongsTo(GradeBook::class);
    }

    /**
     * Get the gradebook items for the gradebook grading period.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gradebookItems(): HasMany
    {
        return $this->hasMany(GradeBookItem::class, 'gradebook_grading_period_id');
    }
}
