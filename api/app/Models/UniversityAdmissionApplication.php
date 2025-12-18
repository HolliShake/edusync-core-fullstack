<?php

namespace App\Models;

use App\Enum\AdmissionApplicationLogTypeEnum;
use DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "UniversityAdmissionApplication",
    title: "UniversityAdmissionApplication",
    type: "object",
    required: [
        "university_admission_id",
        "user_id",
        "remark"
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "university_admission_id", type: "integer"),
        new OA\Property(property: "university_admission_schedule_id", type: "integer", nullable: true),
        new OA\Property(property: "user_id", type: "integer"),
        new OA\Property(property: "is_passed", type: "boolean", nullable: true),
        new OA\Property(property: "score", type: "number", format: "decimal", nullable: true),
        new OA\Property(property: "remark", type: "string"),
        new OA\Property(property: "year", type: "integer"),
        new OA\Property(property: "pool_no", type: "integer"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "temporary_id", type: "string", readOnly: true),
        new OA\Property(property: "latest_status", type: "string", enum: AdmissionApplicationLogTypeEnum::class, readOnly: true),
        new OA\Property(property: "latest_status_label", type: "string", readOnly: true),
        // Relations
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
        new OA\Property(property: "university_admission", ref: "#/components/schemas/UniversityAdmission"),
        new OA\Property(property: "university_admission_schedule", ref: "#/components/schemas/UniversityAdmissionSchedule", nullable: true),
        new OA\Property(property: "university_admission_criteria_submissions", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionApplicationCriteriaSubmission")),
        new OA\Property(property: "logs", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionApplicationLog")),
    ]
)]

#[OA\Schema(
    schema: "SubmitUniversityAdmissionApplicationForm",
    properties: [
        new OA\Property(
            property: "data",
            type: "array",
            items: new OA\Items(
                properties: [
                    new OA\Property(property: "user_id", type: "integer"),
                    new OA\Property(property: "university_admission_id", type: "integer"),
                    new OA\Property(property: "university_admission_criteria_id", type: "integer"),
                    new OA\Property(property: "file", type: "string", format: "binary")
                ]
            )
        )
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionApplication",
    title:"PaginatedUniversityAdmissionApplication",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionApplication")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedUniversityAdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "GetAllUniversityAdmissionApplicationsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionApplication"))
    ]
)]

#[OA\Schema(
    schema: "CreateUniversityAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "UpdateUniversityAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "DeleteUniversityAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class UniversityAdmissionApplication extends Model
{
    protected $table = 'university_admission_application';

    protected $fillable = [
        'university_admission_id',
        'university_admission_schedule_id',
        'user_id',
        'is_passed',
        'score',
        'remark'
    ];

    protected $casts = [
        'is_passed' => 'boolean',
        'score' => 'decimal:2',
    ];

    protected $appends = [
        'latest_status',
        'latest_status_label',
        'user',
        'university_admission',
        'university_admission_schedule',
        'temporary_id',
        'university_admission_criteria_submissions',
        'logs',
    ];

    public function getTemporaryIdAttribute(): string
    {
       $pool = $this->pool_no;
       $year = $this->year;
       return $year . str_pad($pool, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Get the latest status of the university admission application.
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
        $latestLog = $this->latestStatus()->first();
        return $latestLog?->type_label ?? AdmissionApplicationLogTypeEnum::SUBMITTED->value;
    }

    /**
     * Get the user that owns the university admission application.
     *
     * @return User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first()->makeHidden(['roles', 'is_student', 'enrollments', 'designitions']);
    }

    /**
     * Get the university admission that owns the university admission application.
     *
     * @return UniversityAdmission
     */
    public function getUniversityAdmissionAttribute(): UniversityAdmission
    {
        return $this->universityAdmission()->first()
            ->makeHidden(['university_admission_criterias', 'admission_schedules']);
    }

    /**
     * Get the university admission schedule that owns the university admission application.
     *
     * @return UniversityAdmissionSchedule|null
     */
    public function getUniversityAdmissionScheduleAttribute(): ?UniversityAdmissionSchedule
    {
        $schedule = $this->universityAdmissionSchedule()->first();
        
        if (!$schedule) {
            return null;
        }
        
        return $schedule->makeHidden(['university_admission']);
    }

    /**
     * Get the university admission application criteria submissions that owns the university admission application.
     *
     * @return array
     */
    public function getUniversityAdmissionCriteriaSubmissionsAttribute(): array
    {
        return $this->universityAdmissionCriteriaSubmissions()->get()?->makeHidden(['university_admission_application', 'university_admission_criteria'])->toArray();
    }

    /**
     * Get the logs for the university admission application.
     *
     * @return array<UniversityAdmissionApplicationLog>
     */
    public function getLogsAttribute(): array
    {
        return $this->logs()
            ->get()
            ->makeHidden(['university_admission_application', 'user'])
            ->toArray();
    }
    
    /**
     * Get the user that owns the university admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the university admission that owns the university admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function universityAdmission(): BelongsTo
    {
        return $this->belongsTo(UniversityAdmission::class);
    }

    /**
     * Get the university admission schedule that owns the university admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function universityAdmissionSchedule(): BelongsTo
    {
        return $this->belongsTo(UniversityAdmissionSchedule::class);
    }

    /**
     * Get the university admission application criteria submissions that owns the university admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function universityAdmissionCriteriaSubmissions(): HasMany
    {
        return $this->hasMany(UniversityAdmissionApplicationCriteriaSubmission::class);
    }


    /**
     * Get the latest status of the university admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function latestStatus(): HasOne
    {
        return $this->hasOne(UniversityAdmissionApplicationLog::class)->latestOfMany();
    }

    /**
     * Get the university admission application logs that owns the university admission application.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function logs(): HasMany
    {
        return $this->hasMany(UniversityAdmissionApplicationLog::class);
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
