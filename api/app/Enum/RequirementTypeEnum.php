<?php

namespace App\Enum;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "RequirementTypeEnum",
    title: "RequirementTypeEnum",
    type: "string",
    enum: RequirementTypeEnum::class,
)]
enum RequirementTypeEnum: string
{
    case ADMISSION = 'admission';
    case GRADUATION = 'graduation';
    case ENROLLMENT = 'enrollment';
    case SCHOLARSHIP = 'scholarship';
    case TRANSFER = 'transfer';
    case GENERAL = 'general';
}
