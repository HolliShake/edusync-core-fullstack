<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "GradeBook",
    title: "GradeBook",
    type: "object",
    required: [
        // Override required
        'title',
        'is_template',
        'academic_program_id',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "section_id", type: "integer", nullable: true),
        new OA\Property(property: "academic_program_id", type: "integer", nullable: true),
        new OA\Property(property: "is_template", type: "boolean", default: false),
        new OA\Property(property: "title", type: "string", example: "Gradebook 1"),
        // Relations
        new OA\Property(property: "section", ref: "#/components/schemas/Section"),
        new OA\Property(property: "academic_program", ref: "#/components/schemas/AcademicProgram"),
        new OA\Property(property: "gradebook_items", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBookItem")),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradeBook",
    title:"PaginatedGradeBook",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBook")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedGradeBookResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedGradeBook")
    ]
)]

#[OA\Schema(
    schema: "GetGradeBookResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBook")
    ]
)]

#[OA\Schema(
    schema: "GetGradeBooksResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/GradeBook"))
    ]
)]

#[OA\Schema(
    schema: "CreateGradeBookResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBook")
    ]
)]

#[OA\Schema(
    schema: "UpdateGradeBookResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GradeBook")
    ]
)]

#[OA\Schema(
    schema: "DeleteGradeBookResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class GradeBook extends Model
{
    protected $table = 'gradebook';

    protected $fillable = [
        'section_id',
        'academic_program_id',
        'is_template',
        'title',
    ];

    protected $casts = [
        'is_template' => 'boolean',
    ];

    protected $appends = [
        'section',
        'academic_program',
        'gradebook_items',
    ];

    /**
     * Get the section that owns the gradebook.
     *
     * @return Section
     */
    public function getSectionAttribute(): ?Section
    {
        return $this->section()->first() ?? null;
    }

    /**
     * Get the academic program that owns the gradebook.
     *
     * @return AcademicProgram
     */
    public function getAcademicProgramAttribute(): AcademicProgram
    {
        return $this->academicProgram()->first();
    }

    /**
     * Get the gradebook items for the gradebook.
     *
     * @return array
     */
    public function getGradebookItemsAttribute(): array
    {
        return $this->gradebookItems()->get()->makeHidden(['gradebook'])->toArray();
    }

    /**
     * Get the section that owns the gradebook.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    /**
     * Get the academic program that owns the gradebook.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicProgram(): BelongsTo
    {
        return $this->belongsTo(AcademicProgram::class);
    }

    /**
     * Get the gradebook items for the gradebook.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gradebookItems(): HasMany
    {
        return $this->hasMany(GradeBookItem::class, 'gradebook_id')
            ->orderBy('id', 'asc');
    }
}
