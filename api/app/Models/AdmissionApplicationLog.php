<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AdmissionApplicationLog",
    title: "AdmissionApplicationLog",
    type: "object",
    required: [
        // Override required
        'admission_application_id',
        'user_id',
        'type',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "admission_application_id", type: "integer"),
        new OA\Property(property: "user_id", type: "integer"),
        new OA\Property(property: "type", type: "string", enum: ['submitted', 'cancelled', 'approved', 'rejected']),
        new OA\Property(property: "note", type: "string", nullable: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
        // Relation
        new OA\Property(property: "admissionApplication", ref: "#/components/schemas/AdmissionApplication"),
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionApplicationLog",
    title:"PaginatedAdmissionApplicationLog",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplicationLog")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionApplicationLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAdmissionApplicationLog")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionApplicationLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplicationLog")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionApplicationLogsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplicationLog"))
    ]
)]

#[OA\Schema(
    schema: "CreateAdmissionApplicationLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplicationLog")
    ]
)]

#[OA\Schema(
    schema: "UpdateAdmissionApplicationLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplicationLog")
    ]
)]

#[OA\Schema(
    schema: "DeleteAdmissionApplicationLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AdmissionApplicationLog extends Model
{
    protected $table = 'admission_application_log';

    public $timestamps = true;

    protected $fillable = [
        'admission_application_id',
        'user_id',
        'type',
        'note',
    ];

    protected $appends = [
        'user',
    ];

    /**
     * Get the user that owns the log.
     *
     * @return User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first();
    }

    /**
     * Get the admission application that owns the log.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function admissionApplication(): BelongsTo
    {
        return $this->belongsTo(AdmissionApplication::class);
    }

    /**
     * Get the user that owns the log.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
