<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AcademicProgramRequirement",
    title: "AcademicProgramRequirement",
    type: "object",
    required: [
        // Override required
        'academic_program_id',
        'requirement_id',
        'school_year_id',
        'is_mandatory',
        'is_active',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "academic_program_id", type: "integer"),
        new OA\Property(property: "requirement_id", type: "integer"),
        new OA\Property(property: "school_year_id", type: "integer"),
        new OA\Property(property: "is_mandatory", type: "boolean"),
        new OA\Property(property: "is_active", type: "boolean"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Relations
        new OA\Property(property: "academic_program", ref: "#/components/schemas/AcademicProgram"),
        new OA\Property(property: "requirement", ref: "#/components/schemas/Requirement"),
        new OA\Property(property: "school_year", ref: "#/components/schemas/SchoolYear"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAcademicProgramRequirement",
    title:"PaginatedAcademicProgramRequirement",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AcademicProgramRequirement")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAcademicProgramRequirementResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAcademicProgramRequirement")
    ]
)]

#[OA\Schema(
    schema: "GetAcademicProgramRequirementResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicProgramRequirement")
    ]
)]

#[OA\Schema(
    schema: "GetAcademicProgramRequirementsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AcademicProgramRequirement"))
    ]
)]

#[OA\Schema(
    schema: "CreateAcademicProgramRequirementResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicProgramRequirement")
    ]
)]

#[OA\Schema(
    schema: "UpdateAcademicProgramRequirementResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicProgramRequirement")
    ]
)]

#[OA\Schema(
    schema: "DeleteAcademicProgramRequirementResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AcademicProgramRequirement extends Model
{
    protected $table = 'academic_program_requirement';

    public $timestamps = true;

    protected $fillable = [
        'academic_program_id',
        'requirement_id',
        'school_year_id',
        'is_mandatory',
        'is_active',
    ];

    protected $casts = [
        'is_mandatory' => 'boolean',
        'is_active' => 'boolean',
        'academic_program_id' => 'integer',
        'requirement_id' => 'integer',
        'school_year_id' => 'integer',
    ];

    protected $appends = [
        'academic_program',
        'requirement',
        'school_year',
    ];

    /**
     * Get the academic program that owns the academic program requirement.
     *
     * @return AcademicProgram
     */
    public function getAcademicProgramAttribute(): AcademicProgram
    {
        return $this->academicProgram()->first();
    }

    /**
     * Get the requirement that owns the academic program requirement.
     *
     * @return Requirement
     */
    public function getRequirementAttribute(): Requirement
    {
        return $this->requirement()->first();
    }

    /**
     * Get the school year that owns the academic program requirement.
     *
     * @return SchoolYear
     */
    public function getSchoolYearAttribute(): SchoolYear
    {
        return $this->schoolYear()->first();
    }

    /**
     * Get the academic program that owns the academic program requirement.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicProgram(): BelongsTo
    {
        return $this->belongsTo(AcademicProgram::class);
    }

    /**
     * Get the requirement that owns the academic program requirement.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function requirement(): BelongsTo
    {
        return $this->belongsTo(Requirement::class);
    }

    /**
     * Get the school year that owns the academic program requirement.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYear(): BelongsTo
    {
        return $this->belongsTo(SchoolYear::class);
    }
}
