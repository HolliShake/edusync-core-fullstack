<?php

namespace App\Models;

use App\Enum\CalendarEventEnum;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AcademicCalendar",
    title: "AcademicCalendar",
    type: "object",
    required: [
        // Fillables
        'name',
        'start_date',
        'end_date',
        'school_year_id',
        'event',
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "name", type: "string"),
        new OA\Property(property: "description", type: "string", nullable: true),
        new OA\Property(property: "start_date", type: "string", format: "date"),
        new OA\Property(property: "end_date", type: "string", format: "date"),
        new OA\Property(property: "school_year_id", type: "integer"),
        new OA\Property(
            property: "event",
            type: "string",
            enum: CalendarEventEnum::class,
            readOnly: true
        ),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Relations
        new OA\Property(property: "school_year", type: "object", ref: "#/components/schemas/SchoolYear"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAcademicCalendar",
    title:"PaginatedAcademicCalendar",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AcademicCalendar")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAcademicCalendarResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAcademicCalendar")
    ]
)]

#[OA\Schema(
    schema: "GetAcademicCalendarResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicCalendar")
    ]
)]

#[OA\Schema(
    schema: "GetAcademicCalendarsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AcademicCalendar"))
    ]
)]

#[OA\Schema(
    schema: "CreateAcademicCalendarResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicCalendar")
    ]
)]

#[OA\Schema(
    schema: "UpdateAcademicCalendarResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicCalendar")
    ]
)]

#[OA\Schema(
    schema: "DeleteAcademicCalendarResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AcademicCalendar extends Model
{
    protected $table = 'academic_calendar';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'school_year_id',
        'event',
    ];

    protected $casts = [
        'school_year_id' => 'integer',
        'event'          => CalendarEventEnum::class,
    ];

    protected $appends = [
        'school_year',
    ];

    /**
     * Get the school year that owns the academic calendar.
     *
     * @return SchoolYear
     */
    public function getSchoolYearAttribute(): SchoolYear
    {
        return $this->schoolYear()
            ->first()
            ->makeHidden(['academic_calendars']);
    }

    /**
     * Get the school year that owns the academic calendar.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }
}
