<?php

namespace App\Enum;

enum CurriculumStateEnum: string
{
    case ACTIVE   = 'active';
    case INACTIVE = 'inactive';
    case ARCHIVED = 'archived';
}
