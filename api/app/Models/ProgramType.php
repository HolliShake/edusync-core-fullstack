<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "ProgramType",
    title: "ProgramType",
    type: "object",
    required: [
        "name",
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2025-01-07T10:27:56.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2025-01-07T10:27:56.000000Z"),
        new OA\Property(property: "name", type: "string", example: "Example Program Type"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedProgramType",
    title:"PaginatedProgramType",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/ProgramType")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedProgramTypeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedProgramType")
    ]
)]

#[OA\Schema(
    schema: "GetProgramTypeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/ProgramType")
    ]
)]

#[OA\Schema(
    schema: "CreateProgramTypeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/ProgramType")
    ]
)]

#[OA\Schema(
    schema: "UpdateProgramTypeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/ProgramType")
    ]
)]

#[OA\Schema(
    schema: "DeleteProgramTypeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class ProgramType extends Model
{
    protected $table = 'program_type';
    protected $fillable = ['name'];
}
