<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EnrollmentLog;
use App\Models\Enrollment;
use App\Models\User;
use App\Enum\EnrollmentLogActionEnum;
use App\Enum\UserRoleEnum;

class EnrollmentLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get required data
        $enrollments = Enrollment::with(['user', 'section'])->get();

        if ($enrollments->isEmpty()) {
            $this->command->warn('Required data not found. Make sure EnrollmentSeeder has been run.');
            return;
        }

        $this->command->info('Creating enrollment logs for ' . $enrollments->count() . ' enrollments...');

        $logCount = 0;

        foreach ($enrollments as $enrollment) {
            // Skip if enrollment already has additional logs beyond the initial ENROLL log
            if ($enrollment->enrollmentLogs()->count() > 1) {
                continue;
            }

            // Randomly determine enrollment status progression
            $statusProgression = $this->getRandomStatusProgression();

            foreach ($statusProgression as $action) {
                $note = $this->getNoteForAction($action);

                $this->createEnrollmentLog(
                    $enrollment,
                    $enrollment->user_id,
                    $action,
                    $note
                );
                $logCount++;
            }
        }

        $this->command->info("Created {$logCount} enrollment logs successfully!");
    }

    /**
     * Create an enrollment log entry
     */
    private function createEnrollmentLog($enrollment, $userId, $action, $note): void
    {
        EnrollmentLog::create([
            'enrollment_id' => $enrollment->id,
            'user_id' => $userId,
            'action' => $action->value,
            'note' => $note,
        ]);
    }

    /**
     * Get random status progression for an enrollment
     */
    private function getRandomStatusProgression(): array
    {
        $progressions = [
            // Scenario 1: Full approval (most common)
            [
                EnrollmentLogActionEnum::PROGRAM_CHAIR_APPROVED,
                EnrollmentLogActionEnum::REGISTRAR_APPROVED,
            ],
            // Scenario 2: Only program chair approval
            [
                EnrollmentLogActionEnum::PROGRAM_CHAIR_APPROVED,
            ],
            // Scenario 3: Dropped after approval
            [
                EnrollmentLogActionEnum::PROGRAM_CHAIR_APPROVED,
                EnrollmentLogActionEnum::REGISTRAR_APPROVED,
                EnrollmentLogActionEnum::DROPPED,
                EnrollmentLogActionEnum::PROGRAM_CHAIR_DROPPED_APPROVED,
                EnrollmentLogActionEnum::REGISTRAR_DROPPED_APPROVED,
            ],
            // Scenario 4: Dropped after program chair approval
            [
                EnrollmentLogActionEnum::PROGRAM_CHAIR_APPROVED,
                EnrollmentLogActionEnum::DROPPED,
                EnrollmentLogActionEnum::PROGRAM_CHAIR_DROPPED_APPROVED,
            ],
            // Scenario 5: Just enrolled (no further action)
            [],
        ];

        return $progressions[array_rand($progressions)];
    }

    /**
     * Get appropriate note for the action
     */
    private function getNoteForAction($action): string
    {
        switch ($action) {
            case EnrollmentLogActionEnum::PROGRAM_CHAIR_APPROVED:
                return 'Approved by Program Chair';
            case EnrollmentLogActionEnum::REGISTRAR_APPROVED:
                return 'Validated by Registrar';
            case EnrollmentLogActionEnum::DROPPED:
                return 'Student requested to drop the course';
            case EnrollmentLogActionEnum::PROGRAM_CHAIR_DROPPED_APPROVED:
                return 'Drop request approved by Program Chair';
            case EnrollmentLogActionEnum::REGISTRAR_DROPPED_APPROVED:
                return 'Drop request validated by Registrar';
            default:
                return 'Action logged';
        }
    }
}
