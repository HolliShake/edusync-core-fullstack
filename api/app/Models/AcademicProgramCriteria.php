<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AcademicProgramCriteria",
    title: "AcademicProgramCriteria",
    type: "object",
    required: [
        // Override required
        'academic_program_id',
        'school_year_id',
        'title',
        'max_score',
        'min_score',
        'weight',
        'is_active',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "academic_program_id", type: "integer", example: 1),
        new OA\Property(property: "school_year_id", type: "integer", example: 1),
        new OA\Property(property: "title", type: "string", example: "Academic Performance"),
        new OA\Property(property: "description", type: "string", nullable: true, example: "Evaluation based on academic records"),
        new OA\Property(property: "max_score", type: "integer", example: 100),
        new OA\Property(property: "min_score", type: "integer", example: 0),
        new OA\Property(property: "weight", type: "integer", example: 50),
        new OA\Property(property: "is_active", type: "boolean", example: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2024-01-01T00:00:00.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2024-01-01T00:00:00.000000Z"),
        // Relation
        new OA\Property(property: "academicProgram", ref: "#/components/schemas/AcademicProgram"),
        new OA\Property(property: "schoolYear", ref: "#/components/schemas/SchoolYear"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAcademicProgramCriteria",
    title:"PaginatedAcademicProgramCriteria",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AcademicProgramCriteria")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAcademicProgramCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAcademicProgramCriteria")
    ]
)]

#[OA\Schema(
    schema: "GetAcademicProgramCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicProgramCriteria")
    ]
)]

#[OA\Schema(
    schema: "GetAcademicProgramCriteriasResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AcademicProgramCriteria"))
    ]
)]

#[OA\Schema(
    schema: "CreateAcademicProgramCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicProgramCriteria")
    ]
)]

#[OA\Schema(
    schema: "UpdateAcademicProgramCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicProgramCriteria")
    ]
)]

#[OA\Schema(
    schema: "DeleteAcademicProgramCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AcademicProgramCriteria extends Model
{
    protected $table = 'academic_program_criteria';

    public $timestamps = true;

    protected $fillable = [
        'academic_program_id',
        'school_year_id',
        'title',
        'description',
        'max_score',
        'min_score',
        'weight',
        'is_active',
    ];

    protected $casts = [
        'max_score' => 'integer',
        'min_score' => 'integer',
        'weight' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'academicProgram',
        'schoolYear',
    ];

    /**
     * Get the academic program that owns the academic program criteria.
     *
     * @return AcademicProgram
     */
    public function getAcademicProgramAttribute(): AcademicProgram
    {
        return $this->academicProgram()->first();
    }

    /**
     * Get the school year that owns the academic program criteria.
     *
     * @return SchoolYear
     */
    public function getSchoolYearAttribute(): SchoolYear
    {
        return $this->schoolYear()->first();
    }

    /**
     * Get the academic program that owns the academic program criteria.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicProgram(): BelongsTo
    {
        return $this->belongsTo(AcademicProgram::class, 'academic_program_id');
    }

    /**
     * Get the school year that owns the academic program criteria.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYear(): BelongsTo
    {
        return $this->belongsTo(SchoolYear::class, 'school_year_id');
    }
}
