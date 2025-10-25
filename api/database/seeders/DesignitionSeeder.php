<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Designition;
use App\Models\AcademicProgram;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Campus;
use App\Enum\AdmissionApplicationLogTypeEnum;
use App\Enum\EnrollmentLogActionEnum;

class DesignitionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get required data
        $programChair = User::find(1); // Program Chair user
        $academicPrograms = AcademicProgram::all();

        if (!$programChair || $academicPrograms->isEmpty()) {
            $this->command->warn('Required data not found. Make sure UserSeeder and AcademicProgramSeeder have been run.');
            return;
        }

        $this->command->info('Creating designitions for program chair...');

        $designitionCount = 0;

        // Find the academic program with the most valid admissions and enrollments
        $programWithMostActivity = $this->findProgramWithMostActivity();

        if ($programWithMostActivity) {
            // Check if designition already exists
            $existingDesignition = Designition::where('user_id', 1)
                ->where('designitionable_type', AcademicProgram::class)
                ->where('designitionable_id', $programWithMostActivity->id)
                ->where('is_active', true)
                ->first();

            if (!$existingDesignition) {
                Designition::create([
                    'user_id' => 1,
                    'designitionable_type' => AcademicProgram::class,
                    'designitionable_id' => $programWithMostActivity->id,
                    'is_active' => true,
                ]);

                $designitionCount++;
                $this->command->info("Assigned Program Chair to: {$programWithMostActivity->program_name} (ID: {$programWithMostActivity->id})");
            } else {
                $this->command->info("Program Chair already assigned to: {$programWithMostActivity->program_name}");
            }
        }

        // Create Campus Registrar designation (user_id = 2)
        $campusRegistrar = User::find(2);
        $campus = Campus::first();

        if ($campusRegistrar && $campus) {
            // Check if designition already exists
            $existingCampusDesignition = Designition::where('user_id', 2)
                ->where('designitionable_type', Campus::class)
                ->where('designitionable_id', $campus->id)
                ->where('is_active', true)
                ->first();

            if (!$existingCampusDesignition) {
                Designition::create([
                    'user_id' => 2,
                    'designitionable_type' => Campus::class,
                    'designitionable_id' => $campus->id,
                    'is_active' => true,
                ]);

                $designitionCount++;
                $this->command->info("Assigned Campus Registrar to: {$campus->campus_name} (ID: {$campus->id})");
            } else {
                $this->command->info("Campus Registrar already assigned to: {$campus->campus_name}");
            }
        } else {
            $this->command->warn('Campus Registrar user (ID: 2) or Campus not found. Skipping Campus Registrar designation.');
        }

        // Note: Due to unique constraint on ['user_id', 'designitionable_type', 'is_active'],
        // a user can only have ONE active designition per type (AcademicProgram, College, Campus, etc.)
        // So we only assign to the most active program

        $this->command->info("Created {$designitionCount} designitions successfully!");
    }

    /**
     * Find the academic program with the most valid admissions and enrollments
     */
    private function findProgramWithMostActivity(): ?AcademicProgram
    {
        // Get programs with their admission counts
        $programs = AcademicProgram::withCount([
            'admissionApplications' => function ($query) {
                $query->whereHas('logs', function ($logQuery) {
                    $logQuery->where('type', AdmissionApplicationLogTypeEnum::ACCEPTED->value);
                });
            }
        ])->get();

        if ($programs->isEmpty()) {
            // Fallback: get the first program if no activity data
            return AcademicProgram::first();
        }

        // Calculate total activity score for each program
        $programScores = $programs->map(function ($program) {
            $admissionCount = $program->admission_applications_count ?? 0;

            // Get enrollment count through the relationship chain:
            // AcademicProgram → Curriculum → CurriculumDetail → Section → Enrollment
            $enrollmentCount = $this->getEnrollmentCountForProgram($program);
            $totalScore = $admissionCount + $enrollmentCount;

            return [
                'program' => $program,
                'score' => $totalScore,
                'admissions' => $admissionCount,
                'enrollments' => $enrollmentCount
            ];
        });

        // Sort by total activity score (descending)
        $sortedPrograms = $programScores->sortByDesc('score');
        $topProgram = $sortedPrograms->first();

        if ($topProgram) {
            $this->command->info("Top program activity: {$topProgram['program']->program_name}");
            $this->command->info("- Valid Admissions: {$topProgram['admissions']}");
            $this->command->info("- Valid Enrollments: {$topProgram['enrollments']}");
            $this->command->info("- Total Score: {$topProgram['score']}");
        }

        return $topProgram['program'] ?? AcademicProgram::first();
    }

    /**
     * Get enrollment count for a program through the relationship chain
     */
    private function getEnrollmentCountForProgram(AcademicProgram $program): int
    {
        // Get enrollments through: AcademicProgram → Curriculum → CurriculumDetail → Section → Enrollment
        return Enrollment::whereHas('section.curriculumDetail.curriculum', function ($query) use ($program) {
            $query->where('academic_program_id', $program->id);
        })->whereHas('enrollmentLogs', function ($logQuery) {
            $logQuery->where('action', EnrollmentLogActionEnum::REGISTRAR_APPROVED->value);
        })->count();
    }

}
