<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Enrollment;
use App\Models\Section;
use App\Models\User;
use App\Models\AdmissionApplication;
use App\Models\AcademicCalendar;
use App\Enum\UserRoleEnum;
use App\Enum\AdmissionApplicationLogTypeEnum;
use App\Enum\CalendarEventEnum;

class EnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get students first (smaller dataset)
        $students = User::where('role', UserRoleEnum::STUDENT)->get();

        if ($students->isEmpty()) {
            $this->command->warn('No students found. Make sure UserSeeder has been run.');
            return;
        }

        // Get students with ACCEPTED admission applications
        $acceptedStudents = $this->getStudentsWithAcceptedApplications($students);

        if ($acceptedStudents->isEmpty()) {
            $this->command->warn('No students with accepted admission applications found. Make sure AdmissionApplicationSeeder and AdmissionApplicationScoreSeeder have been run.');
            return;
        }

        $this->command->info('Found ' . $acceptedStudents->count() . ' accepted students. Processing sections in batches...');

        $enrollmentCount = 0;
        $maxEnrollmentsPerSection = 25; // Limit enrollments per section
        $batchSize = 100; // Process sections in batches to prevent memory issues

        // Process sections in batches to prevent memory exhaustion
        Section::with(['curriculumDetail.curriculum.academicProgram'])
            ->chunk($batchSize, function ($sections) use ($acceptedStudents, $maxEnrollmentsPerSection, &$enrollmentCount) {
                foreach ($sections as $section) {
                    // Check if school year has active enrollment period
                    if (!$this->isSchoolYearEnrollmentActive($section->curriculumDetail->curriculum->school_year_id)) {
                        continue;
                    }

                    // Get the academic program for this section
                    $academicProgramId = $section->curriculumDetail->curriculum->academic_program_id;

                    // Filter students who have accepted applications for this program
                    $eligibleStudents = $acceptedStudents->filter(function ($student) use ($academicProgramId) {
                        return $this->hasAcceptedApplicationForProgram($student, $academicProgramId);
                    });

                    if ($eligibleStudents->isEmpty()) {
                        continue;
                    }

                    // Randomly select students for this section (1-25 students per section)
                    $numberOfStudents = rand(1, min($maxEnrollmentsPerSection, $eligibleStudents->count()));
                    $studentsForSection = $eligibleStudents->random($numberOfStudents);

                    foreach ($studentsForSection as $student) {
                        // Check if student is already enrolled in this section
                        $existingEnrollment = Enrollment::where('user_id', $student->id)
                            ->where('section_id', $section->id)
                            ->first();

                        if (!$existingEnrollment) {
                            Enrollment::create([
                                'user_id' => $student->id,
                                'section_id' => $section->id,
                            ]);
                            $enrollmentCount++;
                        }
                    }
                }
            });

        $this->command->info("Created {$enrollmentCount} enrollments successfully!");
    }

    /**
     * Get students who have accepted admission applications
     * OPTIMIZED: Use single query instead of N+1 queries
     */
    private function getStudentsWithAcceptedApplications($students): \Illuminate\Support\Collection
    {
        $studentIds = $students->pluck('id');

        // Get all accepted application user IDs in one query
        $acceptedUserIds = AdmissionApplication::whereIn('user_id', $studentIds)
            ->whereHas('logs', function ($query) {
                $query->where('type', AdmissionApplicationLogTypeEnum::ACCEPTED->value);
            })
            ->pluck('user_id')
            ->toArray();

        return $students->filter(function ($student) use ($acceptedUserIds) {
            return in_array($student->id, $acceptedUserIds);
        });
    }

    /**
     * Check if student has accepted application for specific program
     * OPTIMIZED: Use direct database query to prevent N+1
     * Note: admission_application -> admission_schedule -> academic_program
     */
    private function hasAcceptedApplicationForProgram($student, $academicProgramId): bool
    {
        return AdmissionApplication::where('user_id', $student->id)
            ->whereHas('admissionSchedule', function ($query) use ($academicProgramId) {
                $query->where('academic_program_id', $academicProgramId);
            })
            ->whereHas('logs', function ($query) {
                $query->where('type', AdmissionApplicationLogTypeEnum::ACCEPTED->value);
            })
            ->exists();
    }

    /**
     * Check if school year has active enrollment period for today's date
     */
    private function isSchoolYearEnrollmentActive($schoolYearId): bool
    {
        return AcademicCalendar::where('school_year_id', $schoolYearId)
            ->where('event', CalendarEventEnum::ENROLLMENT->value)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->exists();
    }
}
