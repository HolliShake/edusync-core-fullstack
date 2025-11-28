<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "EligibilitySchedule",
    title: "EligibilitySchedule",
    type: "object",
    required: [
        // Override required
    ],
    properties: [
        // Override fillables
    ]
)]

#[OA\Schema(
    schema: "PaginatedEligibilitySchedule",
    title:"PaginatedEligibilitySchedule",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/EligibilitySchedule")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedEligibilityScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedEligibilitySchedule")
    ]
)]

#[OA\Schema(
    schema: "GetEligibilityScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EligibilitySchedule")
    ]
)]

#[OA\Schema(
    schema: "GetEligibilityScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/EligibilitySchedule"))
    ]
)]

#[OA\Schema(
    schema: "CreateEligibilityScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EligibilitySchedule")
    ]
)]

#[OA\Schema(
    schema: "UpdateEligibilityScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EligibilitySchedule")
    ]
)]

#[OA\Schema(
    schema: "DeleteEligibilityScheduleResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class EligibilitySchedule extends Model
{
    //
}
