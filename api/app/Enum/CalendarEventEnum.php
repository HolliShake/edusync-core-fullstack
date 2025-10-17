<?php

namespace App\Enum;

/**
 * Enum representing key event types in a university academic calendar.
 * Add or refine cases as needed for your institution's requirements.
 */
enum CalendarEventEnum: string
{
    case REGISTRATION         = 'REGISTRATION';
    case ENROLLMENT           = 'ENROLLMENT';
    case ORIENTATION          = 'ORIENTATION';
    case START_OF_CLASSES     = 'START_OF_CLASSES';
    case HOLIDAY              = 'HOLIDAY';
    case UNIVERSITY_EVENT     = 'UNIVERSITY_EVENT';
    case DEADLINE             = 'DEADLINE';
    case PERIODIC_EXAM        = 'PERIODIC_EXAM'; // Example: Midterm exam, Final exam
    case END_OF_CLASSES       = 'END_OF_CLASSES';
    case GRADE_SUBMISSION     = 'GRADE_SUBMISSION';
    case GRADUATION           = 'GRADUATION';
    case FACULTY_EVALUATION   = 'FACULTY_EVALUATION';
    case ACADEMIC_TRANSITION  = 'ACADEMIC_TRANSITION'; // Example: Change from first sem to Second sem
    case OTHER                = 'OTHER';
}

