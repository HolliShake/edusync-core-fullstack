<?php

namespace App\Enum;

use OpenApi\Attributes as OA;

/**
 * Enum representing key event types in a university academic calendar.
 * Add or refine cases as needed for your institution's requirements.
 */
#[OA\Schema(
    schema: "AcademicCalendarEventEnum",
    title: "AcademicCalendarEventEnum",
    type: "string",
    enum: AcademicCalendarEventEnum::class,
)]
enum AcademicCalendarEventEnum: string
{
    case REGISTRATION         = 'REGISTRATION';
    case ENROLLMENT           = 'ENROLLMENT';
    case ORIENTATION          = 'ORIENTATION';
    case START_OF_CLASSES     = 'START_OF_CLASSES';
    case ACADEMIC_TRANSITION  = 'ACADEMIC_TRANSITION'; // e.g. First to Second Semester
    case PERIODIC_EXAM        = 'PERIODIC_EXAM';       // e.g. Midterm, Final Exam
    case END_OF_CLASSES       = 'END_OF_CLASSES';
    case FACULTY_EVALUATION   = 'FACULTY_EVALUATION';
    case GRADE_SUBMISSION     = 'GRADE_SUBMISSION';
    case DEADLINE             = 'DEADLINE';
    case GRADUATION           = 'GRADUATION';
    case UNIVERSITY_EVENT     = 'UNIVERSITY_EVENT';
    case HOLIDAY              = 'HOLIDAY';
    case OTHER                = 'OTHER';
}

