<?php

namespace Database\Seeders;

use App\Models\SchoolYear;
use App\Models\UniversityAdmission;
use Illuminate\Database\Seeder;

class UniversityAdmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the active school year
        $schoolYear = SchoolYear::where('is_active', true)->first();

        if (!$schoolYear) {
            // Fallback if no active school year exists, though SchoolYearSeeder should ensure one
            $schoolYear = SchoolYear::latest('id')->first();
        }

        if ($schoolYear) {
            UniversityAdmission::create([
                'school_year_id' => $schoolYear->id,
                'open_date' => $schoolYear->start_date,
                'close_date' => $schoolYear->end_date,
                'is_open_override' => false,
            ]);
        }
    }
}

