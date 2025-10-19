<?php

namespace App\Enum;

enum RequirementTypeEnum: string
{
    case ADMISSION = 'admission';
    case GRADUATION = 'graduation';
    case ENROLLMENT = 'enrollment';
    case SCHOLARSHIP = 'scholarship';
    case TRANSFER = 'transfer';
    case GENERAL = 'general';
}
