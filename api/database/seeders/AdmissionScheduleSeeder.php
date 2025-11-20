<?php

namespace Database\Seeders;

use App\Models\AdmissionSchedule;
use App\Models\SchoolYear;
use App\Models\AcademicProgram;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AdmissionScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schoolYears = SchoolYear::all();
        $academicPrograms = AcademicProgram::all();

        // Define admission periods relative to school year start dates
        // Typically admission opens 2-4 months before the school year starts
        foreach ($schoolYears as $schoolYear) {
            $schoolYearStart = Carbon::parse($schoolYear->start_date);

            // Create admission schedules for each academic program for this school year
            foreach ($academicPrograms as $academicProgram) {
                // First admission window (Early Admission) - 4 months before to 2 months before
                AdmissionSchedule::create([
                    'school_year_id' => $schoolYear->id,
                    'academic_program_id' => $academicProgram->id,
                    'intake_limit' => 100,
                    'start_date' => $schoolYearStart->copy()->subMonths(4),
                    'end_date' => $schoolYearStart->copy()->subMonths(2),
                ]);

                // Second admission window (Regular Admission) - 2 months before to 2 weeks before
                AdmissionSchedule::create([
                    'school_year_id' => $schoolYear->id,
                    'academic_program_id' => $academicProgram->id,
                    'intake_limit' => 100,
                    'start_date' => $schoolYearStart->copy()->subMonths(2),
                    'end_date' => $schoolYearStart->copy()->subWeeks(2),
                ]);

                // Third admission window (Late Admission) - 2 weeks before to 1 week after start
                AdmissionSchedule::create([
                    'school_year_id' => $schoolYear->id,
                    'academic_program_id' => $academicProgram->id,
                    'intake_limit' => 100,
                    'start_date' => $schoolYearStart->copy()->subWeeks(2),
                    'end_date' => $schoolYearStart->copy()->addWeek(),
                ]);
            }
        }
    }
}
