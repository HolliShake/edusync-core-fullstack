<?php

namespace App\Models;

use App\Enum\AdmissionApplicationLogTypeEnum;
use App\Enum\CalendarEventEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AdmissionApplication",
    title: "AdmissionApplication",
    type: "object",
    required: [
        // Override required
        'user_id',
        'school_year_id',
        'academic_program_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "user_id", type: "integer"),
        new OA\Property(property: "school_year_id", type: "integer"),
        new OA\Property(property: "academic_program_id", type: "integer"),
        new OA\Property(property: "year", type: "integer"),
        new OA\Property(property: "pool_no", type: "integer"),
        new OA\Property(property: "first_name", type: "string"),
        new OA\Property(property: "last_name", type: "string"),
        new OA\Property(property: "middle_name", type: "string", nullable: true),
        new OA\Property(property: "email", type: "string"),
        new OA\Property(property: "phone", type: "string"),
        new OA\Property(property: "address", type: "string"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
        new OA\Property(property: "latest_status", type: "string", enum: AdmissionApplicationLogTypeEnum::class, readOnly: true),
        new OA\Property(property: "latest_status_label", type: "string", readOnly: true),
        new OA\Property(property: "is_open_for_enrollment", type: "boolean"),
        // Relations
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
        new OA\Property(property: "school_year", ref: "#/components/schemas/SchoolYear"),
        new OA\Property(property: "academic_program", ref: "#/components/schemas/AcademicProgram"),
        new OA\Property(property: "logs", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplicationLog")),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionApplication",
    title:"PaginatedAdmissionApplication",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplication")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionApplicationsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplication"))
    ]
)]

#[OA\Schema(
    schema: "CreateAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "UpdateAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "DeleteAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AdmissionApplication extends Model
{
    protected $table = 'admission_application';

    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'school_year_id',
        'academic_program_id',
        // 'year',
        // 'pool_no',
        'first_name',
        'last_name',
        'middle_name',
        'email',
        'phone',
        'address',
    ];

    protected $casts = [
        'user_id'             => 'integer',
        'school_year_id'      => 'integer',
        'academic_program_id' => 'integer',
        'year'                => 'integer',
        'pool_no'             => 'integer',
    ];

    protected $appends = [
        'latest_status',
        'latest_status_label',
        'user',
        'school_year',
        'academic_program',
        'is_open_for_enrollment',
        'logs',
    ];

    /**
     * Check if the admission application is open for enrollment.
     *
     * @return bool
     */
    public function getIsOpenForEnrollmentAttribute(): bool
    {
        return $this->schoolYear
            ->academicCalendars()
            ->where('event', CalendarEventEnum::ENROLLMENT->value)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->exists();
    }

    /**
     * Get the latest status of the admission application.
     *
     * @return string
     */
    public function getLatestStatusAttribute(): AdmissionApplicationLogTypeEnum
    {
        $latestLog = $this->latestStatus()->first();
        return $latestLog ? $latestLog->type : AdmissionApplicationLogTypeEnum::SUBMITTED;
    }

    /**
     * Get the label for the latest status.
     *
     * @return string
     */
    public function getLatestStatusLabelAttribute(): string
    {
        $latestLog = $this->latestStatus()->first() ?? AdmissionApplicationLogTypeEnum::SUBMITTED->value;
        switch ($latestLog->type) {
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
     * Get the user that owns the admission application.
     *
     * @return User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first()->makeHidden(['roles', 'is_student', 'enrollments', 'designitions']);
    }

    /**
     * Get the school year that owns the admission application.
     *
     * @return SchoolYear
     */
    public function getSchoolYearAttribute(): SchoolYear
    {
        return $this->schoolYear()->first()->makeHidden(['academic_calendars']);
    }

    /**
     * Get the academic program that owns the admission application.
     *
     * @return AcademicProgram
     */
    public function getAcademicProgramAttribute(): AcademicProgram
    {
        return $this->academicProgram()->first();
    }

    /**
     * Get the logs for the admission application.
     *
     * @return array<AdmissionApplicationLog>
     */
    public function getLogsAttribute(): array
    {
        return $this->logs()
            ->get()
            ->makeHidden(['admission_application', 'user'])
            ->toArray();
    }

    /**
     * Get the user that owns the admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the school year that owns the admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYear(): BelongsTo
    {
        return $this->belongsTo(SchoolYear::class);
    }

    /**
     * Get the academic program that owns the admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicProgram(): BelongsTo
    {
        return $this->belongsTo(AcademicProgram::class);
    }

    /**
     * Get the logs for the admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function logs(): HasMany
    {
        return $this->hasMany(AdmissionApplicationLog::class);
    }

    /**
     * Get the latest status of the admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function latestStatus(): HasOne
    {
        return $this->hasOne(AdmissionApplicationLog::class)->latestOfMany();
    }

    /********************************/
    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->year)) {
                $model->year = now()->year;
            }

            // Ensure no duplicate during concurrency
            $model->pool_no = DB::transaction(function () use ($model) {
                $lastNo = self::where('year', $model->year)
                    ->lockForUpdate()
                    ->max('pool_no');

                return $lastNo ? $lastNo + 1 : 1;
            });
        });
    }
}
