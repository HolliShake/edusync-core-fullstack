<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "GradeBookItem",
    title: "GradeBookItem",
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
        new OA\Property(property: "title", type: "string", example: "Gradebook Item 1"),
        new OA\Property(property: "weight", type: "number", example: 100),
        // Relations
        new OA\Property(property: "gradebook", ref: "#/components/schemas/GradeBook"),
        new OA\Property(property: "gradebook_item_details", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookItemDetail")),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradeBookItem",
    title:"PaginatedGradeBookItem",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookItem")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradeBookItemResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedGradeBookItem")
    ]
)]

#[OA\Schema(
    schema: "GetGradeBookItemResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookItem")
    ]
)]

#[OA\Schema(
    schema: "GetGradeBookItemsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookItem"))
    ]
)]

#[OA\Schema(
    schema: "CreateGradeBookItemResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookItem")
    ]
)]

#[OA\Schema(
    schema: "UpdateGradeBookItemResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookItem")
    ]
)]

#[OA\Schema(
    schema: "DeleteGradeBookItemResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class GradeBookItem extends Model
{
    protected $table = 'gradebook_item';

    protected $fillable = [
        'gradebook_id',
        'title',
        'weight',
    ];

    protected $appends = [
        'gradebook',
        'gradebook_item_details',
    ];

    /**
     * Get the gradebook that owns the gradebook item.
     *
     * @return GradeBook
     */
    public function getGradebookAttribute(): GradeBook
    {
        return $this->gradebook()->first();
    }

    /**
     * Get the gradebook item details for the gradebook item.
     *
     * @return array
     */
    public function getGradebookItemDetailsAttribute(): array
    {
        return $this->gradebookItemDetails()->get()->makeHidden(['gradebook_item'])->toArray();
    }

    /**
     * Get the gradebook that owns the gradebook item.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function gradebook(): BelongsTo
    {
        return $this->belongsTo(GradeBook::class, 'gradebook_id');
    }

    /**
     * Get the gradebook item details for the gradebook item.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gradebookItemDetails(): HasMany
    {
        return $this->hasMany(GradeBookItemDetail::class, 'gradebook_item_id');
    }
}
