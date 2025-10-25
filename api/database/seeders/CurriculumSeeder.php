<?php

namespace Database\Seeders;

use App\Models\AcademicProgram;
use App\Models\AcademicTerm;
use App\Models\Curriculum;
use App\Models\SchoolYear;
use App\Enum\CurriculumStateEnum;
use Illuminate\Database\Seeder;

class CurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicPrograms = AcademicProgram::all();
        $academicTerms = AcademicTerm::all();
        $schoolYears = SchoolYear::all();

        foreach ($academicPrograms as $program) {
            // Create multiple curricula for each program (different years)
            $curricula = [
                [
                    'curriculum_code' => $program->short_name . '-' . $program->id . '-2024-001',
                    'curriculum_name' => $program->program_name . ' - 2024 Curriculum',
                    'description' => 'Updated curriculum for ' . $program->program_name . ' effective 2024',
                    'effective_year' => 2024,
                    'total_units' => rand(120, 180),
                    'total_hours' => rand(2400, 3600),
                    'status' => CurriculumStateEnum::ACTIVE->value,
                    'approved_date' => '2024-01-15'
                ],
                [
                    'curriculum_code' => $program->short_name . '-' . $program->id . '-2023-001',
                    'curriculum_name' => $program->program_name . ' - 2023 Curriculum',
                    'description' => 'Previous curriculum for ' . $program->program_name . ' effective 2023',
                    'effective_year' => 2023,
                    'total_units' => rand(120, 180),
                    'total_hours' => rand(2400, 3600),
                    'status' => CurriculumStateEnum::INACTIVE->value,
                    'approved_date' => '2023-01-15'
                ],
                [
                    'curriculum_code' => $program->short_name . '-' . $program->id . '-2022-001',
                    'curriculum_name' => $program->program_name . ' - 2022 Curriculum',
                    'description' => 'Legacy curriculum for ' . $program->program_name . ' effective 2022',
                    'effective_year' => 2022,
                    'total_units' => rand(120, 180),
                    'total_hours' => rand(2400, 3600),
                    'status' => CurriculumStateEnum::ARCHIVED->value,
                    'approved_date' => '2022-01-15'
                ]
            ];

            foreach ($curricula as $curriculumData) {
                // Get a random academic term and school year
                $academicTerm = $academicTerms->random();
                $schoolYear = $schoolYears->random();

                Curriculum::create([
                    'school_year_id' => $schoolYear->id,
                    'academic_program_id' => $program->id,
                    'academic_term_id' => $academicTerm->id,
                    'curriculum_code' => $curriculumData['curriculum_code'],
                    'curriculum_name' => $curriculumData['curriculum_name'],
                    'description' => $curriculumData['description'],
                    'effective_year' => $curriculumData['effective_year'],
                    'total_units' => $curriculumData['total_units'],
                    'total_hours' => $curriculumData['total_hours'],
                    'status' => $curriculumData['status'],
                    'approved_date' => $curriculumData['approved_date']
                ]);
            }
        }
    }
}
