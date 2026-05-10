<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdmissionApplication;
use App\Models\AdmissionApplicationLog;
use App\Models\User;
use App\Models\AdmissionSchedule;
use App\Enum\AdmissionApplicationLogTypeEnum;
use App\Enum\UserRoleEnum;

class AdmissionApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get required data - find admission schedules
        $admissionSchedules = AdmissionSchedule::all();
        $students = User::where('role', UserRoleEnum::STUDENT)->get();

        if ($admissionSchedules->isEmpty() || $students->isEmpty()) {
            $this->command->warn('Required data not found. Make sure AdmissionScheduleSeeder and UserSeeder have been run.');
            return;
        }

        $this->command->info('Creating admission applications for ' . $students->count() . ' students...');

        $applicationCount = 0;
        
        // Find BSCS program to prioritize it
        $bscsProgram = \App\Models\AcademicProgram::where('short_name', 'BSCS')->first();
        $bscsSchedules = $bscsProgram ? $admissionSchedules->where('academic_program_id', $bscsProgram->id) : collect();

        foreach ($students as $index => $student) {
            // Get a admission schedule - prioritize BSCS for first 70% of students
            if ($bscsSchedules->isNotEmpty() && $index < ($students->count() * 0.7)) {
                $admissionSchedule = $bscsSchedules->random();
            } else {
                $admissionSchedule = $admissionSchedules->random();
            }

            // Check if student already has an application for this admission schedule
            $existingApplication = AdmissionApplication::where('user_id', $student->id)
                ->where('admission_schedule_id', $admissionSchedule->id)
                ->first();

            if (!$existingApplication) {
                // Create admission application
                $application = AdmissionApplication::create([
                    'user_id' => $student->id,
                    'admission_schedule_id' => $admissionSchedule->id,
                ]);

                // Note: The "submitted" log is automatically created by the database trigger
                // We only need to create the approved log by program chair
                AdmissionApplicationLog::create([
                    'admission_application_id' => $application->id,
                    'user_id' => 1, // Program chair user_id
                    'type' => AdmissionApplicationLogTypeEnum::APPROVED->value,
                    'note' => 'Application approved by Program Chair',
                ]);

                $applicationCount++;
            }
        }

        $this->command->info("Created {$applicationCount} admission applications successfully!");
    }
}
