<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolYear;
use Carbon\Carbon;

class SchoolYearSeeder extends Seeder
{
    public function run(): void
    {
        $currentYear = now()->year;
        $nextYear    = $currentYear + 1;
        $schoolYears = [
            [
                'school_year_code' => '2022-2023',
                'name' => 'AY 2022-2023',
                'start_date' => Carbon::create(2022, 6, 1),
                'end_date' => Carbon::create(2023, 5, 31),
                'is_active' => false,
            ],
            [
                'school_year_code' => '2023-2024',
                'name' => 'AY 2023-2024',
                'start_date' => Carbon::create(2023, 6, 1),
                'end_date' => Carbon::create(2024, 5, 31),
                'is_active' => false,
            ],
            [
                'school_year_code' => '2024-2025',
                'name' => 'AY 2024-2025',
                'start_date' => Carbon::create(2024, 6, 1),
                'end_date' => Carbon::create(2025, 5, 31),
                'is_active' => true,
            ],
            [
                'school_year_code' => $currentYear . '-' . $nextYear,
                'name' => 'AY ' . $currentYear . '-' . $nextYear,
                'start_date' => Carbon::create($currentYear, 6, 1),
                'end_date' => Carbon::create($nextYear, 5, 31),
                'is_active' => true,
            ]
        ];

        foreach ($schoolYears as $schoolYear) {
            SchoolYear::create($schoolYear);
        }
    }
}
