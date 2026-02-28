<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Office",
    title: "Office",
    type: "object",
    required: [
        // Override required
        'name',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "name", type: "string"),
        new OA\Property(property: "description", type: "string", nullable: true),
        new OA\Property(property: "address", type: "string", nullable: true),
        new OA\Property(property: "phone", type: "string", nullable: true),
        new OA\Property(property: "email", type: "string", nullable: true),
        new OA\Property(property: "website", type: "string", nullable: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Fk
        new OA\Property(property: "campus_id", type: "integer"),
        // Relation
        new OA\Property(property: "campus", ref: "#/components/schemas/Campus"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedOffice",
    title:"PaginatedOffice",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Office")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedOfficeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedOffice")
    ]
)]

#[OA\Schema(
    schema: "GetOfficeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Office")
    ]
)]

#[OA\Schema(
    schema: "GetOfficesResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Office"))
    ]
)]

#[OA\Schema(
    schema: "CreateOfficeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Office")
    ]
)]

#[OA\Schema(
    schema: "UpdateOfficeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Office")
    ]
)]

#[OA\Schema(
    schema: "DeleteOfficeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class Office extends Model
{
    protected $table = 'office';

    protected $fillable = [
        'campus_id',
        'name',
        'description',
        'address',
        'phone',
        'email',
        'website',
    ];

    protected $casts = [
        'campus_id' => 'integer',
    ];

    /**
     * Get the campus that the office belongs to.
     *
     * @return BelongsTo
     */
    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }
}
