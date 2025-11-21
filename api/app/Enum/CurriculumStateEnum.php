<?php

namespace App\Enum;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "CurriculumStateEnum",
    title: "CurriculumStateEnum",
    type: "string",
    enum: CurriculumStateEnum::class,
)]
enum CurriculumStateEnum: string
{
    case ACTIVE   = 'active';
    case INACTIVE = 'inactive';
    case ARCHIVED = 'archived';
}
