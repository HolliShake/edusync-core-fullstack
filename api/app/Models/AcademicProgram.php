<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
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
        // Custom
        new OA\Property(property: "program_type", type: "object", ref: "#/components/schemas/ProgramType"),
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
        'college_id' => 'integer',
        'program_type_id' => 'integer',
    ];

    /**
     * Get the college that owns the academic program.
     */
    public function college()
    {
        return $this->belongsTo(College::class, 'college_id');
    }

    /**
     * Get the program type for the academic program.
     */
    public function programType()
    {
        return $this->belongsTo(ProgramType::class, 'program_type_id');
    }
}
