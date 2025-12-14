<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "UniversityAdmissionCriteria",
    title: "UniversityAdmissionCriteria",
    type: "object",
    required: [
        'university_admission_id',
        'requirement_id',
        'title',
        'max_score',
        'min_score',
        'weight',
        'is_active',
        'file_suffix',
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "university_admission_id", type: "integer"),
        new OA\Property(property: "requirement_id", type: "integer"),
        new OA\Property(property: "title", type: "string"),
        new OA\Property(property: "description", type: "string", nullable: true),
        new OA\Property(property: "max_score", type: "integer"),
        new OA\Property(property: "min_score", type: "integer"),
        new OA\Property(property: "weight", type: "integer"),
        new OA\Property(property: "is_active", type: "boolean"),
        new OA\Property(property: "file_suffix", type: "string"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Relation
        new OA\Property(property: "university_admission", ref: "#/components/schemas/UniversityAdmission"),
        new OA\Property(property: "requirement", ref: "#/components/schemas/Requirement"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionCriteria",
    title:"PaginatedUniversityAdmissionCriteria",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionCriteria")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedUniversityAdmissionCriteria")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionCriteria")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionCriteriasResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionCriteria"))
    ]
)]

#[OA\Schema(
    schema: "CreateUniversityAdmissionCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionCriteria")
    ]
)]

#[OA\Schema(
    schema: "UpdateUniversityAdmissionCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionCriteria")
    ]
)]

#[OA\Schema(
    schema: "DeleteUniversityAdmissionCriteriaResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class UniversityAdmissionCriteria extends Model
{
    protected $table = 'university_admission_criteria';

    protected $fillable = [
        'university_admission_id',
        'requirement_id',
        'title',
        'description',
        'max_score',
        'min_score',
        'weight',
        'is_active',
        'file_suffix',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'max_score' => 'integer',
        'min_score' => 'integer',
        'weight' => 'integer',
    ];

    protected $appends = [
        'university_admission',
        'requirement',
    ];

    /**
     * Get the university admission that owns the university admission criteria.
     *
     * @return UniversityAdmission
     */
    public function getUniversityAdmissionAttribute(): UniversityAdmission
    {
        return $this->universityAdmission()->first();
    }

    /**
     * Get the requirement that owns the university admission criteria.
     *
     * @return Requirement|null
     */
    public function getRequirementAttribute(): ?Requirement
    {
        return $this->requirement()->first();
    }

    /**
     * Get the university admission that owns the university admission criteria.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function universityAdmission(): BelongsTo
    {
        return $this->belongsTo(UniversityAdmission::class, 'university_admission_id');
    }

    /**
     * Get the requirement that owns the university admission criteria.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function requirement(): BelongsTo
    {
        return $this->belongsTo(Requirement::class, 'requirement_id');
    }
}
