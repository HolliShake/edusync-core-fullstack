<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicCalendar;
use App\Models\SchoolYear;
use App\Enum\CalendarEventEnum;
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
        if ($schoolYear->is_active) {
            $enrollmentEvents = $this->createDynamicEnrollmentPeriods($schoolYear, $baseDate);
            $events = array_merge($events, $enrollmentEvents);
        } else {
            // For inactive school years, use the original static enrollment periods
            $events[] = [
                'name' => 'Enrollment Period - First Semester',
                'description' => 'Regular and late enrollment for first semester',
                'start_date' => $baseDate->copy(),
                'end_date' => $baseDate->copy()->addDays(30),
                'school_year_id' => $schoolYear->id,
                'event' => CalendarEventEnum::ENROLLMENT,
            ];
        }

        // Start of First Semester
        $events[] = [
            'name' => 'Start of First Semester',
            'description' => 'First Semester officially begins',
            'start_date' => $baseDate->copy(),
            'end_date' => $baseDate->copy(),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ACADEMIC_TRANSITION,
        ];

        // Start of Classes - First Semester
        $events[] = [
            'name' => 'Start of Classes - First Semester',
            'description' => 'Classes begin for first semester',
            'start_date' => $baseDate->copy(),
            'end_date' => $baseDate->copy(),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::START_OF_CLASSES,
        ];

        // Preliminary Examinations - First Semester
        $events[] = [
            'name' => 'Preliminary Examinations - First Semester',
            'description' => 'Preliminary examinations for first semester',
            'start_date' => $baseDate->copy()->addDays(28),
            'end_date' => $baseDate->copy()->addDays(55),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // Midterm Examinations - First Semester
        $events[] = [
            'name' => 'Midterm Examinations - First Semester',
            'description' => 'Midterm examinations for first semester',
            'start_date' => $baseDate->copy()->addDays(56),
            'end_date' => $baseDate->copy()->addDays(83),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // All Saints' / All Souls' Day Break
        $events[] = [
            'name' => 'All Saints\' / All Souls\' Day Break',
            'description' => 'All Saints\' and All Souls\' Day holiday (no classes)',
            'start_date' => $baseDate->copy()->addDays(84),
            'end_date' => $baseDate->copy()->addDays(111),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Final Examinations - First Semester
        $events[] = [
            'name' => 'Final Examinations - First Semester',
            'description' => 'Final examinations for first semester',
            'start_date' => $baseDate->copy()->addDays(112),
            'end_date' => $baseDate->copy()->addDays(139),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // Christmas Break
        $events[] = [
            'name' => 'Christmas Break',
            'description' => 'Christmas and New Year holiday break',
            'start_date' => $baseDate->copy()->addDays(140),
            'end_date' => $baseDate->copy()->addDays(167),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Grade Submission Deadline - First Semester
        $events[] = [
            'name' => 'Grade Submission Deadline - First Semester',
            'description' => 'Deadline for faculty to submit first semester grades to registrar',
            'start_date' => $baseDate->copy()->addDays(168),
            'end_date' => $baseDate->copy()->addDays(168),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::GRADE_SUBMISSION,
        ];

        // Adding / Dropping of Subjects - First Semester
        $events[] = [
            'name' => 'Adding / Dropping of Subjects - First Semester',
            'description' => 'Adding/Dropping period - requires adviser approval',
            'start_date' => $baseDate->copy(),
            'end_date' => $baseDate->copy()->addDays(30), // Extended to 30 days
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::DEADLINE,
        ];

        // SECOND SEMESTER

        // Note: Enrollment periods are now handled dynamically for active school years

        // Start of Second Semester
        $events[] = [
            'name' => 'Start of Second Semester',
            'description' => 'Second Semester officially begins',
            'start_date' => $baseDate->copy()->addDays(169),
            'end_date' => $baseDate->copy()->addDays(169),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ACADEMIC_TRANSITION,
        ];

        // Start of Classes - Second Semester
        $events[] = [
            'name' => 'Start of Classes - Second Semester',
            'description' => 'Classes begin for second semester',
            'start_date' => $baseDate->copy()->addDays(169),
            'end_date' => $baseDate->copy()->addDays(169),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::START_OF_CLASSES,
        ];

        // Preliminary Examinations - Second Semester
        $events[] = [
            'name' => 'Preliminary Examinations - Second Semester',
            'description' => 'Preliminary examinations for second semester',
            'start_date' => $baseDate->copy()->addDays(197),
            'end_date' => $baseDate->copy()->addDays(224),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // Holy Week Break
        $events[] = [
            'name' => 'Holy Week Break',
            'description' => 'Holy Week holiday (no classes)',
            'start_date' => $baseDate->copy()->addDays(225),
            'end_date' => $baseDate->copy()->addDays(252),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Midterm Examinations - Second Semester
        $events[] = [
            'name' => 'Midterm Examinations - Second Semester',
            'description' => 'Midterm examinations for second semester',
            'start_date' => $baseDate->copy()->addDays(253),
            'end_date' => $baseDate->copy()->addDays(280),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // Final Examinations - Second Semester
        $events[] = [
            'name' => 'Final Examinations - Second Semester',
            'description' => 'Final examinations for second semester',
            'start_date' => $baseDate->copy()->addDays(281),
            'end_date' => $baseDate->copy()->addDays(308),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // Grade Submission Deadline - Second Semester
        $events[] = [
            'name' => 'Grade Submission Deadline - Second Semester',
            'description' => 'Deadline for faculty to submit second semester grades to registrar',
            'start_date' => $baseDate->copy()->addDays(309),
            'end_date' => $baseDate->copy()->addDays(309),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::GRADE_SUBMISSION,
        ];

        // Adding / Dropping of Subjects - Second Semester
        $events[] = [
            'name' => 'Adding / Dropping of Subjects - Second Semester',
            'description' => 'Adding/Dropping period - requires adviser approval',
            'start_date' => $baseDate->copy()->addDays(169),
            'end_date' => $baseDate->copy()->addDays(199), // Extended to 30 days
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::DEADLINE,
        ];

        // Graduation Ceremony
        $events[] = [
            'name' => 'Graduation Ceremony',
            'description' => 'Annual graduation ceremony - End of AY',
            'start_date' => $baseDate->copy()->addDays(310),
            'end_date' => $baseDate->copy()->addDays(310),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::GRADUATION,
        ];

        // SUMMER TERM (Optional)

        // Note: Summer enrollment periods are now handled dynamically for active school years

        // Start of Summer Term
        $events[] = [
            'name' => 'Start of Summer Term',
            'description' => 'Summer Term officially begins',
            'start_date' => $baseDate->copy()->addDays(311),
            'end_date' => $baseDate->copy()->addDays(311),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ACADEMIC_TRANSITION,
        ];

        // Summer Classes
        $events[] = [
            'name' => 'Summer Classes',
            'description' => 'Intensive summer courses',
            'start_date' => $baseDate->copy()->addDays(311),
            'end_date' => $baseDate->copy()->addDays(338),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::START_OF_CLASSES,
        ];

        // Final Exams - Summer Term
        $events[] = [
            'name' => 'Final Examinations - Summer Term',
            'description' => 'Final examinations for summer term',
            'start_date' => $baseDate->copy()->addDays(339),
            'end_date' => $baseDate->copy()->addDays(366),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // Create all events for this school year
        foreach ($events as $event) {
            AcademicCalendar::create($event);
        }
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
     */
    private function createDynamicEnrollmentPeriods(SchoolYear $schoolYear, Carbon $baseDate): array
    {
        $events = [];
        $today = Carbon::now();

        // Ensure we always have at least one active enrollment period
        $this->ensureActiveEnrollmentPeriod($schoolYear, $baseDate, $events);

        // First Semester Enrollment - Always includes today or starts soon
        $firstSemesterStart = $baseDate->copy();
        $firstSemesterEnd = $firstSemesterStart->copy()->addDays(30);

        $events[] = [
            'name' => 'Enrollment Period - First Semester',
            'description' => 'Regular and late enrollment for first semester',
            'start_date' => $firstSemesterStart,
            'end_date' => $firstSemesterEnd,
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ENROLLMENT,
        ];

        // Second Semester Enrollment - 6 months later
        $secondSemesterStart = $firstSemesterStart->copy()->addMonths(6);
        $secondSemesterEnd = $secondSemesterStart->copy()->addDays(30);

        $events[] = [
            'name' => 'Enrollment Period - Second Semester',
            'description' => 'Regular and late enrollment for second semester',
            'start_date' => $secondSemesterStart,
            'end_date' => $secondSemesterEnd,
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ENROLLMENT,
        ];

        // Summer Term Enrollment - 1 year later
        $summerStart = $firstSemesterStart->copy()->addYear();
        $summerEnd = $summerStart->copy()->addDays(30);

        $events[] = [
            'name' => 'Enrollment - Summer Term',
            'description' => 'Enrollment for optional summer term',
            'start_date' => $summerStart,
            'end_date' => $summerEnd,
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ENROLLMENT,
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
                'event' => CalendarEventEnum::ENROLLMENT,
            ];
        }
    }

    /**
     * Check if school year has an active enrollment period for today
     */
    private function hasActiveEnrollmentPeriod(SchoolYear $schoolYear, Carbon $date): bool
    {
        return $schoolYear->academicCalendars()
            ->where('event', CalendarEventEnum::ENROLLMENT->value)
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->exists();
    }
}
