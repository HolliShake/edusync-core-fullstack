<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "GradeBookScore",
    title: "GradeBookScore",
    type: "object",
    required: [
        // Override required
        'gradebook_item_detail_id',
        'enrollment_id',
        'score',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "gradebook_item_detail_id", type: "integer"),
        new OA\Property(property: "enrollment_id", type: "integer"),
        new OA\Property(property: "score", type: "number"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Relations
        new OA\Property(property: "gradebook_item_detail", ref: "#/components/schemas/GradeBookItemDetail"),
        new OA\Property(property: "enrollment", ref: "#/components/schemas/Enrollment"),
    ]
)]

#[OA\Schema(
    schema: "SyncGradeBookScore",
    type: "object",
    properties: [
        new OA\Property(property: "id", type: "integer", nullable: true, example: 1),
        new OA\Property(property: "gradebook_item_detail_id", type: "integer", example: 1),
        new OA\Property(property: "enrollment_id", type: "integer", example: 1),
        new OA\Property(property: "score", type: "number", format: "decimal", example: 85.50),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradeBookScore",
    title:"PaginatedGradeBookScore",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookScore")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradeBookScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedGradeBookScore")
    ]
)]

#[OA\Schema(
    schema: "GetSyncGradeBookScoresResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/SyncGradeBookScore"))
    ]
)]

#[OA\Schema(
    schema: "GetGradeBookScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookScore"))
    ]
)]

#[OA\Schema(
    schema: "CreateGradeBookScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookScore")
    ]
)]

#[OA\Schema(
    schema: "UpdateGradeBookScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBookScore")
    ]
)]

#[OA\Schema(
    schema: "DeleteGradeBookScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class GradeBookScore extends Model
{
    protected $table = 'gradebook_score';

    public $timestamps = true;

    protected $fillable = [
        'gradebook_item_detail_id',
        'enrollment_id',
        'score',
    ];

    protected $casts = [
        'gradebook_item_detail_id' => 'integer',
        'enrollment_id' => 'integer',
        'score' => 'decimal:2',
    ];

    protected $appends = [
        'gradebook_item_detail',
        'enrollment',
    ];

    /**
     * Get the gradebook item detail that owns the score.
     *
     * @return GradeBookItemDetail
     */
    public function getGradebookItemDetailAttribute(): GradeBookItemDetail
    {
        return $this->gradebookItemDetail()->first();
    }

    /**
     * Get the enrollment that owns the score.
     *
     * @return Enrollment
     */
    public function getEnrollmentAttribute(): Enrollment
    {
        return $this->enrollment()->first();
    }

    /**
     * Get the gradebook item detail that owns the score.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function gradebookItemDetail(): BelongsTo
    {
        return $this->belongsTo(GradeBookItemDetail::class);
    }

    /**
     * Get the enrollment that owns the score.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }
}
