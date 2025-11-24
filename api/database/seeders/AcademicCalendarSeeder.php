<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicCalendar;
use App\Models\SchoolYear;
use App\Enum\AcademicCalendarEventEnum;
use Carbon\Carbon;

class AcademicCalendarSeeder extends Seeder
{
    public function run(): void
    {
        $schoolYears = SchoolYear::all();

        foreach ($schoolYears as $schoolYear) {
            $this->createAcademicCalendarForSchoolYear($schoolYear);
        }
    }

    private function createAcademicCalendarForSchoolYear(SchoolYear $schoolYear): void
    {
        // For active school years, create dynamic calendar with upcoming enrollment
        if ($schoolYear->is_active) {
            $baseDate = $this->getDynamicBaseDate($schoolYear);
        } else {
            // Use the school year's start date as the base date for calendar events
            $baseDate = Carbon::parse($schoolYear->start_date);
        }
        $events = [];

        // Create dynamic enrollment periods for active school years
        if (false) {
            $enrollmentEvents = $this->createDynamicEnrollmentPeriods($schoolYear, $baseDate);
            $events = array_merge($events, $enrollmentEvents);
        } else {
            $based = $schoolYear->start_date;
            $beginDate = Carbon::parse($based);
            $endDate = Carbon::parse($based)->addDays(365);
            $index = 0;
            // For inactive school years, use the original static enrollment periods
            // REQUIRED: ENROLLMENT per school year (First Semester)
            $events[] = [
                'name' => 'Enrollment Period - First Semester',
                'description' => 'Regular and late enrollment for first semester',
                'start_date' => max($baseDate->copy()->subDays(14), $beginDate),
                'end_date' => min($baseDate->copy()->subDays(1), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::ENROLLMENT,
                'order' => $index++,
            ];

            // Start of First Semester
            // REQUIRED: ACADEMIC_TRANSITION per school year (First to Second Semester)
            $events[] = [
                'name' => 'Start of First Semester',
                'description' => 'First Semester officially begins',
                'start_date' => max($baseDate->copy(), $beginDate),
                'end_date' => min($baseDate->copy(), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::ACADEMIC_TRANSITION,
                'order' => $index++,
            ];

            // Start of Classes - First Semester
            // REQUIRED: START_OF_CLASSES per school year
            $events[] = [
                'name' => 'Start of Classes - First Semester',
                'description' => 'Classes begin for first semester',
                'start_date' => max($baseDate->copy(), $beginDate),
                'end_date' => min($baseDate->copy(), $endDate),

                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::START_OF_CLASSES,
                'order' => $index++,
            ];

            // REQUIRED: ADDING_DROPPING_OF_SUBJECTS per school year (First Semester)
            // Must be after START_OF_CLASSES
            $events[] = [
                'name' => 'Adding / Dropping of Subjects - First Semester',
                'description' => 'Adding/Dropping period - requires adviser approval',
                'start_date' => max($baseDate->copy(), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(13), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::ADDING_DROPPING_OF_SUBJECTS,
                'order' => $index++,
            ];

            // Preliminary Examinations - First Semester
            // REQUIRED: PERIODIC_EXAM per school year (e.g., Midterm, Final Exam)
            $events[] = [
                'name' => 'Preliminary Examinations - First Semester',
                'description' => 'Preliminary examinations for first semester',
                'start_date' => max($baseDate->copy()->addDays(28), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(34), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::PERIODIC_EXAM,
                'order' => $index++,
            ];

            // REQUIRED: GRADE_SUBMISSION per school year (After Preliminary Exam - First Semester)
            // Must be after PERIODIC_EXAM
            $events[] = [
                'name' => 'Grade Submission Deadline - Preliminary (First Semester)',
                'description' => 'Deadline for faculty to submit preliminary grades to registrar',
                'start_date' => max($baseDate->copy()->addDays(35), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(35), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::GRADE_SUBMISSION,
                'order' => $index++,
            ];

            // Midterm Examinations - First Semester
            // REQUIRED: PERIODIC_EXAM per school year
            $events[] = [
                'name' => 'Midterm Examinations - First Semester',
                'description' => 'Midterm examinations for first semester',
                'start_date' => max($baseDate->copy()->addDays(56), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(62), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::PERIODIC_EXAM,
                'order' => $index++,
            ];

            // REQUIRED: GRADE_SUBMISSION per school year (After Midterm Exam - First Semester)
            // Must be after PERIODIC_EXAM
            $events[] = [
                'name' => 'Grade Submission Deadline - Midterm (First Semester)',
                'description' => 'Deadline for faculty to submit midterm grades to registrar',
                'start_date' => max($baseDate->copy()->addDays(63), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(63), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::GRADE_SUBMISSION,
                'order' => $index++,
            ];

            // All Saints' / All Souls' Day Break
            $events[] = [
                'name' => 'All Saints\' / All Souls\' Day Break',
                'description' => 'All Saints\' and All Souls\' Day holiday (no classes)',
                'start_date' => max($baseDate->copy()->addDays(84), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(90), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::HOLIDAY,
                'order' => $index++,
            ];

            // Final Examinations - First Semester
            // REQUIRED: PERIODIC_EXAM per school year
            $events[] = [
                'name' => 'Final Examinations - First Semester',
                'description' => 'Final examinations for first semester',
                'start_date' => max($baseDate->copy()->addDays(100), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(106), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::PERIODIC_EXAM,
                'order' => $index++,
            ];

            // REQUIRED: FACULTY_EVALUATION per school year (First Semester)
            // Must be after PERIODIC_EXAM and before END_OF_CLASSES
            $events[] = [
                'name' => 'Faculty Evaluation - First Semester',
                'description' => 'Student evaluation of faculty for first semester',
                'start_date' => max($baseDate->copy()->addDays(107), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(113), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::FACULTY_EVALUATION,
                'order' => $index++,
            ];

            // REQUIRED: END_OF_CLASSES per school year (First Semester)
            $events[] = [
                'name' => 'End of Classes - First Semester',
                'description' => 'Last day of classes for first semester',
                'start_date' => max($baseDate->copy()->addDays(139), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(139), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::END_OF_CLASSES,
                'order' => $index++,
            ];

            // Christmas Break
            $events[] = [
                'name' => 'Christmas Break',
                'description' => 'Christmas and New Year holiday break',
                'start_date' => max($baseDate->copy()->addDays(140), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(154), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::HOLIDAY,
                'order' => $index++,
            ];

            // REQUIRED: GRADE_SUBMISSION per school year (After Final Exam - First Semester)
            // Must be after PERIODIC_EXAM
            $events[] = [
                'name' => 'Grade Submission Deadline - First Semester',
                'description' => 'Deadline for faculty to submit first semester grades to registrar',
                'start_date' => max($baseDate->copy()->addDays(155), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(155), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::GRADE_SUBMISSION,
                'order' => $index++,
            ];

            // SECOND SEMESTER

            // REQUIRED: ENROLLMENT per school year (Second Semester)
            $events[] = [
                'name' => 'Enrollment Period - Second Semester',
                'description' => 'Regular and late enrollment for second semester',
                'start_date' => max($baseDate->copy()->addDays(156), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(168), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::ENROLLMENT,
                'order' => $index++,
            ];

            // Start of Second Semester
            // REQUIRED: ACADEMIC_TRANSITION per school year
            $events[] = [
                'name' => 'Start of Second Semester',
                'description' => 'Second Semester officially begins',
                'start_date' => max($baseDate->copy()->addDays(169), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(169), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::ACADEMIC_TRANSITION,
                'order' => $index++,
            ];

            // Start of Classes - Second Semester
            // REQUIRED: START_OF_CLASSES per school year
            $events[] = [
                'name' => 'Start of Classes - Second Semester',
                'description' => 'Classes begin for second semester',
                'start_date' => max($baseDate->copy()->addDays(169), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(169), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::START_OF_CLASSES,
                'order' => $index++,
            ];

            // REQUIRED: ADDING_DROPPING_OF_SUBJECTS per school year (Second Semester)
            // Must be after START_OF_CLASSES
            $events[] = [
                'name' => 'Adding / Dropping of Subjects - Second Semester',
                'description' => 'Adding/Dropping period - requires adviser approval',
                'start_date' => max($baseDate->copy()->addDays(169), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(182), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::ADDING_DROPPING_OF_SUBJECTS,
                'order' => $index++,
            ];

            // Preliminary Examinations - Second Semester
            // REQUIRED: PERIODIC_EXAM per school year
            $events[] = [
                'name' => 'Preliminary Examinations - Second Semester',
                'description' => 'Preliminary examinations for second semester',
                'start_date' => max($baseDate->copy()->addDays(197), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(203), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::PERIODIC_EXAM,
                'order' => $index++,
            ];

            // REQUIRED: GRADE_SUBMISSION per school year (After Preliminary Exam - Second Semester)
            // Must be after PERIODIC_EXAM
            $events[] = [
                'name' => 'Grade Submission Deadline - Preliminary (Second Semester)',
                'description' => 'Deadline for faculty to submit preliminary grades to registrar',
                'start_date' => max($baseDate->copy()->addDays(204), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(204), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::GRADE_SUBMISSION,
                'order' => $index++,
            ];

            // Holy Week Break
            $events[] = [
                'name' => 'Holy Week Break',
                'description' => 'Holy Week holiday (no classes)',
                'start_date' => max($baseDate->copy()->addDays(225), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(231), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::HOLIDAY,
                'order' => $index++,
            ];

            // Midterm Examinations - Second Semester
            // REQUIRED: PERIODIC_EXAM per school year
            $events[] = [
                'name' => 'Midterm Examinations - Second Semester',
                'description' => 'Midterm examinations for second semester',
                'start_date' => max($baseDate->copy()->addDays(253), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(259), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::PERIODIC_EXAM,
                'order' => $index++,
            ];

            // REQUIRED: GRADE_SUBMISSION per school year (After Midterm Exam - Second Semester)
            // Must be after PERIODIC_EXAM
            $events[] = [
                'name' => 'Grade Submission Deadline - Midterm (Second Semester)',
                'description' => 'Deadline for faculty to submit midterm grades to registrar',
                'start_date' => max($baseDate->copy()->addDays(260), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(260), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::GRADE_SUBMISSION,
                'order' => $index++,
            ];

            // Final Examinations - Second Semester
            // REQUIRED: PERIODIC_EXAM per school year
            $events[] = [
                'name' => 'Final Examinations - Second Semester',
                'description' => 'Final examinations for second semester',
                'start_date' => max($baseDate->copy()->addDays(281), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(287), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::PERIODIC_EXAM,
                'order' => $index++,
            ];

            // REQUIRED: FACULTY_EVALUATION per school year (Second Semester)
            // Must be after PERIODIC_EXAM and before END_OF_CLASSES
            $events[] = [
                'name' => 'Faculty Evaluation - Second Semester',
                'description' => 'Student evaluation of faculty for second semester',
                'start_date' => max($baseDate->copy()->addDays(288), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(294), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::FACULTY_EVALUATION,
                'order' => $index++,
            ];

            // REQUIRED: END_OF_CLASSES per school year (Second Semester)
            $events[] = [
                'name' => 'End of Classes - Second Semester',
                'description' => 'Last day of classes for second semester',
                'start_date' => max($baseDate->copy()->addDays(295), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(295), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::END_OF_CLASSES,
                'order' => $index++,
            ];

            // REQUIRED: GRADE_SUBMISSION per school year (After Final Exam - Second Semester)
            // Must be after PERIODIC_EXAM and before GRADUATION
            $events[] = [
                'name' => 'Grade Submission Deadline - Second Semester',
                'description' => 'Deadline for faculty to submit second semester grades to registrar',
                'start_date' => max($baseDate->copy()->addDays(296), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(296), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::GRADE_SUBMISSION,
                'order' => $index++,
            ];

            // REQUIRED: GRADUATION per school year
            $events[] = [
                'name' => 'Graduation Ceremony',
                'description' => 'Annual graduation ceremony - End of AY',
                'start_date' => max($baseDate->copy()->addDays(297), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(297), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::GRADUATION,
                'order' => $index++,
            ];

            // SUMMER TERM (Optional)

            // REQUIRED: ENROLLMENT per school year (Summer Term)
            $events[] = [
                'name' => 'Enrollment - Summer Term',
                'description' => 'Enrollment for optional summer term',
                'start_date' => max($baseDate->copy()->addDays(298), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(310), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::ENROLLMENT,
                'order' => $index++,
            ];

            // Start of Summer Term
            // REQUIRED: ACADEMIC_TRANSITION per school year
            $events[] = [
                'name' => 'Start of Summer Term',
                'description' => 'Summer Term officially begins',
                'start_date' => max($baseDate->copy()->addDays(311), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(311), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::ACADEMIC_TRANSITION,
                'order' => $index++,
            ];

            // Summer Classes
            // REQUIRED: START_OF_CLASSES per school year
            $events[] = [
                'name' => 'Summer Classes',
                'description' => 'Intensive summer courses',
                'start_date' => max($baseDate->copy()->addDays(311), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(338), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::START_OF_CLASSES,
                'order' => $index++,
            ];

            // REQUIRED: ADDING_DROPPING_OF_SUBJECTS per school year (Summer Term)
            // Must be after START_OF_CLASSES and before ACADEMIC_TRANSITION
            $events[] = [
                'name' => 'Adding / Dropping of Subjects - Summer Term',
                'description' => 'Adding/Dropping period for summer - requires adviser approval',
                'start_date' => max($baseDate->copy()->addDays(311), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(317), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::ADDING_DROPPING_OF_SUBJECTS,
                'order' => $index++,
            ];

            // REQUIRED: END_OF_CLASSES per school year (Summer Term)
            $events[] = [
                'name' => 'End of Classes - Summer Term',
                'description' => 'Last day of classes for summer term',
                'start_date' => max($baseDate->copy()->addDays(338), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(338), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::END_OF_CLASSES,
                'order' => $index++,
            ];

            // Final Exams - Summer Term
            // REQUIRED: PERIODIC_EXAM per school year
            $events[] = [
                'name' => 'Final Examinations - Summer Term',
                'description' => 'Final examinations for summer term',
                'start_date' => max($baseDate->copy()->addDays(339), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(345), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::PERIODIC_EXAM,
                'order' => $index++,
            ];

            // REQUIRED: FACULTY_EVALUATION per school year (Summer Term)
            // Must be after PERIODIC_EXAM and before GRADE_SUBMISSION
            $events[] = [
                'name' => 'Faculty Evaluation - Summer Term',
                'description' => 'Student evaluation of faculty for summer term',
                'start_date' => max($baseDate->copy()->addDays(339), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(345), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::FACULTY_EVALUATION,
                'order' => $index++,
            ];

            // REQUIRED: GRADE_SUBMISSION per school year (After Final Exam - Summer Term)
            // Must be after PERIODIC_EXAM
            $events[] = [
                'name' => 'Grade Submission Deadline - Summer Term',
                'description' => 'Deadline for faculty to submit summer term grades to registrar',
                'start_date' => max($baseDate->copy()->addDays(346), $beginDate),
                'end_date' => min($baseDate->copy()->addDays(346), $endDate),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::GRADE_SUBMISSION,
                'order' => $index++,
            ];
        }

        // Create all events for this school year
        AcademicCalendar::insert($events);
    }

    /**
     * Get dynamic base date for active school years
     * Ensures there's always an upcoming enrollment period
     */
    private function getDynamicBaseDate(SchoolYear $schoolYear): Carbon
    {
        $today = Carbon::now();
        $schoolYearStart = Carbon::parse($schoolYear->start_date);
        $schoolYearEnd = Carbon::parse($schoolYear->end_date);

        // If we're in the middle of the school year, create a current enrollment period
        if ($today->between($schoolYearStart, $schoolYearEnd)) {
            // Create enrollment period that includes today and extends 30 days
            return $today->copy()->subDays(rand(1, 7)); // Start 1-7 days ago
        }

        // If we're before the school year starts, create upcoming enrollment
        if ($today->lt($schoolYearStart)) {
            // Create enrollment period starting 1-2 weeks before school year starts
            return $schoolYearStart->copy()->subDays(rand(7, 14));
        }

        // If we're after the school year ends, create a new enrollment for next semester
        if ($today->gt($schoolYearEnd)) {
            // Create a new enrollment period starting soon
            return $today->copy()->subDays(rand(1, 3));
        }

        // Fallback: create enrollment period around today
        return $today->copy()->subDays(rand(1, 7));
    }

    /**
     * Create dynamic enrollment periods that are always available
     * REQUIRED: ENROLLMENT per school year for each semester/term
     */
    private function createDynamicEnrollmentPeriods(SchoolYear $schoolYear, Carbon $baseDate): array
    {
        $events = [];
        $today = Carbon::now();

        // Ensure we always have at least one active enrollment period
        $this->ensureActiveEnrollmentPeriod($schoolYear, $baseDate, $events);

        // REQUIRED: ENROLLMENT for First Semester
        $firstSemesterStart = $baseDate->copy();
        $firstSemesterEnd = $firstSemesterStart->copy()->addDays(30);

        $events[] = [
            'name' => 'Enrollment Period - First Semester',
            'description' => 'Regular and late enrollment for first semester',
            'start_date' => $firstSemesterStart,
            'end_date' => $firstSemesterEnd,
            'school_year_id' => $schoolYear->id,
            'event' => AcademicCalendarEventEnum::ENROLLMENT,
        ];

        // REQUIRED: ENROLLMENT for Second Semester
        $secondSemesterStart = $firstSemesterStart->copy()->addMonths(6);
        $secondSemesterEnd = $secondSemesterStart->copy()->addDays(30);

        $events[] = [
            'name' => 'Enrollment Period - Second Semester',
            'description' => 'Regular and late enrollment for second semester',
            'start_date' => $secondSemesterStart,
            'end_date' => $secondSemesterEnd,
            'school_year_id' => $schoolYear->id,
            'event' => AcademicCalendarEventEnum::ENROLLMENT,
        ];

        // REQUIRED: ENROLLMENT for Summer Term
        $summerStart = $firstSemesterStart->copy()->addYear();
        $summerEnd = $summerStart->copy()->addDays(30);

        $events[] = [
            'name' => 'Enrollment - Summer Term',
            'description' => 'Enrollment for optional summer term',
            'start_date' => $summerStart,
            'end_date' => $summerEnd,
            'school_year_id' => $schoolYear->id,
            'event' => AcademicCalendarEventEnum::ENROLLMENT,
        ];

        return $events;
    }

    /**
     * Ensure there's always an active enrollment period
     */
    private function ensureActiveEnrollmentPeriod(SchoolYear $schoolYear, Carbon $baseDate, array &$events): void
    {
        $today = Carbon::now();

        // Check if we need to create an immediate enrollment period
        $hasActiveEnrollment = false;

        // If today is not within any enrollment period, create one that starts today
        if (!$this->hasActiveEnrollmentPeriod($schoolYear, $today)) {
            $events[] = [
                'name' => 'Immediate Enrollment Period',
                'description' => 'Open enrollment period for immediate registration',
                'start_date' => $today->copy(),
                'end_date' => $today->copy()->addDays(30),
                'school_year_id' => $schoolYear->id,
                'event' => AcademicCalendarEventEnum::ENROLLMENT,
            ];
        }
    }

    /**
     * Check if school year has an active enrollment period for today
     */
    private function hasActiveEnrollmentPeriod(SchoolYear $schoolYear, Carbon $date): bool
    {
        return $schoolYear->academicCalendars()
            ->where('event', AcademicCalendarEventEnum::ENROLLMENT->value)
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->exists();
    }
}
