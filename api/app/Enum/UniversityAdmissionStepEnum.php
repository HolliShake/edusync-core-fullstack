<?php

namespace App\Enum;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "UniversityAdmissionStepEnum",
    title: "UniversityAdmissionStepEnum",
    type: "string",
    enum: UniversityAdmissionStepEnum::class,
)]
enum UniversityAdmissionStepEnum: string
{
    case NOT_ELIGIBLE = 'not_eligible'; // first
    case SCHEDULE_SELECTION = 'schedule_selection'; // if criteria is approved, then schedule selection
    case TAKE_EXAM = 'take_exam'; // if schedule is selected, then take exam
    case APPLY_TO_PROGRAM = 'apply_to_program'; // if exam is passed, then apply to program
    case LOCKED = 'locked'; // if user is already enrolled to the program or application is locked, or already applied to the program
}
