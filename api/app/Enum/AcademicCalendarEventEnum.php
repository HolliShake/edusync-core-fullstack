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
    case ENROLLMENT           = 'ENROLLMENT'; // REQUIRED TO HAVE PER SCHOOL YEAR (Must be before EVERY START_OF_CLASSES): e.g. Enrollment for First Semester (in any year) or Enrollment for Second Semester (in any year) or Enrollment for Summer Term (in any year)
    case ADDING_DROPPING_OF_SUBJECTS = 'ADDING_DROPPING_OF_SUBJECTS'; // REQUIRED TO HAVE PER SCHOOL YEAR (Must be after EVERY START_OF_CLASSES): e.g. Adding/Dropping of Subjects for First Semester (in any year) or Adding/Dropping of Subjects for Second Semester (in any year) or Adding/Dropping of Subjects for Summer Term (in any year)
    case ORIENTATION          = 'ORIENTATION';
    case START_OF_CLASSES     = 'START_OF_CLASSES'; // REQUIRED TO HAVE PER SCHOOL YEAR (Must be before EVERY ACADEMIC_TRANSITION): e.g. Start of Classes for First Semester (in any year) or Start of Classes for Second Semester (in any year) or Start of Classes for Summer Term (in any year)
    case ACADEMIC_TRANSITION  = 'ACADEMIC_TRANSITION'; // REQUIRED TO HAVE PER SCHOOL YEAR (Must be before EVERY PERIODIC_EXAM): e.g. First to Second Semester
    case PERIODIC_EXAM        = 'PERIODIC_EXAM';       // REQUIRED TO HAVE PER SCHOOL YEAR: e.g. Midterm, Final Exam
    case END_OF_CLASSES       = 'END_OF_CLASSES'; // REQUIRED TO HAVE PER SCHOOL YEAR: e.g. End of Classes for First Semester (in any year) or End of Classes for Second Semester (in any year) or End of Classes for Summer Term (in any year)
    case FACULTY_EVALUATION   = 'FACULTY_EVALUATION'; // REQUIRED TO HAVE PER SCHOOL YEAR (Must be after PERIODIC_EXAM and before END_OF_CLASSES): e.g. Faculty Evaluation for First Semester (in any year) or Faculty Evaluation for Second Semester (in any year) or Faculty Evaluation for Summer Term (in any year)
    case GRADE_SUBMISSION     = 'GRADE_SUBMISSION'; // REQUIRED TO HAVE PER SCHOOL YEAR (MUST be after EVERY PERIODIC_EXAM and before GRADUATION): e.g. Grade Submission for First Semester (in any year) or Grade Submission for Second Semester (in any year) or Grade Submission for Summer Term (in any year)
    case GRADUATION           = 'GRADUATION'; // REQUIRED TO HAVE PER SCHOOL YEAR: e.g. Graduation for First Semester (in any year) or Graduation for Second Semester (in any year) or Graduation for Summer Term (in any year)
    case UNIVERSITY_EVENT     = 'UNIVERSITY_EVENT';
    case HOLIDAY              = 'HOLIDAY';
    case OTHER                = 'OTHER';
}

