<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "GradingPeriodGrade",
    title: "GradingPeriodGrade",
    type: "object",
    required: [
        // Override required
        'gradebook_grading_period_id',
        'enrollment_id',
        'grade',
        'is_posted',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "gradebook_grading_period_id", type: "integer"),
        new OA\Property(property: "enrollment_id", type: "integer"),
        new OA\Property(property: "grade", type: "number", format: "float", example: 85.50),
        new OA\Property(property: "is_posted", type: "boolean"),
    ]
)]

#[OA\Schema(
    schema: "SyncGradingPeriodGrade",
    type: "object",
    properties: [
        new OA\Property(property: "id", type: "integer", nullable: true, example: 1),
        new OA\Property(property: "gradebook_grading_period_id", type: "integer", example: 1),
        new OA\Property(property: "enrollment_id", type: "integer", example: 1),
        new OA\Property(property: "grade", type: "number", format: "float", example: 85.50),
        new OA\Property(property: "is_posted", type: "boolean", example: false),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradingPeriodGrade",
    title:"PaginatedGradingPeriodGrade",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradingPeriodGrade")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradingPeriodGradeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedGradingPeriodGrade")
    ]
)]

#[OA\Schema(
    schema: "GetSyncGradingPeriodGradesResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/SyncGradingPeriodGrade"))
    ]
)]

#[OA\Schema(
    schema: "GetGradingPeriodGradeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradingPeriodGrade")
    ]
)]

#[OA\Schema(
    schema: "GetGradingPeriodGradesResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradingPeriodGrade"))
    ]
)]

#[OA\Schema(
    schema: "CreateGradingPeriodGradeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradingPeriodGrade")
    ]
)]

#[OA\Schema(
    schema: "UpdateGradingPeriodGradeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradingPeriodGrade")
    ]
)]

#[OA\Schema(
    schema: "DeleteGradingPeriodGradeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class GradingPeriodGrade extends Model
{
    protected $table = 'grading_period_grade';

    public $timestamps = true;

    protected $fillable = [
        'gradebook_grading_period_id',
        'enrollment_id',
        'grade',
        'is_posted',
    ];

    protected $casts = [
        'grade'     => 'decimal:2',
        'is_posted' => 'boolean',
        'gradebook_grading_period_id' => 'integer',
        'enrollment_id' => 'integer',
    ];

    protected $appends = [
        'gradebook_grading_period',
        'enrollment',
    ];

    /**
     * Get the gradebook grading period that owns the grading period grade.
     *
     * @return GradeBookGradingPeriod
     */
    public function getGradebookGradingPeriodAttribute(): GradeBookGradingPeriod
    {
        return $this->gradebookGradingPeriod()->first();
    }

    /**
     * Get the enrollment that owns the grading period grade.
     *
     * @return Enrollment
     */
    public function getEnrollmentAttribute(): Enrollment
    {
        return $this->enrollment()->first();
    }

    /**
     * Get the gradebook grading period that owns the grading period grade.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function gradebookGradingPeriod(): BelongsTo
    {
        return $this->belongsTo(GradeBookGradingPeriod::class);
    }

    /**
     * Get the enrollment that owns the grading period grade.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }
}
