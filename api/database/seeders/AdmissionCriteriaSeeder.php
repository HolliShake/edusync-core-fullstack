<?php

namespace Database\Seeders;

use App\Models\AdmissionCriteria;
use App\Models\AcademicProgram;
use App\Models\AdmissionSchedule;
use App\Models\Requirement;
use Illuminate\Database\Seeder;

class AdmissionCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicPrograms = AcademicProgram::all();
        $admissionSchedules = AdmissionSchedule::all();
        $requirements = Requirement::all();

        // Define exactly 5 criteria that will be used for each program
        $criteriaTemplates = [
            [
                'title' => 'Academic Performance',
                'description' => 'Evaluation based on high school GPA and academic records',
                'max_score' => 100,
                'min_score' => 0,
                'weight' => 40,
                'is_active' => true,
                'file_suffix' => 'academic_performance',
            ],
            [
                'title' => 'Entrance Examination',
                'description' => 'Score from the standardized entrance examination',
                'max_score' => 100,
                'min_score' => 0,
                'weight' => 30,
                'is_active' => true,
                'file_suffix' => 'entrance_exam',
            ],
            [
                'title' => 'Interview Assessment',
                'description' => 'Evaluation from the admission interview panel',
                'max_score' => 100,
                'min_score' => 0,
                'weight' => 15,
                'is_active' => true,
                'file_suffix' => 'interview',
            ],
            [
                'title' => 'Extracurricular Activities',
                'description' => 'Participation and achievements in extracurricular activities',
                'max_score' => 100,
                'min_score' => 0,
                'weight' => 10,
                'is_active' => true,
                'file_suffix' => 'extracurricular',
            ],
            [
                'title' => 'Community Involvement',
                'description' => 'Community service and social involvement activities',
                'max_score' => 100,
                'min_score' => 0,
                'weight' => 5,
                'is_active' => true,
                'file_suffix' => 'community',
            ],
        ];

        // Create exactly 5 criteria for each academic program and admission schedule
        foreach ($academicPrograms as $program) {
            foreach ($admissionSchedules as $admissionSchedule) {
                foreach ($criteriaTemplates as $index => $template) {
                    // Use a requirement if available, otherwise use the first one or null
                    $requirement = $requirements->get($index % $requirements->count());
                    
                    AdmissionCriteria::create([
                        'academic_program_id' => $program->id,
                        'admission_schedule_id' => $admissionSchedule->id,
                        'requirement_id' => $requirement ? $requirement->id : $requirements->first()->id,
                        'title' => $template['title'],
                        'description' => $template['description'],
                        'max_score' => $template['max_score'],
                        'min_score' => $template['min_score'],
                        'weight' => $template['weight'],
                        'is_active' => $template['is_active'],
                        'file_suffix' => $template['file_suffix'],
                    ]);
                }
            }
        }
    }
}
