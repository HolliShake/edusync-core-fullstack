<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Section",
    title: "Section",
    type: "object",
    required: [
        // Override required
        'curriculum_detail_id',
        'school_year_id',
        'section_ref',
        'section_code',
        'section_name',
        'min_students',
        'max_students',
        'is_posted',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "curriculum_detail_id", type: "integer"),
        new OA\Property(property: "school_year_id", type: "integer"),
        new OA\Property(property: "section_ref", type: "string"),
        new OA\Property(property: "section_code", type: "string"),
        new OA\Property(property: "section_name", type: "string"),
        new OA\Property(property: "min_students", type: "integer"),
        new OA\Property(property: "max_students", type: "integer"),
        new OA\Property(property: "is_posted", type: "boolean"),
        // Relations
        new OA\Property(property: "curriculum_detail", ref: "#/components/schemas/CurriculumDetail"),
        new OA\Property(property: "school_year", ref: "#/components/schemas/SchoolYear"),
    ]
)]

#[OA\Schema(
    schema: "GenerateSection",
    title: "GenerateSection",
    type: "object",
    properties: [
        new OA\Property(property: "curriculum_id", type: "integer"),
        new OA\Property(property: "year_order", type: "integer"),
        new OA\Property(property: "term_order", type: "integer"),
        new OA\Property(property: "auto_post", type: "boolean", default: false),
        new OA\Property(property: "number_of_section", type: "integer"),
        new OA\Property(property: "school_year_id", type: "integer"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedSection",
    title:"PaginatedSection",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Section")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedSectionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedSection")
    ]
)]

#[OA\Schema(
    schema: "GetSectionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Section")
    ]
)]

#[OA\Schema(
    schema: "GetSectionsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Section"))
    ]
)]

#[OA\Schema(
    schema: "CreateSectionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Section")
    ]
)]

#[OA\Schema(
    schema: "UpdateSectionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Section")
    ]
)]

#[OA\Schema(
    schema: "DeleteSectionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class Section extends Model
{
    protected $table = 'section';

    public $timestamps = true;

    protected $fillable = [
        'curriculum_detail_id',
        'school_year_id',
        'section_ref',
        'section_code',
        'section_name',
        'min_students',
        'max_students',
        'is_posted',
    ];

    protected $casts = [
        'is_posted' => 'boolean',
        'min_students' => 'integer',
        'max_students' => 'integer',
    ];

    protected $appends = [
        'curriculum_detail',
    ];

    /**
     * Get the curriculum detail that owns the section.
     *
     * @return CurriculumDetail
     */
    public function getCurriculumDetailAttribute(): CurriculumDetail
    {
        return $this->curriculumDetail()->first();
    }

    /**
     * Get the school year that owns the section.
     *
     * @return SchoolYear
     */
    public function getSchoolYearAttribute(): SchoolYear
    {
        return $this->schoolYear()->first();
    }

    /**
     * Get the curriculum detail that owns the section.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function curriculumDetail(): BelongsTo
    {
        return $this->belongsTo(CurriculumDetail::class, 'curriculum_detail_id');
    }

    /**
     * Get the school year that owns the section.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYear(): BelongsTo
    {
        return $this->belongsTo(SchoolYear::class, 'school_year_id');
    }
}
