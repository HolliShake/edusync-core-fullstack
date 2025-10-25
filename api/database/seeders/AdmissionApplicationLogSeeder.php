<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdmissionApplicationLog;
use App\Models\AdmissionApplication;
use App\Models\User;
use App\Enum\AdmissionApplicationLogTypeEnum;
use App\Enum\UserRoleEnum;

class AdmissionApplicationLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get required data
        $applications = AdmissionApplication::with(['user'])->get();

        // Get users with dynamic roles (based on designations)
        $allUsers = User::with('designitions')->get();
        $programChairs = $this->getUsersWithRole($allUsers, UserRoleEnum::PROGRAM_CHAIR);

        if ($applications->isEmpty() || $programChairs->isEmpty()) {
            $this->command->warn('Required data not found. Make sure AdmissionApplicationSeeder, UserSeeder, and DesignitionSeeder have been run.');
            return;
        }

        $this->command->info('Creating additional admission application logs for ' . $applications->count() . ' applications...');

        $logCount = 0;

        foreach ($applications as $index => $application) {
            // Skip if application already has additional logs beyond submitted + approved
            // The trigger creates "submitted", we create "approved", and score trigger may create "accepted"
            if ($application->logs()->count() > 2) {
                continue;
            }

            // Create additional logs for different scenarios
            $scenarios = $this->getRandomScenarios();

            foreach ($scenarios as $scenario) {
                $loggedBy = $this->getLoggedByUser($scenario['type'], $programChairs, $application->user);
                $note = $this->getNoteForType($scenario['type']);

                // Check if this specific log already exists to avoid unique constraint violation
                $existingLog = AdmissionApplicationLog::where('admission_application_id', $application->id)
                    ->where('user_id', $loggedBy->id)
                    ->where('type', $scenario['type'])
                    ->first();

                if (!$existingLog) {
                    AdmissionApplicationLog::create([
                        'admission_application_id' => $application->id,
                        'user_id' => $loggedBy->id,
                        'type' => $scenario['type'],
                        'note' => $note,
                    ]);

                    $logCount++;
                }
            }
        }

        $this->command->info("Created {$logCount} additional admission application logs successfully!");
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
     * Get random scenarios for application progression
     */
    private function getRandomScenarios(): array
    {
        $scenarios = [
            // Scenario 1: Rejected (overrides approved)
            [
                ['type' => AdmissionApplicationLogTypeEnum::REJECTED->value]
            ],
            // Scenario 2: Cancelled by student
            [
                ['type' => AdmissionApplicationLogTypeEnum::CANCELLED->value]
            ],
            // Scenario 3: No additional logs (keep as submitted + approved)
            // Note: "accepted" logs are automatically created by the database trigger
            // when AdmissionApplicationScore is posted with passing scores
            []
        ];

        return $scenarios[array_rand($scenarios)];
    }

    /**
     * Get the appropriate user to log the action
     */
    private function getLoggedByUser(string $type, $programChairs, $student)
    {
        switch ($type) {
            case AdmissionApplicationLogTypeEnum::APPROVED->value:
            case AdmissionApplicationLogTypeEnum::REJECTED->value:
                return $programChairs->random();
            case AdmissionApplicationLogTypeEnum::CANCELLED->value:
                return $student; // Student cancels their own application
            default:
                return $programChairs->random();
        }
    }

    /**
     * Get appropriate note for the log type
     */
    private function getNoteForType(string $type): string
    {
        switch ($type) {
            case AdmissionApplicationLogTypeEnum::APPROVED->value:
                return 'Application approved by Program Chair for evaluation';
            case AdmissionApplicationLogTypeEnum::REJECTED->value:
                return 'Application rejected - does not meet program requirements';
            case AdmissionApplicationLogTypeEnum::CANCELLED->value:
                return 'Application cancelled by student';
            default:
                return 'Action logged';
        }
    }
}
