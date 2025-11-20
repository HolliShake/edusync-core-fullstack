<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AcademicProgram",
    title: "AcademicProgram",
    type: "object",
    required: [
        "program_name",
        "short_name",
        "year_first_implemented",
        "college_id",
        "program_type_id"
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "program_name", type: "string", example: "Bachelor of Science in Computer Science"),
        new OA\Property(property: "short_name", type: "string", example: "BSCS"),
        new OA\Property(property: "year_first_implemented", type: "string", format: "date", example: "2020-01-01"),
        new OA\Property(property: "college_id", type: "integer", example: 1),
        new OA\Property(property: "program_type_id", type: "integer", example: 1),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2025-01-07T10:30:14.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2025-01-07T10:30:14.000000Z"),
        // Relations
        new OA\Property(property: "college", type: "object", ref: "#/components/schemas/College"),
        new OA\Property(property: "program_type", type: "object", ref: "#/components/schemas/ProgramType"),
        new OA\Property(property: "requirements", type: "array", items: new OA\Items(ref: "#/components/schemas/AcademicProgramRequirement")),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAcademicProgram",
    title:"PaginatedAcademicProgram",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AcademicProgram")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAcademicProgramResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAcademicProgram")
    ]
)]

#[OA\Schema(
    schema: "GetAcademicProgramResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicProgram")
    ]
)]

#[OA\Schema(
    schema: "CreateAcademicProgramResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicProgram")
    ]
)]

#[OA\Schema(
    schema: "UpdateAcademicProgramResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicProgram")
    ]
)]

#[OA\Schema(
    schema: "DeleteAcademicProgramResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AcademicProgram extends Model
{
    protected $table = 'academic_program';

    protected $fillable = [
        'program_name',
        'short_name',
        'year_first_implemented',
        'college_id',
        'program_type_id'
    ];

    protected $casts = [
        'year_first_implemented' => 'date',
        'college_id'             => 'integer',
        'program_type_id'        => 'integer',
    ];

    protected $appends = [
        'college',
        'program_type',
    ];

    /**
     * Get the college that owns the academic program.
     *
     * @return College
     */
    public function getCollegeAttribute(): College
    {
        return $this->college()->first();
    }

    /**
     * Get the program type for the academic program.
     *
     * @return ProgramType
     */
    public function getProgramTypeAttribute(): ProgramType
    {
        return $this->programType()->first();
    }

    /**
     * Get the requirements for the academic program.
     *
     * @return array
     */
    public function getRequirementsAttribute(): array
    {
        return $this->programRequirements()->get()->toArray();
    }

    /**
     * Get the college that owns the academic program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class, 'college_id');
    }

    /**
     * Get the program type for the academic program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function programType(): BelongsTo
    {
        return $this->belongsTo(ProgramType::class);
    }

    /**
     * Get the program requirements for the academic program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function programRequirements(): HasMany
    {
        return $this->hasMany(AcademicProgramRequirement::class);
    }

    /**
     * Get the admission schedules for the academic program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function admissionSchedules(): HasMany
    {
        return $this->hasMany(AdmissionSchedule::class);
    }

    /*****************************************************************/

    /**
     * Get the designation for the academic program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function designationable()
    {
        return $this->morphTo();
    }
}
