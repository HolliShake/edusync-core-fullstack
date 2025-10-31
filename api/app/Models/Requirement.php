<?php

namespace App\Models;

use App\Enum\RequirementTypeEnum;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Requirement",
    title: "Requirement",
    type: "object",
    required: [
        // Override required
        'requirement_name',
        'requirement_type',
        'is_mandatory',
        'is_active'
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "requirement_name", type: "string"),
        new OA\Property(property: "description", type: "string", nullable: true),
        new OA\Property(property: "requirement_type", type: "string", enum: RequirementTypeEnum::class, readOnly: true),
        new OA\Property(property: "is_mandatory", type: "boolean", default: true),
        new OA\Property(property: "is_active", type: "boolean", default: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedRequirement",
    title:"PaginatedRequirement",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Requirement")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedRequirementResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedRequirement")
    ]
)]

#[OA\Schema(
    schema: "GetRequirementResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Requirement")
    ]
)]

#[OA\Schema(
    schema: "GetRequirementsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Requirement"))
    ]
)]

#[OA\Schema(
    schema: "CreateRequirementResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Requirement")
    ]
)]

#[OA\Schema(
    schema: "UpdateRequirementResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/Requirement")
    ]
)]

#[OA\Schema(
    schema: "DeleteRequirementResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class Requirement extends Model
{
    protected $table = 'requirement';

    public $timestamps = true;

    protected $fillable = [
        'requirement_name',
        'description',
        'requirement_type',
        'is_mandatory',
        'is_active'
    ];

    protected $casts = [
        'is_mandatory' => 'boolean',
        'is_active'    => 'boolean'
    ];
}
