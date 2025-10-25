<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AdmissionSchedule",
    title: "AdmissionSchedule",
    type: "object",
    required: [
        // Override required
        'school_year_id',
        'campus_id',
        'start_date',
        'end_date',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "school_year_id", type: "integer"),
        new OA\Property(property: "campus_id", type: "integer"),
        new OA\Property(property: "start_date", type: "string", format: "date"),
        new OA\Property(property: "end_date", type: "string", format: "date"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Relationships
        new OA\Property(property: "school_year", ref: "#/components/schemas/SchoolYear"),
        new OA\Property(property: "campus", ref: "#/components/schemas/Campus"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionSchedule",
    title:"PaginatedAdmissionSchedule",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionSchedule")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAdmissionSchedule")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionSchedule")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionSchedulesResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionSchedule"))
    ]
)]

#[OA\Schema(
    schema: "CreateAdmissionScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionSchedule")
    ]
)]

#[OA\Schema(
    schema: "UpdateAdmissionScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionSchedule")
    ]
)]

#[OA\Schema(
    schema: "DeleteAdmissionScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AdmissionSchedule extends Model
{
    protected $table = 'admission_schedule';

    public $timestamps = true;

    protected $fillable = [
        'school_year_id',
        'campus_id',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date'     => 'date',
        'end_date'       => 'date',
        'school_year_id' => 'integer',
        'campus_id'      => 'integer',
    ];

    protected $appends = [
        'school_year',
        'campus',
    ];

    /**
     * Get the school year that owns the admission schedule.
     *
     * @return Campus
     */
    public function getSchoolYearAttribute(): SchoolYear
    {
        return $this->schoolYear()->first();
    }

    /**
     * Get the campus that owns the admission schedule.
     *
     * @return Campus
     */
    public function getCampusAttribute(): Campus
    {
        return $this->campus()->first();
    }

    /**
     * Get the school year that owns the admission schedule.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYear(): BelongsTo
    {
        return $this->belongsTo(SchoolYear::class);
    }

    /**
     * Get the campus that owns the admission schedule.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }
}
