<?php

namespace App\Enum;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "WeeklyScheduleEnum",
    title: "WeeklyScheduleEnum",
    type: "string",
    enum: WeeklyScheduleEnum::class,
)]
enum WeeklyScheduleEnum: string
{
    case SUNDAY    = 'Sunday';
    case MONDAY    = 'Monday';
    case TUESDAY   = 'Tuesday';
    case WEDNESDAY = 'Wednesday';
    case THURSDAY  = 'Thursday';
    case FRIDAY    = 'Friday';
    case SATURDAY  = 'Saturday';
}

