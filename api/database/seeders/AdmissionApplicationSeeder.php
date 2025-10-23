<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdmissionApplication;
use App\Models\User;
use App\Models\SchoolYear;
use App\Models\AcademicProgram;

class AdmissionApplicationSeeder extends Seeder
{
    public function run(): void
    {
        // Get required data
        $schoolYear = SchoolYear::where('is_active', true)->first();
        $academicPrograms = AcademicProgram::take(4)->get(); // Get first 4 programs

        if (!$schoolYear || $academicPrograms->isEmpty()) {
            $this->command->warn('Required data not found. Make sure UserSeeder, SchoolYearSeeder, and AcademicProgramSeeder have been run.');
            return;
        }

        // Define realistic application scenarios
        $scenarios = [
            // Scenario 1: Juan - Just submitted (pending review)
            [
                'email' => 'juan.delacruz@student.edu',
                'data' => [
                    'first_name' => 'Juan',
                    'last_name' => 'Dela Cruz',
                    'middle_name' => 'Santos',
                    'phone' => '+63 912 345 6789',
                    'address' => '123 Main Street, Quezon City, Metro Manila',
                    'program_index' => 0, // BSCS
                ],
            ],

            // Scenario 2: Maria Clara - Approved (ready for evaluation)
            [
                'email' => 'maria.reyes@student.edu',
                'data' => [
                    'first_name' => 'Maria Clara',
                    'last_name' => 'Reyes',
                    'middle_name' => 'Domingo',
                    'phone' => '+63 917 234 5678',
                    'address' => '456 Rizal Avenue, Makati City, Metro Manila',
                    'program_index' => 1, // BSIT
                ],
            ],

            // Scenario 3: Pedro - Rejected (didn't meet requirements)
            [
                'email' => 'pedro.santiago@student.edu',
                'data' => [
                    'first_name' => 'Pedro',
                    'last_name' => 'Santiago',
                    'middle_name' => 'Cruz',
                    'phone' => '+63 918 345 6789',
                    'address' => '789 Del Pilar Street, Pasig City, Metro Manila',
                    'program_index' => 2, // BSIS
                ],
            ],

            // Scenario 4: Ana Marie - Accepted (complete process - ready for enrollment)
            [
                'email' => 'ana.gonzales@student.edu',
                'data' => [
                    'first_name' => 'Ana Marie',
                    'last_name' => 'Gonzales',
                    'middle_name' => 'Villanueva',
                    'phone' => '+63 919 456 7890',
                    'address' => '321 Aurora Boulevard, San Juan City, Metro Manila',
                    'program_index' => 0, // BSCS
                ],
            ],

            // Scenario 5: Carlos - Cancelled by student (changed mind)
            [
                'email' => 'carlos.torres@student.edu',
                'data' => [
                    'first_name' => 'Carlos Miguel',
                    'last_name' => 'Torres',
                    'middle_name' => 'Ramos',
                    'phone' => '+63 920 567 8901',
                    'address' => '654 Bonifacio Street, Taguig City, Metro Manila',
                    'program_index' => 3, // BSCpE
                ],
            ],

            // Scenario 6: Sofia - In progress (recently approved)
            [
                'email' => 'sofia.mendoza@student.edu',
                'data' => [
                    'first_name' => 'Sofia Isabel',
                    'last_name' => 'Mendoza',
                    'middle_name' => 'Lopez',
                    'phone' => '+63 921 678 9012',
                    'address' => '987 Mabini Street, Mandaluyong City, Metro Manila',
                    'program_index' => 1, // BSIT
                ],
            ],

            // Scenario 7: Rafael - Just submitted recently
            [
                'email' => 'rafael.cruz@student.edu',
                'data' => [
                    'first_name' => 'Rafael Antonio',
                    'last_name' => 'Cruz',
                    'middle_name' => 'Mercado',
                    'phone' => '+63 922 789 0123',
                    'address' => '159 Aguinaldo Highway, Cavite City, Cavite',
                    'program_index' => 2, // BSIS
                ],
            ],

            // Scenario 8: Isabella - Full process (Approved then Accepted)
            [
                'email' => 'isabella.garcia@student.edu',
                'data' => [
                    'first_name' => 'Isabella Marie',
                    'last_name' => 'Garcia',
                    'middle_name' => 'Santos',
                    'phone' => '+63 923 890 1234',
                    'address' => '753 Roxas Boulevard, Pasay City, Metro Manila',
                    'program_index' => 0, // BSCS
                ],
            ],
        ];

        // Process each scenario
        foreach ($scenarios as $scenario) {
            $student = User::where('email', $scenario['email'])->first();

            if (!$student) {
                $this->command->warn("Student with email {$scenario['email']} not found.");
                continue;
            }

            // Get the academic program for this application
            $academicProgram = $academicPrograms[$scenario['data']['program_index']] ?? $academicPrograms->first();

            // Create the admission application
            $application = AdmissionApplication::create([
                'user_id' => $student->id,
                'school_year_id' => $schoolYear->id,
                'academic_program_id' => $academicProgram->id,
                'first_name' => $scenario['data']['first_name'],
                'last_name' => $scenario['data']['last_name'],
                'middle_name' => $scenario['data']['middle_name'],
                'email' => $student->email,
                'phone' => $scenario['data']['phone'],
                'address' => $scenario['data']['address'],
            ]);

            $this->command->info("✓ Created application #{$application->id} for {$application->first_name} {$application->last_name}");
        }

        $this->command->info("\n" . str_repeat('=', 80));
        $this->command->info('Admission Application Seeding Summary:');
        $this->command->info(str_repeat('=', 80));
        $this->command->info('Total Applications Created: ' . count($scenarios));
        $this->command->info(str_repeat('=', 80));
    }
}
