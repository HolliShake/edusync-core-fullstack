<?php

namespace Database\Seeders;

use App\Models\AdmissionSchedule;
use App\Models\SchoolYear;
use App\Models\Campus;
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
        $campuses = Campus::all();

        // Define admission periods relative to school year start dates
        // Typically admission opens 2-4 months before the school year starts
        foreach ($schoolYears as $schoolYear) {
            $schoolYearStart = Carbon::parse($schoolYear->start_date);

            // Create admission schedules for each campus for this school year
            foreach ($campuses as $campus) {
                // First admission window (Early Admission) - 4 months before to 2 months before
                AdmissionSchedule::create([
                    'school_year_id' => $schoolYear->id,
                    'campus_id' => $campus->id,
                    'start_date' => $schoolYearStart->copy()->subMonths(4),
                    'end_date' => $schoolYearStart->copy()->subMonths(2),
                ]);

                // Second admission window (Regular Admission) - 2 months before to 2 weeks before
                AdmissionSchedule::create([
                    'school_year_id' => $schoolYear->id,
                    'campus_id' => $campus->id,
                    'start_date' => $schoolYearStart->copy()->subMonths(2),
                    'end_date' => $schoolYearStart->copy()->subWeeks(2),
                ]);

                // Third admission window (Late Admission) - 2 weeks before to 1 week after start
                AdmissionSchedule::create([
                    'school_year_id' => $schoolYear->id,
                    'campus_id' => $campus->id,
                    'start_date' => $schoolYearStart->copy()->subWeeks(2),
                    'end_date' => $schoolYearStart->copy()->addWeek(),
                ]);
            }
        }
    }
}

