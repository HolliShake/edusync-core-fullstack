<?php

namespace App\Enum;

enum EnrollmentLogActionEnum: string
{
    case ENROLL = 'enroll';
    case PROGRAM_CHAIR_APPROVED = 'program_chair_approved';
    case REGISTRAR_APPROVED = 'registrar_approved';
    case DROPPED = 'dropped';
}
