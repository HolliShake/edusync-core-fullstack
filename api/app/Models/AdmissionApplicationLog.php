<?php

namespace App\Models;

use App\Enum\AdmissionApplicationLogTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AdmissionApplicationLog",
    title: "AdmissionApplicationLog",
    type: "object",
    required: [
        // Fillables
        'admission_application_id',
        'user_id',
        'type',
    ],
    properties: [
        // Fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "admission_application_id", type: "integer"),
        new OA\Property(property: "user_id", type: "integer"),
        new OA\Property(property: "type", ref: "#/components/schemas/AdmissionApplicationLogTypeEnum", readOnly: true),
        new OA\Property(property: "note", type: "string", nullable: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
        new OA\Property(property: "type_label", type: "string", readOnly: true),
        // Relations
        new OA\Property(property: "admission_application", ref: "#/components/schemas/AdmissionApplication"),
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

    protected $casts = [
        'admission_application_id' => 'integer',
        'user_id'                  => 'integer',
        'type'                     => AdmissionApplicationLogTypeEnum::class,
        'note'                     => 'string',
    ];

    protected $appends = [
        'type_label',
        'admission_application',
        'user',
    ];

    /**
     * Get the label for the type.
     *
     * @return string
     */
    public function getTypeLabelAttribute(): string
    {
        switch ($this->type) {
            case AdmissionApplicationLogTypeEnum::SUBMITTED->value:
                return 'Pending';
            case AdmissionApplicationLogTypeEnum::APPROVED->value:
                return 'Approved for Evaluation';
            case AdmissionApplicationLogTypeEnum::REJECTED->value:
                return 'Rejected by Program Chair';
            case AdmissionApplicationLogTypeEnum::ACCEPTED->value:
            return 'Ready for Enrollment';
            case AdmissionApplicationLogTypeEnum::CANCELLED->value:
                return 'Cancelled by Student';
            default:
                return 'Pending';
        }
    }

    /**
     * Get the admission application that owns the log.
     *
     * @return AdmissionApplication
     */
    public function getAdmissionApplicationAttribute(): AdmissionApplication
    {
        return $this->admissionApplication()->first();
    }

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
