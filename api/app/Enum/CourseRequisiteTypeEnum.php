<?php

namespace App\Enum;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "CourseRequisiteTypeEnum",
    title: "CourseRequisiteTypeEnum",
    type: "string",
    enum: CourseRequisiteTypeEnum::class,
)]
enum CourseRequisiteTypeEnum: string
{
    case CO_REQUISITE = 'co';
    case PRE_REQUISITE = 'pre';
    case EQUIVALENT = 'equivalent';
}
