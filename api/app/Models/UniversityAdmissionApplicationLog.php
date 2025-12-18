<?php

namespace App\Models;

use App\Enum\AdmissionApplicationLogTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "UniversityAdmissionApplicationLog",
    title: "UniversityAdmissionApplicationLog",
    type: "object",
    required: [
        // Fillables
        'university_admission_application_id',
        'user_id',
        'type',
    ],
    properties: [
        // Fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "university_admission_application_id", type: "integer"),
        new OA\Property(property: "user_id", type: "integer"),
        new OA\Property(property: "type", ref: "#/components/schemas/AdmissionApplicationLogTypeEnum", readOnly: true),
        new OA\Property(property: "note", type: "string", nullable: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
        new OA\Property(property: "type_label", type: "string", readOnly: true),
        // Relations
        new OA\Property(property: "university_admission_application", ref: "#/components/schemas/UniversityAdmissionApplication"),
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionApplicationLog",
    title:"PaginatedUniversityAdmissionApplicationLog",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionApplicationLog")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionApplicationLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedUniversityAdmissionApplicationLog")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionApplicationLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplicationLog")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionApplicationLogsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionApplicationLog"))
    ]
)]

#[OA\Schema(
    schema: "CreateUniversityAdmissionApplicationLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplicationLog")
    ]
)]

#[OA\Schema(
    schema: "UpdateUniversityAdmissionApplicationLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplicationLog")
    ]
)]

#[OA\Schema(
    schema: "DeleteUniversityAdmissionApplicationLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class UniversityAdmissionApplicationLog extends Model
{
    protected $table = 'university_admission_application_log';

    public $timestamps = true;

    protected $fillable = [
        'university_admission_application_id',
        'user_id',
        'type',
        'note',
    ];

    protected $casts = [
        'university_admission_application_id' => 'integer',
        'user_id'                             => 'integer',
        'type'                                => AdmissionApplicationLogTypeEnum::class,
        'note'                                => 'string',
    ];

    protected $appends = [
        'type_label',
        'university_admission_application',
        'user',
    ];

    /**
     * Get the label for the type.
     *
     * @return string
     */
    public function getTypeLabelAttribute(): string
    {
        switch ($this->type->value) {
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
                return 'Unknown Status';
        }
    }

    /**
     * Get the university admission application that owns the log.
     *
     * @return UniversityAdmissionApplication
     */
    public function getUniversityAdmissionApplicationAttribute(): UniversityAdmissionApplication
    {
        return $this->universityAdmissionApplication()->first();
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
     * Get the university admission application that owns the log.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function universityAdmissionApplication(): BelongsTo
    {
        return $this->belongsTo(UniversityAdmissionApplication::class);
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
