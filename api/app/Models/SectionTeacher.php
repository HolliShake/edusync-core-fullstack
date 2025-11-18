<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "SectionTeacher",
    title: "SectionTeacher",
    type: "object",
    required: [
        // Override required
        'section_id',
        'user_id',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "section_id", type: "integer"),
        new OA\Property(property: "user_id", type: "integer"),
        // Relations
        new OA\Property(property: "section", ref: "#/components/schemas/Section"),
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedSectionTeacher",
    title:"PaginatedSectionTeacher",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/SectionTeacher")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedSectionTeacherResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedSectionTeacher")
    ]
)]

#[OA\Schema(
    schema: "GetSectionTeacherResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/SectionTeacher")
    ]
)]

#[OA\Schema(
    schema: "GetSectionTeachersResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/SectionTeacher"))
    ]
)]

#[OA\Schema(
    schema: "CreateSectionTeacherResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/SectionTeacher")
    ]
)]

#[OA\Schema(
    schema: "UpdateSectionTeacherResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/SectionTeacher")
    ]
)]

#[OA\Schema(
    schema: "DeleteSectionTeacherResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class SectionTeacher extends Model
{
    protected $table = 'section_teacher';
    protected $fillable = [
        'section_id',
        'user_id',
    ];

    protected $casts = [
        'section_id' => 'integer',
        'user_id' => 'integer',
    ];

    protected $appends = [
        'section',
        'user',
    ];

    /**
     * Get the section that owns the section teacher.
     *
     * @return Section
     */
    public function getSectionAttribute(): Section
    {
        return $this->section()->first();
    }

    /**
     * Get the user that owns the section teacher.
     *
     * @return User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first();
    }

    /**
     * Get the section that owns the section teacher.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    /**
     * Get the user that owns the section teacher.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
