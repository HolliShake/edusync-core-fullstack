<?php

namespace App\Enum;

enum UserRoleEnum: string
{
    case ADMIN = 'admin';
    case STUDENT = 'student';
    case FACULTY = 'faculty';
    case GUEST = 'guest';
}
