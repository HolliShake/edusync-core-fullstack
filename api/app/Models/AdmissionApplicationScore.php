<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AdmissionApplicationScore",
    title: "AdmissionApplicationScore",
    type: "object",
    required: [
        // Override required
        'admission_application_id',
        'admission_criteria_id',
        'user_id',
        'score',
        'is_posted',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "admission_application_id", type: "integer", example: 1),
        new OA\Property(property: "admission_criteria_id", type: "integer", example: 1),
        new OA\Property(property: "user_id", type: "integer", example: 1),
        new OA\Property(property: "score", type: "number", format: "decimal", example: 85.50),
        new OA\Property(property: "comments", type: "string", nullable: true, example: "Good performance"),
        new OA\Property(property: "is_posted", type: "boolean", example: false),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
        // Relations
        new OA\Property(property: "admission_application", ref: "#/components/schemas/AdmissionApplication"),
        new OA\Property(property: "admission_criteria", ref: "#/components/schemas/AdmissionCriteria"),
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionApplicationScore",
    title:"PaginatedAdmissionApplicationScore",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplicationScore")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionApplicationScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAdmissionApplicationScore")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionApplicationScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplicationScore")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionApplicationScoresResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplicationScore"))
    ]
)]

#[OA\Schema(
    schema: "CreateAdmissionApplicationScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplicationScore")
    ]
)]

#[OA\Schema(
    schema: "UpdateAdmissionApplicationScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplicationScore")
    ]
)]

#[OA\Schema(
    schema: "DeleteAdmissionApplicationScoreResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AdmissionApplicationScore extends Model
{
    protected $table = 'admission_application_score';

    public $timestamps = true;

    protected $fillable = [
        'admission_application_id',
        'admission_criteria_id',
        'user_id',
        'score',
        'comments',
        'is_posted',
    ];

    protected $casts = [
        'admission_application_id' => 'integer',
        'admission_criteria_id'    => 'integer',
        'user_id'                  => 'integer',
        'score'                    => 'decimal:2',
        'comments'                 => 'string',
        'is_posted'                => 'boolean',
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
     * Get the admission criteria that owns the score.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function admissionCriteria(): BelongsTo
    {
        return $this->belongsTo(AdmissionCriteria::class);
    }

    /**
     * Get the user that owns the score.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
