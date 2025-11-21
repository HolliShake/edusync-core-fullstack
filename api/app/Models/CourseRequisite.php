<?php

namespace App\Models;

use App\Enum\CourseRequisiteTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "CourseRequisite",
    title: "CourseRequisite",
    type: "object",
    required: [
        // Override required
        'course_id',
        'requisite_course_id',
        'requisite_type',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "course_id", type: "integer", example: 1),
        new OA\Property(property: "requisite_course_id", type: "integer", example: 2),
        new OA\Property(property: "requisite_type", ref: "#/components/schemas/CourseRequisiteTypeEnum", example: "pre"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2024-01-01T00:00:00.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2024-01-01T00:00:00.000000Z"),
        // Relations
        new OA\Property(property: "requisite_course", ref: "#/components/schemas/Course"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCourseRequisite",
    title:"PaginatedCourseRequisite",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/CourseRequisite")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCourseRequisiteResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedCourseRequisite")
    ]
)]

#[OA\Schema(
    schema: "GetCourseRequisiteResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/CourseRequisite")
    ]
)]

#[OA\Schema(
    schema: "GetCourseRequisitesResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/CourseRequisite"))
    ]
)]

#[OA\Schema(
    schema: "CreateCourseRequisiteResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/CourseRequisite")
    ]
)]

#[OA\Schema(
    schema: "UpdateCourseRequisiteResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/CourseRequisite")
    ]
)]

#[OA\Schema(
    schema: "DeleteCourseRequisiteResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class CourseRequisite extends Model
{
    protected $table = 'course_requisite';

    public $timestamps = true;

    protected $fillable = [
        'course_id',
        'requisite_course_id',
        'requisite_type',
    ];

    protected $casts = [
        'requisite_type' => CourseRequisiteTypeEnum::class,
    ];

    protected $appends = [
        'requisite_course',
    ];

    /**
     * Get the requisite course that has this requisite.
     *
     * @return Course
     */
    public function getRequisiteCourseAttribute(): Course
    {
        return $this->requisiteCourse()->first();
    }

    /**
     * Get the course that has this requisite.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the course that has this requisite.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function requisiteCourse(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'requisite_course_id');
    }
}
