<?php

namespace App\Models;

use App\Enum\CurriculumStateEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Curriculum",
    title: "Curriculum",
    type: "object",
    required: [
        'academic_program_id',
        'academic_term_id',
        'curriculum_code',
        'curriculum_name',
        'description',
        'effective_year',
        'total_units',
        'total_hours',
        'status',
        'approved_date',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "academic_program_id", type: "integer", example: 1),
        new OA\Property(property: "academic_term_id", type: "integer", example: 1),
        new OA\Property(property: "curriculum_code", type: "string", example: "CURR-2024-001"),
        new OA\Property(property: "curriculum_name", type: "string", example: "Computer Science Curriculum 2024"),
        new OA\Property(property: "description", type: "string", nullable: true, example: "Updated curriculum for Computer Science program"),
        new OA\Property(property: "effective_year", type: "integer", example: 2024),
        new OA\Property(property: "total_units", type: "integer", example: 120),
        new OA\Property(property: "total_hours", type: "integer", example: 2400),
        new OA\Property(property: "status", type: "string", enum: ['active', 'inactive', 'archived'], example: 'active'),
        new OA\Property(property: "approved_date", type: "string", format: "date", nullable: true, example: "2024-01-15"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2024-01-01T12:00:00Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2024-01-01T12:00:00Z"),
        // Relationships
        new OA\Property(property: "academic_program", ref: "#/components/schemas/AcademicProgram"),
        new OA\Property(property: "academic_term", ref: "#/components/schemas/AcademicTerm"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCurriculum",
    title:"PaginatedCurriculum",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Curriculum")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCurriculumResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", oneOf: [
            new OA\Schema(ref: "#/components/schemas/PaginatedCurriculum"),
            new OA\Schema(type: "array", items: new OA\Items(ref: "#/components/schemas/Curriculum"))
        ])
    ]
)]

#[OA\Schema(
    schema: "GetCurriculumResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Curriculum")
    ]
)]

#[OA\Schema(
    schema: "GetCurriculumsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Curriculum"))
    ]
)]

#[OA\Schema(
    schema: "CreateCurriculumResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Curriculum")
    ]
)]

#[OA\Schema(
    schema: "UpdateCurriculumResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Curriculum")
    ]
)]

#[OA\Schema(
    schema: "DeleteCurriculumResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class Curriculum extends Model
{
    protected $table = 'curriculum';

    public $timestamps = true;

    protected $fillable = [
        'academic_program_id',
        'academic_term_id',
        'curriculum_code',
        'curriculum_name',
        'description',
        'effective_year',
        'total_units',
        'total_hours',
        'status',
        'approved_date',
    ];

    protected $casts = [
        'academic_program_id' => 'integer',
        'academic_term_id' => 'integer',
        'total_units' => 'integer',
        'total_hours' => 'integer',
        'status' => 'string',
        'approved_date' => 'date',
        'effective_year' => 'integer',
    ];

    protected $appends = [
        'academic_program',
        'academic_term',
    ];

    /**
     * Get the academic program that owns the curriculum.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function getAcademicProgramAttribute()
    {
        return $this->academicProgram()->first();
    }

    /**
     * Get the academic term that owns the curriculum.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function getAcademicTermAttribute()
    {
        return $this->academicTerm()->first();
    }
    
    /**
     * Get the academic program that owns the curriculum.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicProgram(): BelongsTo
    {
        return $this->belongsTo(AcademicProgram::class, 'academic_program_id');
    }

    /**
     * Get the academic term that owns the curriculum.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicTerm(): BelongsTo
    {
        return $this->belongsTo(AcademicTerm::class, 'academic_term_id');
    }
}
