<?php

namespace App\Models;

use App\Enum\EnrollmentLogActionEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Enrollment",
    title: "Enrollment",
    type: "object",
    required: [
        // Override required
        'user_id',
        'section_id',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "user_id", type: "integer"),
        new OA\Property(property: "section_id", type: "integer"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Computed
        new OA\Property(property: "validated", type: "boolean", readOnly: true),
        // Relationships
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
        new OA\Property(property: "section", ref: "#/components/schemas/Section"),
        new OA\Property(property: "enrollmentLogs", type: "array", items: new OA\Items(ref: "#/components/schemas/EnrollmentLog")),
    ]
)]

#[OA\Schema(
    schema: "PaginatedEnrollment",
    title:"PaginatedEnrollment",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Enrollment")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedEnrollmentResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedEnrollment")
    ]
)]

#[OA\Schema(
    schema: "GetEnrollmentResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Enrollment")
    ]
)]

#[OA\Schema(
    schema: "GetEnrollmentsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Enrollment"))
    ]
)]

#[OA\Schema(
    schema: "CreateEnrollmentResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Enrollment")
    ]
)]

#[OA\Schema(
    schema: "UpdateEnrollmentResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Enrollment")
    ]
)]

#[OA\Schema(
    schema: "DeleteEnrollmentResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class Enrollment extends Model
{
    protected $table = 'enrollment';

    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'section_id',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'section_id' => 'integer',
    ];

    protected $appends = [
        'validated',
    ];

    /**
     * Get the validated attribute.
     *
     * @return bool
     */
    public function getValidatedAttribute(): bool
    {
        return $this->enrollmentLogs()
            ->where('action', EnrollmentLogActionEnum::PROGRAM_CHAIR_APPROVED->value)
            ->exists()
            && $this->enrollmentLogs()
                ->where('action', EnrollmentLogActionEnum::REGISTRAR_APPROVED->value)
                ->exists()
            && !$this->enrollmentLogs()
                ->where('action', EnrollmentLogActionEnum::DROPPED->value)
                ->exists();
    }

    /**
     * Get the user that owns the enrollment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the section that owns the enrollment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    /**
     * Get the enrollment logs for the enrollment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function enrollmentLogs(): HasMany
    {
        return $this->hasMany(EnrollmentLog::class);
    }
}
