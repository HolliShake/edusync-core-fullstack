<?php

namespace App\Models;

use App\Enum\WeeklyScheduleEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "ScheduleAssignment",
    title: "ScheduleAssignment",
    type: "object",
    required: [
        // Override required
        'section_id',
        'room_id',
        'day_schedule',
        'start_time',
        'end_time',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "section_id", type: "integer"),
        new OA\Property(property: "room_id", type: "integer"),
        new OA\Property(property: "day_schedule", type: "string", format: "date"),
        new OA\Property(property: "start_time", type: "string", format: "time"),
        new OA\Property(property: "end_time", type: "string", format: "time"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Relationships
        new OA\Property(property: "section", ref: "#/components/schemas/Section"),
        new OA\Property(property: "room", ref: "#/components/schemas/Room"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedScheduleAssignment",
    title:"PaginatedScheduleAssignment",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/ScheduleAssignment")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedScheduleAssignmentResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedScheduleAssignment")
    ]
)]

#[OA\Schema(
    schema: "GetScheduleAssignmentResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/ScheduleAssignment")
    ]
)]

#[OA\Schema(
    schema: "GetScheduleAssignmentsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/ScheduleAssignment"))
    ]
)]

#[OA\Schema(
    schema: "CreateScheduleAssignmentResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/ScheduleAssignment")
    ]
)]

#[OA\Schema(
    schema: "UpdateScheduleAssignmentResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/ScheduleAssignment")
    ]
)]

#[OA\Schema(
    schema: "DeleteScheduleAssignmentResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class ScheduleAssignment extends Model
{
    protected $table = 'schedule_assignment';

    public $timestamps = true;

    protected $fillable = [
        'section_id',
        'room_id',
        'day_schedule',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'section_id'   => 'integer',
        'room_id'      => 'integer',
        'day_schedule' => WeeklyScheduleEnum::class,
        'start_time'   => 'datetime',
        'end_time'     => 'datetime',
    ];

    protected $appends = [
        'section',
        'room',
    ];

    /**
     * Get the section that owns the schedule assignment.
     *
     * @return Section
     */
    public function getSectionAttribute(): Section
    {
        return $this->section()->first();
    }

    /**
     * Get the room that owns the schedule assignment.
     *
     * @return Room
     */
    public function getRoomAttribute(): Room
    {
        return $this->room()->first();
    }

    /**
     * Get the section that owns the schedule assignment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    /**
     * Get the room that owns the schedule assignment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
