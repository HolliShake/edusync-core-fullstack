<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'firstName',
        'lastName',
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
        new OA\Property(property: "firstName", type: "string"),
        new OA\Property(property: "lastName", type: "string"),
        new OA\Property(property: "middleName", type: "string", nullable: true),
        new OA\Property(property: "email", type: "string"),
        new OA\Property(property: "phone", type: "string"),
        new OA\Property(property: "address", type: "string"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
        new OA\Property(property: "latest_status", type: "string"),
        // Relation
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
        new OA\Property(property: "schoolYear", ref: "#/components/schemas/SchoolYear"),
        new OA\Property(property: "academicProgram", ref: "#/components/schemas/AcademicProgram"),
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
        'firstName',
        'lastName',
        'middleName',
        'email',
        'phone',
        'address',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'school_year_id' => 'integer',
        'academic_program_id' => 'integer',
        'year' => 'integer',
        'pool_no' => 'integer',
    ];

    protected $appends = [
        'latest_status',
        'user',
        'schoolYear',
        'academicProgram',
        'logs',
    ];

    /**
     * Get the latest status of the admission application.
     *
     * @return string
     */
    public function getLatestStatusAttribute(): string
    {
        $latestLog = $this->logs()->latest()->first();
        return $latestLog ? $latestLog->type : '';
    }

    /**
     * Get the user that owns the admission application.
     *
     * @return \App\Models\User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first();
    }

    /**
     * Get the school year that owns the admission application.
     *
     * @return \App\Models\SchoolYear
     */
    public function getSchoolYearAttribute(): SchoolYear
    {
        return $this->schoolYear()->first();
    }

    /**
     * Get the academic program that owns the admission application.
     *
     * @return \App\Models\AcademicProgram
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
        return $this->logs()->get()->toArray();
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
