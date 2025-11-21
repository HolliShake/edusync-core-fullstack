<?php

namespace App\Enum;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "UserRoleEnum",
    title: "UserRoleEnum",
    type: "string",
    enum: UserRoleEnum::class,
)]
enum UserRoleEnum: string
{
    case ADMIN = 'admin';
    case PROGRAM_CHAIR = 'program_chair';
    case COLLEGE_DEAN = 'college_dean';
    case SPECIALIZATION_CHAIR = 'specialization_chair';
    case CAMPUS_SCHEDULER = 'campus_scheduler';
    case CAMPUS_REGISTRAR = 'campus_registrar';
    case STUDENT = 'student';
    case FACULTY = 'faculty';
    case GUEST = 'guest';
}
