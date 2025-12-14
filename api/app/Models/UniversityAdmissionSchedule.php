<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "UniversityAdmissionSchedule",
    title: "UniversityAdmissionSchedule",
    type: "object",
    required: [
        // Override required
        'university_admission_id',
        'testing_center_id',
        'start_date',
        'end_date',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "university_admission_id", type: "integer", example: 1),
        new OA\Property(property: "testing_center_id", type: "integer", example: 1),
        new OA\Property(property: "start_date", type: "string", format: "date-time", example: "2024-01-15 08:00:00"),
        new OA\Property(property: "end_date", type: "string", format: "date-time", example: "2024-01-15 17:00:00"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2024-01-01 00:00:00"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2024-01-01 00:00:00"),
        // Relation
        new OA\Property(property: "university_admission", ref: "#/components/schemas/UniversityAdmission"),
        new OA\Property(property: "testing_center", ref: "#/components/schemas/TestingCenter"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionSchedule",
    title:"PaginatedUniversityAdmissionSchedule",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionSchedule")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedUniversityAdmissionSchedule")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionSchedule")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionSchedulesResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionSchedule"))
    ]
)]

#[OA\Schema(
    schema: "CreateUniversityAdmissionScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionSchedule")
    ]
)]

#[OA\Schema(
    schema: "UpdateUniversityAdmissionScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionSchedule")
    ]
)]

#[OA\Schema(
    schema: "DeleteUniversityAdmissionScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class UniversityAdmissionSchedule extends Model
{
    protected $table = 'university_admission_schedule';

    public $timestamps = true;

    protected $fillable = [
        'university_admission_id',
        'testing_center_id',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'university_admission_id' => 'integer',
        'testing_center_id' => 'integer',
    ];

    protected $appends = [
        'university_admission',
        'testing_center',
    ];

    /**
     * Get the university admission that owns the university admission schedule.
     *
     * @return UniversityAdmission
     */
    public function getUniversityAdmissionAttribute(): UniversityAdmission
    {
        return $this->universityAdmission()->first();
    }

    /**
     * Get the testing center that owns the university admission schedule.
     *
     * @return TestingCenter
     */
    public function getTestingCenterAttribute(): TestingCenter
    {
        return $this->testingCenter()->first();
    }

    /**
     * Get the university admission that owns the university admission schedule.
     *
     * @return UniversityAdmission
     */
    public function universityAdmission(): BelongsTo
    {
        return $this->belongsTo(UniversityAdmission::class);
    }

    /**
     * Get the testing center that owns the university admission schedule.
     *
     * @return TestingCenter
     */
    public function testingCenter(): BelongsTo
    {
        return $this->belongsTo(TestingCenter::class);
    }
}
