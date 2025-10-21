<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AdmissionScore",
    title: "AdmissionScore",
    type: "object",
    required: [
        // Override required
        'admission_application_id',
        'academic_program_criteria_id',
        'score',
        'is_passed',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "admission_application_id", type: "integer", example: 1),
        new OA\Property(property: "academic_program_criteria_id", type: "integer", example: 1),
        new OA\Property(property: "score", type: "number", format: "decimal", example: 85.50),
        new OA\Property(property: "comments", type: "string", nullable: true, example: "Good performance"),
        new OA\Property(property: "is_passed", type: "boolean", example: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
        // Relation
        new OA\Property(property: "admissionApplication", ref: "#/components/schemas/AdmissionApplication"),
        new OA\Property(property: "academicProgramCriteria", ref: "#/components/schemas/AcademicProgramCriteria"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionScore",
    title:"PaginatedAdmissionScore",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionScore")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAdmissionScore")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionScore")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionScoresResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionScore"))
    ]
)]

#[OA\Schema(
    schema: "CreateAdmissionScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionScore")
    ]
)]

#[OA\Schema(
    schema: "UpdateAdmissionScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionScore")
    ]
)]

#[OA\Schema(
    schema: "DeleteAdmissionScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AdmissionScore extends Model
{
    protected $table = 'admission_score';

    public $timestamps = true;

    protected $fillable = [
        'admission_application_id',
        'academic_program_criteria_id',
        'score',
        'comments',
    ];


    /**
     * Get the admission application that owns the score.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function admissionApplication(): BelongsTo
    {
        return $this->belongsTo(AdmissionApplication::class);
    }

    /**
     * Get the academic program criteria that owns the score.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicProgramCriteria(): BelongsTo
    {
        return $this->belongsTo(AcademicProgramCriteria::class);
    }
}
