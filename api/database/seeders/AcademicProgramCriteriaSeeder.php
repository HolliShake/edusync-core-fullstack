<?php

namespace Database\Seeders;

use App\Models\AcademicProgramCriteria;
use App\Models\AcademicProgram;
use App\Models\SchoolYear;
use Illuminate\Database\Seeder;

class AcademicProgramCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicPrograms = AcademicProgram::all();
        $schoolYears = SchoolYear::all();

        // Define exactly 5 criteria that will be used for each program
        $criteriaTemplates = [
            [
                'title' => 'Academic Performance',
                'description' => 'Evaluation based on high school GPA and academic records',
                'max_score' => 100,
                'min_score' => 0,
                'weight' => 40,
                'is_active' => true,
            ],
            [
                'title' => 'Entrance Examination',
                'description' => 'Score from the standardized entrance examination',
                'max_score' => 100,
                'min_score' => 0,
                'weight' => 30,
                'is_active' => true,
            ],
            [
                'title' => 'Interview Assessment',
                'description' => 'Evaluation from the admission interview panel',
                'max_score' => 100,
                'min_score' => 0,
                'weight' => 15,
                'is_active' => true,
            ],
            [
                'title' => 'Extracurricular Activities',
                'description' => 'Participation and achievements in extracurricular activities',
                'max_score' => 100,
                'min_score' => 0,
                'weight' => 10,
                'is_active' => true,
            ],
            [
                'title' => 'Community Involvement',
                'description' => 'Community service and social involvement activities',
                'max_score' => 100,
                'min_score' => 0,
                'weight' => 5,
                'is_active' => true,
            ],
        ];

        // Create exactly 5 criteria for each academic program and school year
        foreach ($academicPrograms as $program) {
            foreach ($schoolYears as $schoolYear) {
                foreach ($criteriaTemplates as $template) {
                    AcademicProgramCriteria::create([
                        'academic_program_id' => $program->id,
                        'school_year_id' => $schoolYear->id,
                        'title' => $template['title'],
                        'description' => $template['description'],
                        'max_score' => $template['max_score'],
                        'min_score' => $template['min_score'],
                        'weight' => $template['weight'],
                        'is_active' => $template['is_active'],
                    ]);
                }
            }
        }
    }
}

