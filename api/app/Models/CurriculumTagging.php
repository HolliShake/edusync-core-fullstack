<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "CurriculumTagging",
    title: "CurriculumTagging",
    type: "object",
    required: [
        // Override required
        'curriculum_id',
        'user_id',
        'is_active',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "curriculum_id", type: "integer", example: 1),
        new OA\Property(property: "user_id", type: "integer", example: 1),
        new OA\Property(property: "is_active", type: "boolean", example: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2024-01-01T00:00:00.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2024-01-01T00:00:00.000000Z"),
        // Computed
        new OA\Property(property: "is_internal_student", type: "boolean", example: true),
        // Relations
        new OA\Property(property: "curriculum", ref: "#/components/schemas/Curriculum"),
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCurriculumTagging",
    title:"PaginatedCurriculumTagging",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/CurriculumTagging")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCurriculumTaggingResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedCurriculumTagging")
    ]
)]

#[OA\Schema(
    schema: "GetCurriculumTaggingResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/CurriculumTagging")
    ]
)]

#[OA\Schema(
    schema: "GetCurriculumTaggingsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/CurriculumTagging"))
    ]
)]

#[OA\Schema(
    schema: "CreateCurriculumTaggingResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/CurriculumTagging")
    ]
)]

#[OA\Schema(
    schema: "UpdateCurriculumTaggingResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/CurriculumTagging")
    ]
)]

#[OA\Schema(
    schema: "DeleteCurriculumTaggingResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class CurriculumTagging extends Model
{
    protected $table = 'curriculum_tagging';

    public $timestamps = true;

    protected $fillable = [
        'curriculum_id',
        'user_id',
        'is_active',
    ];

    protected $casts = [
        'curriculum_id' => 'integer',
        'user_id'       => 'integer',
        'is_active'     => 'boolean',
    ];

    protected $appends = [
        'curriculum',
        'user',
        'is_internal_student',
    ];

    /**
     * Get the is current program student attribute.
     *
     * @return bool
     */
    public function getIsInternalStudentAttribute(): bool
    {
        // True if not enrolled to other program and curriculum is active
        // Or simply it shifts to other program or college?
        $is_enrolled_to_other_program = $this->user->curriculumTaggings()
            ->where('is_active', true)
            // Enrolled in a different program
            ->whereHas('curriculum', function ($query) {
                $query->where('academic_program_id', '!=', $this->curriculum->academic_program_id);
            })
            ->exists();

        return !$is_enrolled_to_other_program;
    }

    /**
     * Get the curriculum that owns the curriculum tagging.
     *
     * @return Curriculum
     */
    public function getCurriculumAttribute(): Curriculum
    {
        return $this->curriculum()->first();
    }

    /**
     * Get the user that owns the curriculum tagging.
     *
     * @return User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first();
    }

    /**
     * Get the curriculum that owns the curriculum tagging.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function curriculum(): BelongsTo
    {
        return $this->belongsTo(Curriculum::class);
    }

    /**
     * Get the user that owns the curriculum tagging.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
