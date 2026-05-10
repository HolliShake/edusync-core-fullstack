<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AdmissionApplicationCriteriaSubmission",
    title: "AdmissionApplicationCriteriaSubmission",
    type: "object",
    required: [
        'admission_application_id',
        'admission_criteria_id',
        'score',
        'is_posted',
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "admission_application_id", type: "integer", example: 1),
        new OA\Property(property: "admission_criteria_id", type: "integer", example: 1),
        new OA\Property(property: "score", type: "number", format: "decimal", example: 85.50),
        new OA\Property(property: "comments", type: "string", nullable: true, example: "Good performance"),
        new OA\Property(property: "is_posted", type: "boolean", example: false),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
        new OA\Property(property: "admission_application", ref: "#/components/schemas/AdmissionApplication"),
        new OA\Property(property: "admission_criteria", ref: "#/components/schemas/AdmissionCriteria"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionApplicationCriteriaSubmission",
    title:"PaginatedAdmissionApplicationCriteriaSubmission",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplicationCriteriaSubmission")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionApplicationCriteriaSubmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAdmissionApplicationCriteriaSubmission")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionApplicationCriteriaSubmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplicationCriteriaSubmission")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionApplicationCriteriaSubmissionsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplicationCriteriaSubmission"))
    ]
)]

#[OA\Schema(
    schema: "CreateAdmissionApplicationCriteriaSubmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplicationCriteriaSubmission")
    ]
)]

#[OA\Schema(
    schema: "UpdateAdmissionApplicationCriteriaSubmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplicationCriteriaSubmission")
    ]
)]

#[OA\Schema(
    schema: "DeleteAdmissionApplicationCriteriaSubmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AdmissionApplicationCriteriaSubmission extends Model
{
    protected $table = 'admission_application_criteria_submission';

    public $timestamps = true;

    protected $appends = [
        'admission_application',
        'admission_criteria',
    ];

    protected $fillable = [
        'admission_application_id',
        'admission_criteria_id',
        'score',
        'comments',
        'is_posted',
    ];

    protected $casts = [
        'admission_application_id' => 'integer',
        'admission_criteria_id' => 'integer',
        'score' => 'decimal:2',
        'comments' => 'string',
        'is_posted' => 'boolean',
    ];

    public function getAdmissionApplicationAttribute(): AdmissionApplication
    {
        return $this->admissionApplication()->first();
    }

    public function getAdmissionCriteriaAttribute(): AdmissionCriteria
    {
        return $this->admissionCriteria()->first();
    }

    public function admissionApplication(): BelongsTo
    {
        return $this->belongsTo(AdmissionApplication::class);
    }

    public function admissionCriteria(): BelongsTo
    {
        return $this->belongsTo(AdmissionCriteria::class);
    }
}