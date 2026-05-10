<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\AcademicProgram;
use App\Models\AcademicTerm;
use App\Models\Curriculum;
use App\Enum\CurriculumStateEnum;
use Illuminate\Database\Seeder;

class CurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicPrograms = AcademicProgram::query()->get(['id', 'short_name', 'program_name']);
        $academicTermIds = AcademicTerm::query()->pluck('id')->all();
        $now = Carbon::now();

        if ($academicPrograms->isEmpty() || $academicTermIds === []) {
            return;
        }

        $curriculumRows = [];

        foreach ($academicPrograms as $program) {
            $curricula = [
                [
                    'curriculum_code' => $program->short_name . '-' . $program->id . '-2024-001',
                    'curriculum_name' => $program->program_name . ' - 2024 Curriculum',
                    'description' => 'Updated curriculum for ' . $program->program_name . ' effective 2024',
                    'effective_year' => 2024,
                    'status' => CurriculumStateEnum::ACTIVE->value,
                    'approved_date' => '2024-01-15',
                ],
                [
                    'curriculum_code' => $program->short_name . '-' . $program->id . '-2023-001',
                    'curriculum_name' => $program->program_name . ' - 2023 Curriculum',
                    'description' => 'Previous curriculum for ' . $program->program_name . ' effective 2023',
                    'effective_year' => 2023,
                    'status' => CurriculumStateEnum::INACTIVE->value,
                    'approved_date' => '2023-01-15',
                ],
                [
                    'curriculum_code' => $program->short_name . '-' . $program->id . '-2022-001',
                    'curriculum_name' => $program->program_name . ' - 2022 Curriculum',
                    'description' => 'Legacy curriculum for ' . $program->program_name . ' effective 2022',
                    'effective_year' => 2022,
                    'status' => CurriculumStateEnum::ARCHIVED->value,
                    'approved_date' => '2022-01-15',
                ],
            ];

            foreach ($curricula as $curriculumData) {
                $curriculumRows[] = [
                    'academic_program_id' => $program->id,
                    'academic_term_id' => $academicTermIds[array_rand($academicTermIds)],
                    'curriculum_code' => $curriculumData['curriculum_code'],
                    'curriculum_name' => $curriculumData['curriculum_name'],
                    'description' => $curriculumData['description'],
                    'effective_year' => $curriculumData['effective_year'],
                    'total_units' => random_int(120, 180),
                    'total_hours' => random_int(2400, 3600),
                    'status' => $curriculumData['status'],
                    'approved_date' => $curriculumData['approved_date'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        foreach (array_chunk($curriculumRows, 500) as $chunk) {
            Curriculum::query()->insertOrIgnore($chunk);
        }
    }
}
