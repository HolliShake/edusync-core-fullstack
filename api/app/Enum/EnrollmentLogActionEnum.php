<?php

namespace App\Enum;

enum EnrollmentLogActionEnum: string
{
    case ENROLL                         = 'enroll';
    case PROGRAM_CHAIR_APPROVED         = 'program_chair_approved';
    case REGISTRAR_APPROVED             = 'registrar_approved';
    case PROGRAM_CHAIR_DROPPED_APPROVED = 'program_chair_dropped_approved';
    case REGISTRAR_DROPPED_APPROVED     = 'registrar_dropped_approved';
    case DROPPED                        = 'dropped';
}
