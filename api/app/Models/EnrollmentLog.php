<?php

namespace App\Models;

use App\Enum\EnrollmentLogActionEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "EnrollmentLog",
    title: "EnrollmentLog",
    type: "object",
    required: [
        // Override required
        'enrollment_id',
        'user_id',
        'action',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "enrollment_id", type: "integer"),
        new OA\Property(property: "user_id", type: "integer"),
        new OA\Property(
            property: "action",
            type: "string",
            enum: EnrollmentLogActionEnum::class,
        ),
        new OA\Property(property: "note", type: "string", nullable: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Relationships
        new OA\Property(property: "enrollment", ref: "#/components/schemas/Enrollment"),
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedEnrollmentLog",
    title:"PaginatedEnrollmentLog",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/EnrollmentLog")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedEnrollmentLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedEnrollmentLog")
    ]
)]

#[OA\Schema(
    schema: "GetEnrollmentLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EnrollmentLog")
    ]
)]

#[OA\Schema(
    schema: "GetEnrollmentLogsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/EnrollmentLog"))
    ]
)]

#[OA\Schema(
    schema: "CreateEnrollmentLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EnrollmentLog")
    ]
)]

#[OA\Schema(
    schema: "UpdateEnrollmentLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EnrollmentLog")
    ]
)]

#[OA\Schema(
    schema: "DeleteEnrollmentLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class EnrollmentLog extends Model
{
    protected $table = 'enrollment_log';

    public $timestamps = true;

    protected $casts = [
        'enrollment_id' => 'integer',
        'user_id'       => 'integer',
        'action'        => EnrollmentLogActionEnum::class,
    ];

    protected $fillable = [
        'enrollment_id',
        'user_id',
        'action',
    ];

    protected $appends = [
        'enrollment',
        'user',
    ];

        /**
     * Get the enrollment attribute.
     *
     * @return Enrollment
     */
    public function getEnrollmentAttribute(): Enrollment
    {
        return $this->enrollment()->first();
    }

    /**
     * Get the user attribute.
     *
     * @return User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first();
    }

    /**
     * Get the enrollment that owns the log.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
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
