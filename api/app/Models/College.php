<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "College",
    title: "College",
    type: "object",
    required: [
        "college_name",
        "college_shortname",
        "campus_id"
    ],
    properties: [
        new OA\Property(property: "id", type: "integer"),
        new OA\Property(property: "college_name", type: "string"),
        new OA\Property(property: "college_shortname", type: "string"),
        new OA\Property(property: "campus_id", type: "integer"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCollege",
    title:"PaginatedCollege",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/College")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedCollegeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedCollege")
    ]
)]

#[OA\Schema(
    schema: "GetCollegeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/College")
    ]
)]

#[OA\Schema(
    schema: "CreateCollegeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/College")
    ]
)]

#[OA\Schema(
    schema: "UpdateCollegeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/College")
    ]
)]

#[OA\Schema(
    schema: "DeleteCollegeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class College extends Model
{
    protected $table = 'college';

    protected $fillable = [
        'college_name',
        'college_shortname',
        'campus_id'
    ];

    protected $casts = [
        'campus_id' => 'integer',
    ];

    /**
     * Get the campus that owns the college.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class, 'campus_id');
    }
}
