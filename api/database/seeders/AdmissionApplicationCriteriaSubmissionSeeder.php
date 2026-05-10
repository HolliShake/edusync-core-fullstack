<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdmissionApplicationCriteriaSubmission;
use App\Models\AdmissionApplication;
use App\Models\AdmissionCriteria;

class AdmissionApplicationCriteriaSubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting AdmissionApplicationCriteriaSubmissionSeeder...');

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

            foreach ($criteria as $criterion) {
                $exists = AdmissionApplicationCriteriaSubmission::where('admission_application_id', $application->id)
                    ->where('admission_criteria_id', $criterion->id)
                    ->exists();

                if ($exists) {
                    continue;
                }

                $scoreValue = $this->generateScore($criterion->max_score);
                
                AdmissionApplicationCriteriaSubmission::create([
                    'admission_application_id' => $application->id,
                    'admission_criteria_id' => $criterion->id,
                    'score' => $scoreValue,
                    'comments' => $this->generateComment($scoreValue, $criterion->max_score),
                    'is_posted' => true,
                ]);

                $count++;
            }
        }

        $this->command->info("Seeded {$count} admission application criteria submissions.");
    }

    private function generateScore(float|int $maxScore): float
    {
        // Generate a random score between 60% and 100% of max score
        $min = $maxScore * 0.60;
        $random = rand($min * 100, $maxScore * 100) / 100;
        return round($random, 2);
    }

    private function generateComment(float|int $score, float|int $maxScore): string
    {
        $percentage = ($score / $maxScore) * 100;

        if ($percentage >= 90) return 'Excellent performance.';
        if ($percentage >= 80) return 'Very good.';
        if ($percentage >= 75) return 'Good.';
        if ($percentage >= 60) return 'Satisfactory.';
        return 'Needs improvement.';
    }
}
