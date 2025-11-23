<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "FinalGrade",
    title: "FinalGrade",
    type: "object",
    required: [
        // Override required
        'enrollment_id',
        'grade',
        'credited_units',
        'is_posted',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "enrollment_id", type: "integer"),
        new OA\Property(property: "grade", type: "number", format: "float", example: 85.50),
        new OA\Property(property: "credited_units", type: "integer", example: 3),
        new OA\Property(property: "is_posted", type: "boolean", example: false),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Relations
        new OA\Property(property: "enrollment", ref: "#/components/schemas/Enrollment"),
    ]
)]

#[OA\Schema(
    schema: "SyncFinalGrade",
    type: "object",
    properties: [
        new OA\Property(property: "id", type: "integer", nullable: true, example: 1),
        new OA\Property(property: "enrollment_id", type: "integer", example: 1),
        new OA\Property(property: "grade", type: "number", format: "float", example: 85.50),
        new OA\Property(property: "credited_units", type: "integer", example: 3),
        new OA\Property(property: "recommended_grade", type: "number", format: "float", example: 85.50),
        new OA\Property(property: "is_overridden", type: "boolean", example: false),
        new OA\Property(property: "is_posted", type: "boolean", example: false),
        new OA\Property(property: "is_passed", type: "boolean", example: false),
    ]
)]

#[OA\Schema(
    schema: "PaginatedFinalGrade",
    title:"PaginatedFinalGrade",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/FinalGrade")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedFinalGradeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedFinalGrade")
    ]
)]

#[OA\Schema(
    schema: "GetSyncFinalGradesResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/SyncFinalGrade"))
    ]
)]

#[OA\Schema(
    schema: "GetFinalGradeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/FinalGrade"))
    ]
)]

#[OA\Schema(
    schema: "CreateFinalGradeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/FinalGrade")
    ]
)]

#[OA\Schema(
    schema: "UpdateFinalGradeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/FinalGrade")
    ]
)]

#[OA\Schema(
    schema: "DeleteFinalGradeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class FinalGrade extends Model
{
    protected $table = 'final_grade';

    public $timestamps = true;

    protected $fillable = [
        'enrollment_id',
        'grade',
        'credited_units',
        'is_posted',
    ];

    protected $casts = [
        'grade' => 'decimal:2',
        'credited_units' => 'integer',
        'is_posted' => 'boolean',
        'enrollment_id' => 'integer',
    ];

    protected $appends = [
        'enrollment',
    ];

    /**
     * Get the enrollment that owns the final grade.
     *
     * @return Enrollment
     */
    public function getEnrollmentAttribute(): Enrollment
    {
        return $this->enrollment()->first();
    }

    /**
     * Get the enrollment that owns the final grade.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class, 'enrollment_id', 'id');
    }
}
