<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "UniversityAdmission",
    title: "UniversityAdmission",
    type: "object",
    required: [
        // Override required
        'school_year_id',
        'open_date',
        'close_date',
        'is_open_override',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "school_year_id", type: "integer"),
        new OA\Property(property: "open_date", type: "string", format: "date-time"),
        new OA\Property(property: "close_date", type: "string", format: "date-time"),
        new OA\Property(property: "is_open_override", type: "boolean"),
        // Computed
        new OA\Property(property: "is_ongoing", type: "boolean", readOnly: true),
        // Relation
        new OA\Property(property: "school_year", ref: "#/components/schemas/SchoolYear"),
        new OA\Property(property: "university_admission_criterias", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionCriteria")),
        new OA\Property(property: "admission_schedules", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionSchedule")),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmission",
    title:"PaginatedUniversityAdmission",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmission")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedUniversityAdmission")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmission")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmission"))
    ]
)]

#[OA\Schema(
    schema: "CreateUniversityAdmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmission")
    ]
)]

#[OA\Schema(
    schema: "UpdateUniversityAdmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmission")
    ]
)]

#[OA\Schema(
    schema: "DeleteUniversityAdmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class UniversityAdmission extends Model
{
    protected $table = 'university_admission';

    protected $fillable = [
        'school_year_id',
        'open_date',
        'close_date',
        'is_open_override',
    ];

    protected $casts = [
        'school_year_id' => 'integer',
        'open_date' => 'datetime',
        'close_date' => 'datetime',
        'is_open_override' => 'boolean',
    ];

    protected $appends = [
        'school_year',
        'is_ongoing',
        'university_admission_criterias',
        'admission_schedules',
    ];

    /**
     * Get the is ongoing attribute.
     *
     * @return bool
     */
    public function getIsOngoingAttribute(): bool
    {
        return now()->between($this->open_date, $this->close_date);
    }

    /**
     * Get the university admission criterias attribute.
     *
     * @return array<UniversityAdmissionCriteria>
     */
    public function getUniversityAdmissionCriteriasAttribute(): array
    {
        return $this->universityAdmissionCriterias()->get()->makeHidden(['university_admission'])->toArray();
    }

    /**
     * Get the admission schedules for the university admission.
     *
     * @return array<AdmissionSchedule>
     */
    public function getAdmissionSchedulesAttribute(): array
    {
        return $this->admissionSchedules()->get()->makeHidden(['university_admission'])->toArray();
    }

    /**
     * Get the school year that owns the university admission.
     *
     * @return SchoolYear
     */
    public function getSchoolYearAttribute(): SchoolYear
    {
        return $this->schoolYear()->first();
    }

    /**
     * Get the school year that owns the university admission.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYear(): BelongsTo
    {
        return $this->belongsTo(SchoolYear::class);
    }

    /**
     * Get criterias
     */
    public function universityAdmissionCriterias():HasMany
    {
        return $this->hasMany(UniversityAdmissionCriteria::class);
    }

    /**
     * Get the admission schedules for the university admission.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function admissionSchedules(): HasMany
    {
        return $this->hasMany(AdmissionSchedule::class);
    }
}
