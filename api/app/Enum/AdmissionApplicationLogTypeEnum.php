<?php

namespace App\Enum;

enum AdmissionApplicationLogTypeEnum: string
{
    case SUBMITTED = 'submitted';
    case CANCELLED = 'cancelled';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}
