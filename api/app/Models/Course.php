<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Course",
    title: "Course",
    type: "object",
    required: [
        "course_code",
        "course_title",
        "course_description",
        "with_laboratory",
        "is_specialize",
        "lecture_units",
        "laboratory_units",
        "credit_units",
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "course_code", type: "string", example: "CS101"),
        new OA\Property(property: "course_title", type: "string", example: "Introduction to Computer Science"),
        new OA\Property(property: "course_description", type: "string", example: "A foundational course covering basic computer science concepts"),
        new OA\Property(property: "with_laboratory", type: "boolean", example: false),
        new OA\Property(property: "is_specialize", type: "boolean", example: false),
        new OA\Property(property: "lecture_units", type: "number", format: "float", example: 3.0),
        new OA\Property(property: "laboratory_units", type: "number", format: "float", example: 0.0),
        new OA\Property(property: "credit_units", type: "number", format: "float", example: 3.0),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2024-01-01T12:00:00Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2024-01-01T12:00:00Z")
    ]
)]

#[OA\Schema(
    schema: "PaginatedCourse",
    title:"PaginatedCourse",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Course")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCourseResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedCourse")
    ]
)]

#[OA\Schema(
    schema: "GetCourseResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Course")
    ]
)]

#[OA\Schema(
    schema: "GetCoursesResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Course"))
    ]
)]

#[OA\Schema(
    schema: "CreateCourseResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Course")
    ]
)]

#[OA\Schema(
    schema: "UpdateCourseResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Course")
    ]
)]

#[OA\Schema(
    schema: "DeleteCourseResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class Course extends Model
{
    protected $table = 'course';

    protected $fillable = [
        'course_code',
        'course_title',
        'course_description',
        'with_laboratory',
        'is_specialize',
        'lecture_units',
        'laboratory_units',
        'credit_units',
    ];

    protected $casts = [
        'with_laboratory' => 'boolean',
        'is_specialize' => 'boolean',
    ];
}
