<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "CurriculumDetail",
    title: "CurriculumDetail",
    type: "object",
    required: [
        // Override required
        'curriculum_id',
        'course_id',
        'year_order',
        'term_order',
        'term_alias',
        'is_include_gwa'
    ],
    properties: [
        // Override fillables
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'curriculum_id', type: 'integer', example: 1),
        new OA\Property(property: 'course_id', type: 'integer', example: 1),
        new OA\Property(property: 'year_order', type: 'integer', example: 1),
        new OA\Property(property: 'term_order', type: 'integer', example: 1),
        new OA\Property(property: 'term_alias', type: 'string', example: '1st Semester'),
        new OA\Property(property: 'is_include_gwa', type: 'boolean', example: false),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', readOnly: true),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', readOnly: true),
        // relationships
        new OA\Property(property: "curriculum", ref: "#/components/schemas/Curriculum"),
        new OA\Property(property: "course", ref: "#/components/schemas/Course"),
        // computed
        new OA\Property(property: "year_label", type: "string", readOnly: true, example: "1st Year"),
        new OA\Property(property: "term_label", type: "string", readOnly: true, example: "1st Term"),
    ]
)]

#[OA\Schema(
    schema: "MultipleCurriculumDetail",
    title: "CurriculumDetail",
    type: "object",
    required: [
        // Override required
        'curriculum_id',
        'year_order',
        'term_order',
        'term_alias',
        'is_include_gwa',
        'courses' // array of course id
    ],
    properties: [
        // Override fillables
        new OA\Property(property: 'curriculum_id', type: 'integer', example: 1),
        new OA\Property(property: 'year_order', type: 'integer', example: 1),
        new OA\Property(property: 'term_order', type: 'integer', example: 1),
        new OA\Property(property: 'term_alias', type: 'string', example: '1st Semester'),
        new OA\Property(property: 'is_include_gwa', type: 'boolean', example: false),
        new OA\Property(property: 'courses', type: 'array', items: new OA\Items(type: 'integer')),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCurriculumDetail",
    title:"PaginatedCurriculumDetail",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/CurriculumDetail")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCurriculumDetailResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedCurriculumDetail")
    ]
)]

#[OA\Schema(
    schema: "GetCurriculumDetailResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/CurriculumDetail")
    ]
)]

#[OA\Schema(
    schema: "GetCurriculumDetailsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/CurriculumDetail"))
    ]
)]

#[OA\Schema(
    schema: "CreateCurriculumDetailResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/CurriculumDetail")
    ]
)]

#[OA\Schema(
    schema: "UpdateCurriculumDetailResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/CurriculumDetail")
    ]
)]

#[OA\Schema(
    schema: "DeleteCurriculumDetailResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class CurriculumDetail extends Model
{
    protected $table = 'curriculum_detail';

    public $timestamps = true;

    protected $fillable = [
        'curriculum_id',
        'course_id',
        'year_order',
        'term_order',
        'term_alias',
        'is_include_gwa',
    ];

    protected $casts = [
        'year_order' => 'integer',
        'term_order' => 'integer',
        'is_include_gwa' => 'boolean',
    ];

    protected $appends = [
        'year_label',
        'term_label',
        'course',
        'curriculum',
    ];

    /**
     * Get the curriculum that owns the curriculum detail.
     *
     * @return Curriculum
     */
    public function getCurriculumAttribute(): Curriculum {
        return $this->curriculum()->first();
    }

    /**
     * Get the year label.
     *
     * @return string
     */
    public function getYearLabelAttribute(): string {
        $number = $this->year_order;
        $suffix = 'th';
        if ($number % 10 === 1 && $number !== 11) {
            $suffix = 'st';
        } elseif ($number % 10 === 2 && $number !== 12) {
            $suffix = 'nd';
        } elseif ($number % 10 === 3 && $number !== 13) {
            $suffix = 'rd';
        }
        return $number . $suffix.' Year';
    }

    /**
     * Get the term label.
     *
     * @return string
     */
    public function getTermLabelAttribute(): string {
        $prefix = '';
        $label = $this->curriculum()->with('academicTerm')->first()->term_alias ?? $this->curriculum()->with('academicTerm')->first()->academicTerm->suffix;
        $number = $this->term_order;
        $suffix = 'th';
        if ($number % 10 === 1 && $number !== 11) {
            $suffix = 'st';
        } elseif ($number % 10 === 2 && $number !== 12) {
            $suffix = 'nd';
        } elseif ($number % 10 === 3 && $number !== 13) {
            $suffix = 'rd';
        }
        return $number . $suffix . ' ' . $label;
    }

    /**
     * Get the course that owns the curriculum detail.
     *
     * @return Course
     */
    public function getCourseAttribute(): Course {
        return $this->course()->first();
    }

    /**
     * Get the curriculum that owns the curriculum detail.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function curriculum(): BelongsTo
    {
        return $this->belongsTo(Curriculum::class, 'curriculum_id');
    }

    /**
     * Get the course that owns the curriculum detail.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
