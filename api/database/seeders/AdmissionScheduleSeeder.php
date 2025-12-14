<?php

namespace Database\Seeders;

use App\Models\AdmissionSchedule;
use App\Models\UniversityAdmission;
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
        $universityAdmissions = UniversityAdmission::all();
        $academicPrograms = AcademicProgram::all();

        if ($universityAdmissions->isEmpty() || $academicPrograms->isEmpty()) {
            $this->command->warn('Required data not found. Make sure UniversityAdmissionSeeder and AcademicProgramSeeder have been run.');
            return;
        }

        $this->command->info('Creating admission schedules...');

        $scheduleCount = 0;

        // Create admission schedules for each university admission and academic program
        foreach ($universityAdmissions as $universityAdmission) {
            $admissionStart = Carbon::parse($universityAdmission->start_date);
            $admissionEnd = Carbon::parse($universityAdmission->end_date);

            foreach ($academicPrograms as $academicProgram) {
                // Check if schedule already exists
                $existingSchedule = AdmissionSchedule::where('university_admission_id', $universityAdmission->id)
                    ->where('academic_program_id', $academicProgram->id)
                    ->first();

                if (!$existingSchedule) {
                    AdmissionSchedule::create([
                        'university_admission_id' => $universityAdmission->id,
                        'academic_program_id' => $academicProgram->id,
                        'intake_limit' => rand(50, 150),
                        'start_date' => $admissionStart,
                        'end_date' => $admissionEnd,
                    ]);

                    $scheduleCount++;
                }
            }
        }

        $this->command->info("Created {$scheduleCount} admission schedules successfully!");
    }
}
