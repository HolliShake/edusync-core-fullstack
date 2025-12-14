<?php

namespace Database\Seeders;

use App\Models\Requirement;
use App\Models\UniversityAdmission;
use App\Models\UniversityAdmissionCriteria;
use App\Enum\RequirementTypeEnum;
use Illuminate\Database\Seeder;

class UniversityAdmissionCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $universityAdmission = UniversityAdmission::latest('id')->first();

        if (!$universityAdmission) {
            return;
        }

        // Get admission requirements
        $requirements = Requirement::where('requirement_type', RequirementTypeEnum::ADMISSION->value)
            ->limit(5)
            ->get();

        foreach ($requirements as $index => $requirement) {
            UniversityAdmissionCriteria::create([
                'university_admission_id' => $universityAdmission->id,
                'requirement_id' => $requirement->id,
                'title' => $requirement->requirement_name,
                'description' => $requirement->description,
                'max_score' => 100,
                'min_score' => 75,
                'weight' => 20, // Equal weight for 5 items
                'is_active' => true,
                'file_suffix' => 'pdf,jpg,png', // Default file types
            ]);
        }
    }
}

