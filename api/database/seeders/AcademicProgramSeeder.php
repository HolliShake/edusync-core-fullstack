<?php

namespace Database\Seeders;

use App\Models\AcademicProgram;
use App\Models\College;
use App\Models\ProgramType;
use Illuminate\Database\Seeder;

class AcademicProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programTypes = ProgramType::all();
        $colleges = College::all();

        $programs = [
            // Computer Studies Programs
            [
                'program_name' => 'Bachelor of Science in Computer Science',
                'short_name' => 'BSCS',
                'college_shortname' => 'CCS'
            ],
            [
                'program_name' => 'Bachelor of Science in Information Technology',
                'short_name' => 'BSIT',
                'college_shortname' => 'CCS'
            ],
            [
                'program_name' => 'Bachelor of Science in Information Systems',
                'short_name' => 'BSIS',
                'college_shortname' => 'CCS'
            ],
            [
                'program_name' => 'Bachelor of Science in Cybersecurity',
                'short_name' => 'BSCY',
                'college_shortname' => 'CCS'
            ],

            // Engineering Programs
            [
                'program_name' => 'Bachelor of Science in Civil Engineering',
                'short_name' => 'BSCE',
                'college_shortname' => 'COE'
            ],
            [
                'program_name' => 'Bachelor of Science in Electrical Engineering',
                'short_name' => 'BSEE',
                'college_shortname' => 'COE'
            ],
            [
                'program_name' => 'Bachelor of Science in Mechanical Engineering',
                'short_name' => 'BSME',
                'college_shortname' => 'COE'
            ],
            [
                'program_name' => 'Bachelor of Science in Computer Engineering',
                'short_name' => 'BSCpE',
                'college_shortname' => 'COE'
            ],

            // Business Administration Programs
            [
                'program_name' => 'Bachelor of Science in Business Administration - Marketing',
                'short_name' => 'BSBA-MKT',
                'college_shortname' => 'CBA'
            ],
            [
                'program_name' => 'Bachelor of Science in Business Administration - Finance',
                'short_name' => 'BSBA-FIN',
                'college_shortname' => 'CBA'
            ],
            [
                'program_name' => 'Bachelor of Science in Business Administration - Human Resource',
                'short_name' => 'BSBA-HRM',
                'college_shortname' => 'CBA'
            ],
            [
                'program_name' => 'Bachelor of Science in Accountancy',
                'short_name' => 'BSA',
                'college_shortname' => 'CBA'
            ],

            // Education Programs
            [
                'program_name' => 'Bachelor of Elementary Education',
                'short_name' => 'BEED',
                'college_shortname' => 'COED'
            ],
            [
                'program_name' => 'Bachelor of Secondary Education - Mathematics',
                'short_name' => 'BSED-MATH',
                'college_shortname' => 'COED'
            ],
            [
                'program_name' => 'Bachelor of Secondary Education - English',
                'short_name' => 'BSED-ENG',
                'college_shortname' => 'COED'
            ],
            [
                'program_name' => 'Bachelor of Secondary Education - Science',
                'short_name' => 'BSED-SCI',
                'college_shortname' => 'COED'
            ],

            // Arts and Sciences Programs
            [
                'program_name' => 'Bachelor of Arts in Psychology',
                'short_name' => 'AB-PSY',
                'college_shortname' => 'CAS'
            ],
            [
                'program_name' => 'Bachelor of Science in Psychology',
                'short_name' => 'BS-PSY',
                'college_shortname' => 'CAS'
            ],
            [
                'program_name' => 'Bachelor of Arts in Communication',
                'short_name' => 'AB-COMM',
                'college_shortname' => 'CAS'
            ],

            // Nursing Programs
            [
                'program_name' => 'Bachelor of Science in Nursing',
                'short_name' => 'BSN',
                'college_shortname' => 'CON'
            ],

            // Architecture Programs
            [
                'program_name' => 'Bachelor of Science in Architecture',
                'short_name' => 'BS-ARCH',
                'college_shortname' => 'COA'
            ],

            // Medicine Programs
            [
                'program_name' => 'Doctor of Medicine',
                'short_name' => 'MD',
                'college_shortname' => 'COM'
            ]
        ];

        foreach ($colleges as $college) {
            foreach ($programs as $program) {
                if ($program['college_shortname'] === $college->college_shortname) {
                    // Get a random program type
                    $programType = $programTypes->random();
                    
                    AcademicProgram::create([
                        'program_name' => $program['program_name'],
                        'short_name' => $program['short_name'],
                        'year_first_implemented' => now()->subYears(rand(1, 10))->format('Y-m-d'),
                        'college_id' => $college->id,
                        'program_type_id' => $programType->id
                    ]);
                }
            }
        }
    }
}
