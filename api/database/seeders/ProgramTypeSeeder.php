<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProgramType;

class ProgramTypeSeeder extends Seeder
{
    public function run(): void
    {
        $programTypes = [
            [
                'id' => 1,
                'name' => 'Degree Programs',
            ],
            [
                'id' => 2,
                'name' => 'Non-Degree Programs',
            ],
            [
                'id' => 3,
                'name' => 'Terminal Programs',
            ],
            [
                'id' => 4,
                'name' => 'Continuing Education Programs',
            ],
            [
                'id' => 5,
                'name' => 'Certificate and Diploma Program',
            ],
            [
                'id' => 6,
                'name' => 'Professional Programs',
            ],
            [
                'id' => 7,
                'name' => 'Vocational and Technical Programs',
            ],
        ];

        foreach ($programTypes as $programType) {
            ProgramType::create($programType);
        }
    }
}
