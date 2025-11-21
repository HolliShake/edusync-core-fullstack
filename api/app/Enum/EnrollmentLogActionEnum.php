<?php

namespace App\Enum;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "EnrollmentLogActionEnum",
    title: "EnrollmentLogActionEnum",
    type: "string",
    enum: EnrollmentLogActionEnum::class,
)]
enum EnrollmentLogActionEnum: string
{
    case ENROLL                         = 'enroll';                         // Initial status
    case PROGRAM_CHAIR_APPROVED         = 'program_chair_approved';         // Approved by program chair
    case REGISTRAR_APPROVED             = 'registrar_approved';             // Approved by registrar
    case PROGRAM_CHAIR_DROPPED_APPROVED = 'program_chair_dropped_approved'; // Dropped approved by program chair
    case REGISTRAR_DROPPED_APPROVED     = 'registrar_dropped_approved';     // Dropped approved by registrar
    case DROPPED                        = 'dropped';                        // Dropping Requested by student
    case REJECTED                       = 'rejected';                       // Rejected by program chair or registrar
}
