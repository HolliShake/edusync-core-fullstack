<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdmissionApplication;
use App\Models\AdmissionApplicationLog;
use App\Models\User;
use App\Models\SchoolYear;
use App\Models\AcademicProgram;
use App\Models\AcademicCalendar;
use App\Enum\AdmissionApplicationLogTypeEnum;
use App\Enum\UserRoleEnum;
use App\Enum\CalendarEventEnum;

class AdmissionApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get required data - find school year with active enrollment period
        $schoolYear = $this->getSchoolYearWithActiveEnrollment();
        $academicPrograms = AcademicProgram::take(4)->get(); // Get first 4 programs
        $students = User::where('role', UserRoleEnum::STUDENT)->get();

        if (!$schoolYear || $academicPrograms->isEmpty() || $students->isEmpty()) {
            $this->command->warn('Required data not found. Make sure SchoolYearSeeder, AcademicProgramSeeder, and UserSeeder have been run.');
            return;
        }

        $this->command->info('Creating admission applications for ' . $students->count() . ' students...');

        $applicationCount = 0;

        foreach ($students as $student) {
            // Check if student already has an application
            $existingApplication = AdmissionApplication::where('user_id', $student->id)
                ->where('school_year_id', $schoolYear->id)
                ->first();

            if (!$existingApplication) {
                // Create admission application
                $application = AdmissionApplication::create([
                    'user_id' => $student->id,
                    'school_year_id' => $schoolYear->id,
                    'academic_program_id' => $academicPrograms->random()->id,
                    'first_name' => $this->extractFirstName($student->name),
                    'last_name' => $this->extractLastName($student->name),
                    'middle_name' => $this->generateMiddleName(),
                    'email' => $student->email,
                    'phone' => $this->generatePhoneNumber(),
                    'address' => $this->generateAddress(),
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

    /**
     * Extract first name from full name
     */
    private function extractFirstName(string $fullName): string
    {
        $parts = explode(' ', trim($fullName));
        return $parts[0] ?? 'Unknown';
    }

    /**
     * Extract last name from full name
     */
    private function extractLastName(string $fullName): string
    {
        $parts = explode(' ', trim($fullName));
        return end($parts) ?? 'Unknown';
    }

    /**
     * Generate a random middle name
     */
    private function generateMiddleName(): string
    {
        $middleNames = [
            'Santos', 'Reyes', 'Cruz', 'Garcia', 'Lopez', 'Martinez', 'Rodriguez', 'Gonzalez',
            'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz',
            'Morales', 'Jimenez', 'Ruiz', 'Hernandez', 'Vargas', 'Mendoza', 'Castillo', 'Ramos'
        ];

        return $middleNames[array_rand($middleNames)];
    }

    /**
     * Generate a random phone number
     */
    private function generatePhoneNumber(): string
    {
        $prefixes = ['+63 912', '+63 917', '+63 918', '+63 919', '+63 920', '+63 921'];
        $prefix = $prefixes[array_rand($prefixes)];
        $number = str_pad(rand(0, 9999999), 7, '0', STR_PAD_LEFT);

        return $prefix . ' ' . substr($number, 0, 3) . ' ' . substr($number, 3, 4);
    }

    /**
     * Generate a random address
     */
    private function generateAddress(): string
    {
        $streets = ['Main Street', 'Rizal Avenue', 'Quezon Boulevard', 'Taft Avenue', 'EDSA', 'Ortigas Avenue'];
        $cities = ['Quezon City', 'Makati City', 'Manila', 'Taguig City', 'Pasig City', 'Mandaluyong City'];
        $street = $streets[array_rand($streets)];
        $city = $cities[array_rand($cities)];
        $number = rand(100, 9999);

        return "{$number} {$street}, {$city}, Metro Manila";
    }

    /**
     * Get school year with active enrollment period for today's date
     */
    private function getSchoolYearWithActiveEnrollment(): ?SchoolYear
    {
        // First try to find a school year with active enrollment period
        $schoolYearWithEnrollment = SchoolYear::whereHas('academicCalendars', function ($query) {
            $query->where('event', CalendarEventEnum::ENROLLMENT->value)
                  ->where('start_date', '<=', now())
                  ->where('end_date', '>=', now());
        })->first();

        if ($schoolYearWithEnrollment) {
            return $schoolYearWithEnrollment;
        }

        // Fallback: use any active school year
        return SchoolYear::where('is_active', true)->first();
    }
}
