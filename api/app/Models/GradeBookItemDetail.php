<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "GradeBookItemDetail",
    title: "GradeBookItemDetail",
    type: "object",
    required: [
        // Override required
        'title',
        'min_score',
        'max_score',
        'weight',
        'gradebook_item_id',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "gradebook_item_id", type: "integer"),
        new OA\Property(property: "title", type: "string", example: "Gradebook Item Detail 1"),
        new OA\Property(property: "min_score", type: "number", example: 0),
        new OA\Property(property: "max_score", type: "number", example: 100),
        new OA\Property(property: "weight", type: "number", example: 100),
        // Relations
        new OA\Property(property: "gradebook_item", ref: "#/components/schemas/GradeBookItem"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradeBookItemDetail",
    title:"PaginatedGradeBookItemDetail",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookItemDetail")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradeBookItemDetailResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedGradeBookItemDetail")
    ]
)]

#[OA\Schema(
    schema: "GetGradeBookItemDetailResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookItemDetail")
    ]
)]

#[OA\Schema(
    schema: "GetGradeBookItemDetailsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookItemDetail"))
    ]
)]

#[OA\Schema(
    schema: "CreateGradeBookItemDetailResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookItemDetail")
    ]
)]

#[OA\Schema(
    schema: "UpdateGradeBookItemDetailResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookItemDetail")
    ]
)]

#[OA\Schema(
    schema: "DeleteGradeBookItemDetailResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class GradeBookItemDetail extends Model
{
    protected $table = 'gradebook_item_detail';

    protected $fillable = [
        'gradebook_item_id',
        'title',
        'min_score',
        'max_score',
        'weight',
    ];

    protected $appends = [
        'gradebook_item',
    ];

    /**
     * Get the gradebook item that owns the gradebook item detail.
     *
     * @return GradeBookItem
     */
    public function getGradebookItemAttribute(): GradeBookItem
    {
        return $this->gradebookItem()->first();
    }

    /**
     * Get the gradebook item that owns the gradebook item detail.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function gradebookItem(): BelongsTo
    {
        return $this->belongsTo(GradeBookItem::class, 'gradebook_item_id');
    }
}
