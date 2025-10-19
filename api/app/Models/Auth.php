<?php

namespace App\Models;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AuthCredential",
    title: "AuthCredential",
    type: "object",
    required: [
        "email",
        "password"
    ],
    properties: [
        new OA\Property(property: "email", type: "string"),
        new OA\Property(property: "password", type: "string")
    ]
)]


#[OA\Schema(
    schema: "LoginResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "string")
    ]
)]

#[OA\Schema(
    schema: "GetSession",
    title: "GetSession",
    type: "object",
    required: [
        // flags
        "is_admin",
        "is_program_chair",
        "is_college_dean",
        "is_specialization_chair",
        "is_campus_scheduler",
        "is_campus_registrar",
        "is_student",
        "is_faculty",
        "is_guest",
        // user data
        "active_academic_program",
        "active_college",
        "active_specialization",
        "active_campus"
    ],
    properties: [
        // flags
        new OA\Property(property: "is_admin", type: "boolean"),
        new OA\Property(property: "is_program_chair", type: "boolean"),
        new OA\Property(property: "is_college_dean", type: "boolean"),
        new OA\Property(property: "is_specialization_chair", type: "boolean"),
        new OA\Property(property: "is_campus_scheduler", type: "boolean"),
        new OA\Property(property: "is_campus_registrar", type: "boolean"),
        new OA\Property(property: "is_student", type: "boolean"),
        new OA\Property(property: "is_faculty", type: "boolean"),
        new OA\Property(property: "is_guest", type: "boolean"),
        // user data
        new OA\Property(property: "roles", type: "array", items: new OA\Items(type: "enum", enum: ['admin', 'program-chair', 'college-dean', 'specialization-chair', 'campus-scheduler', 'campus-registrar', 'student', 'faculty', 'guest'])),
        new OA\Property(property: "active_academic_program", type: "integer", nullable: true),
        new OA\Property(property: "active_college", type: "integer", nullable: true),
        new OA\Property(property: "active_specialization", type: "integer", nullable: true),
        new OA\Property(property: "active_campus", type: "integer", nullable: true)
    ]
)]

#[OA\Schema(
    schema: "SessionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/GetSession")
    ]
)]
class Auth {}
