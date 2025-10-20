<?php

namespace Database\Seeders;

use App\Models\AcademicProgramRequirement;
use App\Models\AcademicProgram;
use App\Models\Requirement;
use App\Models\SchoolYear;
use App\Enum\RequirementTypeEnum;
use Illuminate\Database\Seeder;

class AcademicProgramRequirementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicPrograms = AcademicProgram::all();
        $schoolYears = SchoolYear::all();

        // Get requirements by type
        $admissionRequirements = Requirement::where('requirement_type', RequirementTypeEnum::ADMISSION->value)
            ->where('is_active', true)
            ->get();

        $enrollmentRequirements = Requirement::where('requirement_type', RequirementTypeEnum::ENROLLMENT->value)
            ->where('is_active', true)
            ->get();

        $graduationRequirements = Requirement::where('requirement_type', RequirementTypeEnum::GRADUATION->value)
            ->where('is_active', true)
            ->get();

        $generalRequirements = Requirement::where('requirement_type', RequirementTypeEnum::GENERAL->value)
            ->where('is_active', true)
            ->get();

        // For each academic program and school year, create exactly 5 requirements
        foreach ($academicPrograms as $program) {
            foreach ($schoolYears as $schoolYear) {
                // Track which requirements have been added to avoid duplicates
                $addedRequirements = [];

                // 1. Add 3 mandatory admission requirements
                $mandatoryAdmissionReqs = $admissionRequirements
                    ->where('is_mandatory', true)
                    ->shuffle()
                    ->take(3);

                foreach ($mandatoryAdmissionReqs as $requirement) {
                    AcademicProgramRequirement::create([
                        'academic_program_id' => $program->id,
                        'requirement_id' => $requirement->id,
                        'school_year_id' => $schoolYear->id,
                        'is_mandatory' => true,
                        'is_active' => true,
                    ]);
                    $addedRequirements[] = $requirement->id;
                }

                // 2. Add 1 enrollment requirement
                $enrollmentReqs = $enrollmentRequirements
                    ->whereNotIn('id', $addedRequirements)
                    ->shuffle()
                    ->take(1);

                foreach ($enrollmentReqs as $requirement) {
                    AcademicProgramRequirement::create([
                        'academic_program_id' => $program->id,
                        'requirement_id' => $requirement->id,
                        'school_year_id' => $schoolYear->id,
                        'is_mandatory' => $requirement->is_mandatory,
                        'is_active' => true,
                    ]);
                    $addedRequirements[] = $requirement->id;
                }

                // 3. Add 1 graduation requirement
                $gradReqs = $graduationRequirements
                    ->whereNotIn('id', $addedRequirements)
                    ->shuffle()
                    ->take(1);

                foreach ($gradReqs as $requirement) {
                    AcademicProgramRequirement::create([
                        'academic_program_id' => $program->id,
                        'requirement_id' => $requirement->id,
                        'school_year_id' => $schoolYear->id,
                        'is_mandatory' => true,
                        'is_active' => true,
                    ]);
                    $addedRequirements[] = $requirement->id;
                }

                // 4. If we still need more to reach exactly 5, add from remaining requirements
                $currentCount = count($addedRequirements);
                if ($currentCount < 5) {
                    $remainingNeeded = 5 - $currentCount;

                    // Try to add from general requirements first
                    $additionalReqs = $generalRequirements
                        ->whereNotIn('id', $addedRequirements)
                        ->shuffle()
                        ->take($remainingNeeded);

                    // If not enough general requirements, add from any remaining requirements
                    if ($additionalReqs->count() < $remainingNeeded) {
                        $allRemainingReqs = $admissionRequirements
                            ->merge($enrollmentRequirements)
                            ->merge($graduationRequirements)
                            ->merge($generalRequirements)
                            ->whereNotIn('id', $addedRequirements)
                            ->shuffle()
                            ->take($remainingNeeded);

                        $additionalReqs = $allRemainingReqs;
                    }

                    foreach ($additionalReqs as $requirement) {
                        AcademicProgramRequirement::create([
                            'academic_program_id' => $program->id,
                            'requirement_id' => $requirement->id,
                            'school_year_id' => $schoolYear->id,
                            'is_mandatory' => false,
                            'is_active' => true,
                        ]);
                    }
                }
            }
        }
    }
}
