<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AdmissionCriteria",
    title: "AdmissionCriteria",
    type: "object",
    required: [
        'academic_program_id',
        'admission_schedule_id',
        'requirement_id',
        'title',
        'max_score',
        'min_score',
        'weight',
        'is_active',
        'file_suffix',
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "academic_program_id", type: "integer", example: 1),
        new OA\Property(property: "admission_schedule_id", type: "integer", example: 1),
        new OA\Property(property: "requirement_id", type: "integer", example: 1),
        new OA\Property(property: "title", type: "string", example: "Academic Performance"),
        new OA\Property(property: "description", type: "string", nullable: true, example: "Evaluation based on academic records"),
        new OA\Property(property: "max_score", type: "integer", example: 100),
        new OA\Property(property: "min_score", type: "integer", example: 0),
        new OA\Property(property: "weight", type: "integer", example: 50),
        new OA\Property(property: "is_active", type: "boolean", example: true),
        new OA\Property(property: "file_suffix", type: "string", example: "pdf"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2024-01-01T00:00:00.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2024-01-01T00:00:00.000000Z"),
        // Relation
        new OA\Property(property: "academic_program", ref: "#/components/schemas/AcademicProgram"),
        new OA\Property(property: "admission_schedule", ref: "#/components/schemas/AdmissionSchedule"),
        new OA\Property(property: "requirement", ref: "#/components/schemas/Requirement"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionCriteria",
    title:"PaginatedAdmissionCriteria",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionCriteria")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAdmissionCriteria")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionCriteria")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionCriteriasResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionCriteria"))
    ]
)]

#[OA\Schema(
    schema: "CreateAdmissionCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionCriteria")
    ]
)]

#[OA\Schema(
    schema: "UpdateAdmissionCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionCriteria")
    ]
)]

#[OA\Schema(
    schema: "DeleteAdmissionCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AdmissionCriteria extends Model
{
    protected $table = 'admission_criteria';

    public $timestamps = true;

    protected $fillable = [
        'academic_program_id',
        'admission_schedule_id',
        'requirement_id',
        'title',
        'description',
        'max_score',
        'min_score',
        'weight',
        'is_active',
        'file_suffix',
    ];

    protected $casts = [
        'max_score' => 'integer',
        'min_score' => 'integer',
        'weight'    => 'integer',
        'is_active' => 'boolean',
        'academic_program_id' => 'integer',
        'admission_schedule_id' => 'integer',
        'requirement_id' => 'integer',
    ];

    protected $appends = [
        'academic_program',
        'admission_schedule',
        'requirement',
    ];

    /**
     * Get the academic program that owns the admission criteria.
     *
     * @return AcademicProgram|null
     */
    public function getAcademicProgramAttribute(): ?AcademicProgram
    {
        return $this->academicProgram()->first();
    }

    /**
     * Get the admission schedule that owns the admission criteria.
     *
     * @return AdmissionSchedule|null
     */
    public function getAdmissionScheduleAttribute(): ?AdmissionSchedule
    {
        return $this->admissionSchedule()->first();
    }

    /**
     * Get the requirement that owns the admission criteria.
     *
     * @return Requirement|null
     */
    public function getRequirementAttribute(): ?Requirement
    {
        return $this->requirement()->first();
    }

    /**
     * Get the academic program that owns the admission criteria.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicProgram(): BelongsTo
    {
        return $this->belongsTo(AcademicProgram::class, 'academic_program_id');
    }

    /**
     * Get the admission schedule that owns the admission criteria.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function admissionSchedule(): BelongsTo
    {
        return $this->belongsTo(AdmissionSchedule::class, 'admission_schedule_id');
    }

    /**
     * Get the requirement that owns the admission criteria.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function requirement(): BelongsTo
    {
        return $this->belongsTo(Requirement::class, 'requirement_id');
    }
}
