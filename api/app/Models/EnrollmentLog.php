<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "EnrollmentLog",
    title: "EnrollmentLog",
    type: "object",
    required: [
        // Override required
        'enrollment_id',
        'user_id',
        'action',
        'logged_by_user_id',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "enrollment_id", type: "integer"),
        new OA\Property(property: "user_id", type: "integer"),
        new OA\Property(property: "action", type: "string", enum: ['program_chair_approved', 'registrar_approved', 'dropped']),
        new OA\Property(property: "logged_by_user_id", type: "integer"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
        // Relationships
        new OA\Property(property: "enrollment", ref: "#/components/schemas/Enrollment"),
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
        new OA\Property(property: "logged_by_user", ref: "#/components/schemas/User"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedEnrollmentLog",
    title:"PaginatedEnrollmentLog",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/EnrollmentLog")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedEnrollmentLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedEnrollmentLog")
    ]
)]

#[OA\Schema(
    schema: "GetEnrollmentLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EnrollmentLog")
    ]
)]

#[OA\Schema(
    schema: "GetEnrollmentLogsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/EnrollmentLog"))
    ]
)]

#[OA\Schema(
    schema: "CreateEnrollmentLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EnrollmentLog")
    ]
)]

#[OA\Schema(
    schema: "UpdateEnrollmentLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/EnrollmentLog")
    ]
)]

#[OA\Schema(
    schema: "DeleteEnrollmentLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class EnrollmentLog extends Model
{
    protected $table = 'enrollment_log';

    public $timestamps = true;

    protected $fillable = [
        'enrollment_id',
        'user_id',
        'action',
        'logged_by_user_id',
    ];
}
