<?php

namespace App\Enum;

enum UserRoleEnum: string
{
    case ADMIN = 'admin';
    case PROGRAM_CHAIR = 'program-chair';
    case COLLEGE_DEAN = 'college-dean';
    case SPECIALIZATION_CHAIR = 'specialization-chair';
    case CAMPUS_SCHEDULER = 'campus-scheduler';
    case CAMPUS_REGISTRAR = 'campus-registrar';
    case STUDENT = 'student';
    case FACULTY = 'faculty';
    case GUEST = 'guest';
}
