<?php

namespace App\Enum;

enum DocumentRequestLogActionEnum: string
{
    case SUBMITTED   = 'submitted';
    case CANCELLED   = 'cancelled';
    case PAID        = 'paid';
    case REJECTED    = 'rejected';
    case PROCESSING  = 'processing';
    case PICKUP      = 'pickup';
    case COMPLETED   = 'completed';
}
