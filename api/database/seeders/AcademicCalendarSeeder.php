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
        $startYear = $schoolYear->start_date->year;
        $endYear = $schoolYear->end_date->year;
        
        $events = [];

        // Registration Period
        $events[] = [
            'name' => 'Registration Period',
            'description' => 'Student registration for the academic year',
            'start_date' => Carbon::create($startYear, 5, 15),
            'end_date' => Carbon::create($startYear, 5, 31),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::REGISTRATION,
        ];

        // Enrollment Period
        $events[] = [
            'name' => 'Enrollment Period',
            'description' => 'Course enrollment and schedule selection',
            'start_date' => Carbon::create($startYear, 5, 20),
            'end_date' => Carbon::create($startYear, 6, 5),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ENROLLMENT,
        ];

        // Orientation
        $events[] = [
            'name' => 'New Student Orientation',
            'description' => 'Orientation program for new students',
            'start_date' => Carbon::create($startYear, 5, 25),
            'end_date' => Carbon::create($startYear, 5, 27),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ORIENTATION,
        ];

        // Start of Classes - First Semester
        $events[] = [
            'name' => 'Start of Classes - First Semester',
            'description' => 'Beginning of first semester classes',
            'start_date' => Carbon::create($startYear, 6, 10),
            'end_date' => Carbon::create($startYear, 6, 10),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::START_OF_CLASSES,
        ];

        // Independence Day Holiday
        $events[] = [
            'name' => 'Independence Day',
            'description' => 'National Independence Day holiday',
            'start_date' => Carbon::create($startYear, 6, 12),
            'end_date' => Carbon::create($startYear, 6, 12),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Midterm Exams - First Semester
        $events[] = [
            'name' => 'Midterm Examinations - First Semester',
            'description' => 'Midterm examinations for first semester',
            'start_date' => Carbon::create($startYear, 8, 5),
            'end_date' => Carbon::create($startYear, 8, 9),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // National Heroes Day
        $events[] = [
            'name' => 'National Heroes Day',
            'description' => 'National Heroes Day holiday',
            'start_date' => Carbon::create($startYear, 8, 26),
            'end_date' => Carbon::create($startYear, 8, 26),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Final Exams - First Semester
        $events[] = [
            'name' => 'Final Examinations - First Semester',
            'description' => 'Final examinations for first semester',
            'start_date' => Carbon::create($startYear, 10, 7),
            'end_date' => Carbon::create($startYear, 10, 11),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // End of First Semester
        $events[] = [
            'name' => 'End of First Semester',
            'description' => 'End of first semester classes',
            'start_date' => Carbon::create($startYear, 10, 12),
            'end_date' => Carbon::create($startYear, 10, 12),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::END_OF_CLASSES,
        ];

        // Grade Submission Deadline - First Semester
        $events[] = [
            'name' => 'Grade Submission Deadline - First Semester',
            'description' => 'Deadline for faculty to submit first semester grades',
            'start_date' => Carbon::create($startYear, 10, 18),
            'end_date' => Carbon::create($startYear, 10, 18),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::GRADE_SUBMISSION,
        ];

        // All Saints Day
        $events[] = [
            'name' => 'All Saints Day',
            'description' => 'All Saints Day holiday',
            'start_date' => Carbon::create($startYear, 11, 1),
            'end_date' => Carbon::create($startYear, 11, 1),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Bonifacio Day
        $events[] = [
            'name' => 'Bonifacio Day',
            'description' => 'Bonifacio Day holiday',
            'start_date' => Carbon::create($startYear, 11, 30),
            'end_date' => Carbon::create($startYear, 11, 30),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Christmas Break
        $events[] = [
            'name' => 'Christmas Break',
            'description' => 'Christmas and New Year holiday break',
            'start_date' => Carbon::create($startYear, 12, 20),
            'end_date' => Carbon::create($startYear + 1, 1, 5),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Start of Second Semester
        $events[] = [
            'name' => 'Start of Classes - Second Semester',
            'description' => 'Beginning of second semester classes',
            'start_date' => Carbon::create($startYear + 1, 1, 8),
            'end_date' => Carbon::create($startYear + 1, 1, 8),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::START_OF_CLASSES,
        ];

        // EDSA Revolution Anniversary
        $events[] = [
            'name' => 'EDSA Revolution Anniversary',
            'description' => 'EDSA Revolution Anniversary holiday',
            'start_date' => Carbon::create($startYear + 1, 2, 25),
            'end_date' => Carbon::create($startYear + 1, 2, 25),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Midterm Exams - Second Semester
        $events[] = [
            'name' => 'Midterm Examinations - Second Semester',
            'description' => 'Midterm examinations for second semester',
            'start_date' => Carbon::create($startYear + 1, 3, 11),
            'end_date' => Carbon::create($startYear + 1, 3, 15),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // Holy Week
        $events[] = [
            'name' => 'Holy Week',
            'description' => 'Holy Week holiday break',
            'start_date' => Carbon::create($startYear + 1, 3, 25),
            'end_date' => Carbon::create($startYear + 1, 3, 31),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Araw ng Kagitingan
        $events[] = [
            'name' => 'Araw ng Kagitingan',
            'description' => 'Araw ng Kagitingan holiday',
            'start_date' => Carbon::create($startYear + 1, 4, 9),
            'end_date' => Carbon::create($startYear + 1, 4, 9),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Labor Day
        $events[] = [
            'name' => 'Labor Day',
            'description' => 'Labor Day holiday',
            'start_date' => Carbon::create($startYear + 1, 5, 1),
            'end_date' => Carbon::create($startYear + 1, 5, 1),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::HOLIDAY,
        ];

        // Final Exams - Second Semester
        $events[] = [
            'name' => 'Final Examinations - Second Semester',
            'description' => 'Final examinations for second semester',
            'start_date' => Carbon::create($startYear + 1, 5, 6),
            'end_date' => Carbon::create($startYear + 1, 5, 10),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::PERIODIC_EXAM,
        ];

        // End of Second Semester
        $events[] = [
            'name' => 'End of Second Semester',
            'description' => 'End of second semester classes',
            'start_date' => Carbon::create($startYear + 1, 5, 11),
            'end_date' => Carbon::create($startYear + 1, 5, 11),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::END_OF_CLASSES,
        ];

        // Grade Submission Deadline - Second Semester
        $events[] = [
            'name' => 'Grade Submission Deadline - Second Semester',
            'description' => 'Deadline for faculty to submit second semester grades',
            'start_date' => Carbon::create($startYear + 1, 5, 17),
            'end_date' => Carbon::create($startYear + 1, 5, 17),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::GRADE_SUBMISSION,
        ];

        // Faculty Evaluation Period
        $events[] = [
            'name' => 'Faculty Evaluation Period',
            'description' => 'Student evaluation of faculty performance',
            'start_date' => Carbon::create($startYear + 1, 5, 20),
            'end_date' => Carbon::create($startYear + 1, 5, 24),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::FACULTY_EVALUATION,
        ];

        // Graduation Ceremony
        $events[] = [
            'name' => 'Graduation Ceremony',
            'description' => 'Annual graduation ceremony for graduating students',
            'start_date' => Carbon::create($startYear + 1, 5, 25),
            'end_date' => Carbon::create($startYear + 1, 5, 25),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::GRADUATION,
        ];

        // Academic Transition Period
        $events[] = [
            'name' => 'Academic Transition Period',
            'description' => 'Transition period between academic years',
            'start_date' => Carbon::create($startYear + 1, 5, 26),
            'end_date' => Carbon::create($startYear + 1, 5, 31),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::ACADEMIC_TRANSITION,
        ];

        // University Foundation Day
        $events[] = [
            'name' => 'University Foundation Day',
            'description' => 'Annual celebration of university foundation',
            'start_date' => Carbon::create($startYear, 9, 15),
            'end_date' => Carbon::create($startYear, 9, 15),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::UNIVERSITY_EVENT,
        ];

        // Research Week
        $events[] = [
            'name' => 'Research Week',
            'description' => 'Annual research presentation and exhibition week',
            'start_date' => Carbon::create($startYear + 1, 2, 12),
            'end_date' => Carbon::create($startYear + 1, 2, 16),
            'school_year_id' => $schoolYear->id,
            'event' => CalendarEventEnum::UNIVERSITY_EVENT,
        ];

        // Create all events for this school year
        foreach ($events as $event) {
            AcademicCalendar::create($event);
        }
    }
}
