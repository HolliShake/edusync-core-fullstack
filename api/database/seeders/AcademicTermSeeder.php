<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicTerm;

class AcademicTermSeeder extends Seeder
{
    public function run(): void
    {
        $academicTerms = [
            [
                'id' => 1,
                'name' => 'Semestral',
                'description' => 'Academic year divided into two semesters',
                'suffix' => 'Semester',
                'number_of_terms' => 2,
            ],
            [
                'id' => 2,
                'name' => 'Quarterly',
                'description' => 'Academic year divided into four quarters',
                'suffix' => 'Quarter',
                'number_of_terms' => 4,
            ],
        ];

        foreach ($academicTerms as $term) {
            AcademicTerm::create($term);
        }
    }
}
