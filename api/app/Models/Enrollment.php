<?php

namespace App\Models;

use App\Enum\EnrollmentLogActionEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
        new OA\Property(property: "is_dropped", type: "boolean", readOnly: true),
        new OA\Property(
            property: "latest_status",
            type: "string",
            enum: EnrollmentLogActionEnum::class,
            readOnly: true
        ),
        new OA\Property(property: "latest_status_label", type: "string", readOnly: true),
        new OA\Property(property: "is_enrollment_valid", type: "boolean", readOnly: true),
        // Relations
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
        new OA\Property(property: "section", ref: "#/components/schemas/Section"),
        new OA\Property(property: "enrollment_logs", type: "array", items: new OA\Items(ref: "#/components/schemas/EnrollmentLog")),
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
        'user_id'    => 'integer',
        'section_id' => 'integer',
    ];

    protected $appends = [
        'validated',
        'is_dropped',
        'user',
        'section',
        'latest_status',
        'latest_status_label',
        'is_enrollment_valid'
    ];

    /**
     * Get the latest status of the enrollment.
     *
     * @return string
     */
    public function getLatestStatusAttribute(): string
    {
        $logs = $this->latestStatus()->first();
        return $logs ? $logs->action->value : EnrollmentLogActionEnum::ENROLL->value;
    }

    public function getLatestStatusLabelAttribute(): string
    {
        $latestLog = $this->latestStatus()->first();
        $action = $latestLog ? $latestLog->action : EnrollmentLogActionEnum::ENROLL;

        // Handle both enum and string values
        $actionValue = $action instanceof EnrollmentLogActionEnum ? $action->value : $action;

        switch ($actionValue) {
            case EnrollmentLogActionEnum::ENROLL->value:
                return 'Pending';
            case EnrollmentLogActionEnum::PROGRAM_CHAIR_APPROVED->value:
                return 'Program Chair Approved';
            case EnrollmentLogActionEnum::REGISTRAR_APPROVED->value:
                return 'Officially Enrolled';
            case EnrollmentLogActionEnum::DROPPED->value:
                return 'Dropped Requested';
            case EnrollmentLogActionEnum::PROGRAM_CHAIR_DROPPED_APPROVED->value:
                return 'Dropped Approved by Program Chair';
            case EnrollmentLogActionEnum::REGISTRAR_DROPPED_APPROVED->value:
                return 'Officially Dropped';
            default:
                return 'Pending';
        }
    }

    /**
     * Get the validated attribute.
     *
     * @return bool
     */
    public function getValidatedAttribute(): bool
    {
        $logs = $this->enrollmentLogs()
            ->get()
            ->makeHidden(['enrollment', 'user'])
            ->pluck('action');
        return $logs->contains(EnrollmentLogActionEnum::PROGRAM_CHAIR_APPROVED)
            && $logs->contains(EnrollmentLogActionEnum::REGISTRAR_APPROVED)
            && !$this->is_dropped;
    }

    /**
     * Get the is dropped attribute.
     *
     * @return bool
     */
    public function getIsDroppedAttribute(): bool
    {
        $logs = $this->enrollmentLogs()
            ->get()
            ->makeHidden(['enrollment', 'user'])
            ->pluck('action');
        return $logs->contains(EnrollmentLogActionEnum::DROPPED->value)
            && $logs->contains(EnrollmentLogActionEnum::REGISTRAR_DROPPED_APPROVED->value);
    }

    /**
     * Get the user that owns the enrollment.
     *
     * @return User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first();
    }

    /**
     * Get the section that owns the enrollment.
     *
     * @return Section
     */
    public function getSectionAttribute(): Section
    {
        return $this->section()->first();
    }

    /**
     * Get the is enrollment valid attribute.
     *
     * @return bool
     */
    public function getIsEnrollmentValidAttribute(): bool
    {
        // If enrollment is already passed, or course is already credited, then return false
        return true;
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
     * Get the latest status of the admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function latestStatus(): HasOne
    {
        return $this->hasOne(EnrollmentLog::class)->latestOfMany();
    }

    /**
     * Get the enrollment logs for the enrollment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function enrollmentLogs(): HasMany
    {
        return $this->hasMany(EnrollmentLog::class)->latest();
    }

    /**
     * Get the gradebook scores for the enrollment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gradebookScores(): HasMany
    {
        return $this->hasMany(GradeBookScore::class);
    }

    /**
     * Get the grading period grades for the enrollment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gradingPeriodGrades(): HasMany
    {
        return $this->hasMany(GradingPeriodGrade::class);
    }

    /**
     * Get the final grade for the enrollment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function finalGrade(): HasOne
    {
        return $this->hasOne(FinalGrade::class);
    }
}
