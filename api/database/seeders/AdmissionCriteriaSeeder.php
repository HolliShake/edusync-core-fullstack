<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\AdmissionCriteria;
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
        $admissionSchedules = AdmissionSchedule::query()->get(['id', 'academic_program_id']);
        $requirementIds = Requirement::query()->pluck('id')->all();

        if ($admissionSchedules->isEmpty() || $requirementIds === []) {
            return;
        }

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

        $rows = [];
        $now = Carbon::now();
        $requirementCount = count($requirementIds);

        foreach ($admissionSchedules as $admissionSchedule) {
            foreach ($criteriaTemplates as $index => $template) {
                $rows[] = [
                    'academic_program_id' => $admissionSchedule->academic_program_id,
                    'admission_schedule_id' => $admissionSchedule->id,
                    'requirement_id' => $requirementIds[$index % $requirementCount],
                    'title' => $template['title'],
                    'description' => $template['description'],
                    'max_score' => $template['max_score'],
                    'min_score' => $template['min_score'],
                    'weight' => $template['weight'],
                    'is_active' => $template['is_active'],
                    'file_suffix' => $template['file_suffix'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        foreach (array_chunk($rows, 500) as $chunk) {
            AdmissionCriteria::query()->insertOrIgnore($chunk);
        }
    }
}
