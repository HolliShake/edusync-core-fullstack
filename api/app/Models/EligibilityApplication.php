<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "EligibilityApplication",
    title: "EligibilityApplication",
    type: "object",
    required: [
        // Override required
    ],
    properties: [
        // Override fillables
    ]
)]

#[OA\Schema(
    schema: "PaginatedEligibilityApplication",
    title:"PaginatedEligibilityApplication",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/EligibilityApplication")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedEligibilityApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedEligibilityApplication")
    ]
)]

#[OA\Schema(
    schema: "GetEligibilityApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EligibilityApplication")
    ]
)]

#[OA\Schema(
    schema: "GetEligibilityApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/EligibilityApplication"))
    ]
)]

#[OA\Schema(
    schema: "CreateEligibilityApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EligibilityApplication")
    ]
)]

#[OA\Schema(
    schema: "UpdateEligibilityApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EligibilityApplication")
    ]
)]

#[OA\Schema(
    schema: "DeleteEligibilityApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class EligibilityApplication extends Model
{
    //
}
