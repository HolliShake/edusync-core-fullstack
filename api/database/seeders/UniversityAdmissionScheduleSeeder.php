<?php

namespace Database\Seeders;

use App\Models\TestingCenter;
use App\Models\UniversityAdmission;
use App\Models\UniversityAdmissionSchedule;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class UniversityAdmissionScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $universityAdmission = UniversityAdmission::latest()->first();
        $testingCenters = TestingCenter::all();

        if ($universityAdmission && $testingCenters->isNotEmpty()) {
            // Create schedules for next 2 weeks
            $startDate = Carbon::now()->addDay()->startOfDay(); // Start tomorrow

            foreach ($testingCenters as $center) {
                // Create morning session
                UniversityAdmissionSchedule::create([
                    'university_admission_id' => $universityAdmission->id,
                    'testing_center_id' => $center->id,
                    'start_date' => $startDate->copy()->setHour(8)->setMinute(0),
                    'end_date' => $startDate->copy()->setHour(12)->setMinute(0),
                ]);

                // Create afternoon session
                UniversityAdmissionSchedule::create([
                    'university_admission_id' => $universityAdmission->id,
                    'testing_center_id' => $center->id,
                    'start_date' => $startDate->copy()->setHour(13)->setMinute(0),
                    'end_date' => $startDate->copy()->setHour(17)->setMinute(0),
                ]);
            }
        }
    }
}

