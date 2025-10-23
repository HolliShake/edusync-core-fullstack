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
        $baseDate = Carbon::now();
        $events = [];

        // FIRST SEMESTER

        // Enrollment Period - First Semester
        $events[] = [
            'name' => 'Enrollment Period - First Semester',
            'description' => 'Regular and late enrollment for first semester',
            'start_date' => $baseDate->copy(),
            'end_date' => $baseDate->copy()->addDays(27),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ENROLLMENT,
        ];

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
            'end_date' => $baseDate->copy()->addDays(27),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::DEADLINE,
        ];

        // SECOND SEMESTER

        // Enrollment Period - Second Semester
        $events[] = [
            'name' => 'Enrollment Period - Second Semester',
            'description' => 'Regular and late enrollment for second semester',
            'start_date' => $baseDate->copy()->addDays(169),
            'end_date' => $baseDate->copy()->addDays(196),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ENROLLMENT,
        ];

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
            'end_date' => $baseDate->copy()->addDays(196),
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

        // Enrollment - Summer Term
        $events[] = [
            'name' => 'Enrollment - Summer Term',
            'description' => 'Enrollment for optional summer term',
            'start_date' => $baseDate->copy()->addDays(311),
            'end_date' => $baseDate->copy()->addDays(338),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ENROLLMENT,
        ];

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
}
