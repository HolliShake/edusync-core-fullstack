<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdmissionApplicationScore;
use App\Models\AdmissionApplication;
use App\Models\AcademicProgramCriteria;
use App\Models\User;
use App\Enum\UserRoleEnum;

class AdmissionApplicationScoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get required data
        $applications = AdmissionApplication::with(['admissionSchedule.academicProgram'])->get();
        $criteria = AcademicProgramCriteria::with(['academicProgram'])->get();

        // Get users with dynamic roles (based on designations)
        $allUsers = User::with('designitions')->get();
        $evaluators = $this->getUsersWithRole($allUsers, UserRoleEnum::PROGRAM_CHAIR);

        if ($applications->isEmpty() || $criteria->isEmpty() || $evaluators->isEmpty()) {
            $this->command->warn('Required data not found. Make sure AdmissionApplicationSeeder, AcademicProgramCriteriaSeeder, UserSeeder, and DesignitionSeeder have been run.');
            return;
        }

        $this->command->info('Creating admission application scores for ' . $applications->count() . ' applications...');

        $scoreCount = 0;

        foreach ($applications as $application) {
            // Get criteria for this application's academic program
            $academicProgramId = $application->admissionSchedule->academic_program_id;
            $programCriteria = $criteria->where('academic_program_id', $academicProgramId);

            if ($programCriteria->isEmpty()) {
                continue;
            }

            // Create scores for each criteria
            foreach ($programCriteria as $criterion) {
                // Check if score already exists
                $existingScore = AdmissionApplicationScore::where('admission_application_id', $application->id)
                    ->where('academic_program_criteria_id', $criterion->id)
                    ->first();

                if (!$existingScore) {
                    $score = $this->generateRealisticScore($criterion);
                    $comments = $this->generateComments($score);

                    AdmissionApplicationScore::create([
                        'admission_application_id' => $application->id,
                        'academic_program_criteria_id' => $criterion->id,
                        'user_id' => $evaluators->random()->id,
                        'score' => $score,
                        'comments' => $comments,
                        'is_posted' => true, // Post all scores to trigger automatic "accepted" logs for passing students
                    ]);

                    $scoreCount++;
                }
            }
        }

        $this->command->info("Created {$scoreCount} admission application scores successfully!");
    }

    /**
     * Get users with a specific role (considering dynamic roles from designations)
     */
    private function getUsersWithRole($users, UserRoleEnum $targetRole): \Illuminate\Support\Collection
    {
        return $users->filter(function ($user) use ($targetRole) {
            $userRoles = $user->roles; // This calls the getRolesAttribute() method
            return in_array($targetRole->value, $userRoles);
        });
    }

    /**
     * Generate realistic score based on criteria type
     */
    private function generateRealisticScore($criterion): float
    {
        // Generate scores based on different criteria types
        $criteriaName = strtolower($criterion->criteria_name ?? '');

        if (str_contains($criteriaName, 'gpa') || str_contains($criteriaName, 'grade')) {
            // GPA/Grade criteria: 1.0 - 4.0 scale
            return round(rand(150, 400) / 100, 2);
        } elseif (str_contains($criteriaName, 'exam') || str_contains($criteriaName, 'test')) {
            // Exam criteria: 0 - 100 scale (bias towards higher scores for passing)
            return round(rand(75, 100), 1);
        } elseif (str_contains($criteriaName, 'interview')) {
            // Interview criteria: 0 - 100 scale (bias towards higher scores)
            return round(rand(80, 100), 1);
        } elseif (str_contains($criteriaName, 'essay') || str_contains($criteriaName, 'writing')) {
            // Essay/Writing criteria: 0 - 100 scale (bias towards higher scores)
            return round(rand(75, 100), 1);
        } else {
            // Default: 0 - 100 scale (bias towards higher scores for passing)
            return round(rand(70, 100), 1);
        }
    }

    /**
     * Generate appropriate comments based on score
     */
    private function generateComments(float $score): string
    {
        if ($score >= 90) {
            $comments = [
                'Excellent performance across all areas',
                'Outstanding academic achievement',
                'Exceptional candidate with strong potential',
                'Excellent work, very impressive',
                'Outstanding performance in all criteria'
            ];
        } elseif ($score >= 80) {
            $comments = [
                'Good performance with room for improvement',
                'Solid academic foundation',
                'Good potential with some areas to develop',
                'Satisfactory performance overall',
                'Good work with minor areas for improvement'
            ];
        } elseif ($score >= 70) {
            $comments = [
                'Adequate performance, needs improvement',
                'Meets minimum requirements',
                'Satisfactory but could be better',
                'Average performance with potential',
                'Adequate work, some improvement needed'
            ];
        } else {
            $comments = [
                'Below expectations, significant improvement needed',
                'Does not meet minimum standards',
                'Needs substantial improvement',
                'Below average performance',
                'Requires significant development'
            ];
        }

        return $comments[array_rand($comments)];
    }
}
