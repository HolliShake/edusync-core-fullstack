<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdmissionApplicationScore;
use App\Models\AdmissionApplication;
use App\Models\AdmissionCriteria;
use App\Models\User;
use App\Models\Designition;
use App\Models\AcademicProgram;

class AdmissionApplicationScoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting AdmissionApplicationScoreSeeder...');

        // 1. Get all admission applications
        $applications = AdmissionApplication::with(['admissionSchedule'])->get();

        if ($applications->isEmpty()) {
            $this->command->warn('No admission applications found. Skipping.');
            return;
        }

        $count = 0;

        foreach ($applications as $application) {
            $schedule = $application->admissionSchedule;
            
            if (!$schedule) {
                $this->command->warn("Application ID {$application->id} has no admission schedule.");
                continue;
            }

            $programId = $schedule->academic_program_id;
            
            // 2. Get criteria for the specific program and schedule
            // Note: Criteria are often linked to a schedule or a program. 
            // Based on previous code, they seemed to be linked to both.
            // Let's try to match both if possible, or fallback to just program/schedule if schema allows.
            // Checking schema from previous steps: AdmissionCriteria has academic_program_id and admission_schedule_id.
            
            $criteria = AdmissionCriteria::where('admission_schedule_id', $schedule->id)
                ->where('academic_program_id', $programId)
                ->get();

            if ($criteria->isEmpty()) {
                // Fallback: maybe criteria are only linked to schedule?
                $criteria = AdmissionCriteria::where('admission_schedule_id', $schedule->id)->get();
            }

            if ($criteria->isEmpty()) {
                $this->command->warn("No criteria found for Application {$application->id} (Schedule: {$schedule->id}).");
                continue;
            }

            // 3. Find a suitable evaluator (User)
            // Try to find a Program Chair for this specific program
            $evaluator = null;
            
            // Look for a user with designation for this academic program
            $designation = Designition::where('designitionable_type', AcademicProgram::class)
                ->where('designitionable_id', $programId)
                ->where('is_active', true)
                ->first();

            if ($designation) {
                $evaluator = User::find($designation->user_id);
            }

            // Fallback 1: Any Program Chair
            if (!$evaluator) {
                $anyChairDesignation = Designition::where('designitionable_type', AcademicProgram::class)
                    ->where('is_active', true)
                    ->inRandomOrder()
                    ->first();
                
                if ($anyChairDesignation) {
                    $evaluator = User::find($anyChairDesignation->user_id);
                }
            }

            // Fallback 2: Any User (Admin/Faculty/etc) - just pick the first user to ensure data is created
            if (!$evaluator) {
                $evaluator = User::first();
            }

            if (!$evaluator) {
                $this->command->error('No users found in the system to assign as evaluator.');
                return;
            }

            foreach ($criteria as $criterion) {
                // Check if score already exists
                $exists = AdmissionApplicationScore::where('admission_application_id', $application->id)
                    ->where('admission_criteria_id', $criterion->id)
                    ->where('user_id', $evaluator->id)
                    ->exists();

                if ($exists) {
                    continue;
                }

                $scoreValue = $this->generateScore($criterion->max_score);
                
                AdmissionApplicationScore::create([
                    'admission_application_id' => $application->id,
                    'admission_criteria_id' => $criterion->id,
                    'user_id' => $evaluator->id,
                    'score' => $scoreValue,
                    'comments' => $this->generateComment($scoreValue, $criterion->max_score),
                    'is_posted' => true, // Auto-post for now
                ]);

                $count++;
            }
        }

        $this->command->info("Seeded {$count} admission application scores.");
    }

    private function generateScore($maxScore)
    {
        // Generate a random score between 60% and 100% of max score
        $min = $maxScore * 0.60;
        $random = rand($min * 100, $maxScore * 100) / 100;
        return round($random, 2);
    }

    private function generateComment($score, $maxScore)
    {
        $percentage = ($score / $maxScore) * 100;
        
        if ($percentage >= 90) return 'Excellent performance.';
        if ($percentage >= 80) return 'Very good.';
        if ($percentage >= 75) return 'Good.';
        if ($percentage >= 60) return 'Satisfactory.';
        return 'Needs improvement.';
    }
}
