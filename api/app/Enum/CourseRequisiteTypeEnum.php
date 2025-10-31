<?php

namespace App\Enum;

enum CourseRequisiteTypeEnum: string
{
    case CO_REQUISITE = 'co';
    case PRE_REQUISITE = 'pre';
    case EQUIVALENT = 'equivalent';
}
