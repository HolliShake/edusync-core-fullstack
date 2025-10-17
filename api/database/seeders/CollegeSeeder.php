<?php

namespace Database\Seeders;

use App\Models\Campus;
use App\Models\College;
use Illuminate\Database\Seeder;

class CollegeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $campuses = Campus::all();
        
        $colleges = [
            [
                'college_name' => 'College of Computer Studies',
                'college_shortname' => 'CCS'
            ],
            [
                'college_name' => 'College of Engineering',
                'college_shortname' => 'COE'
            ],
            [
                'college_name' => 'College of Business Administration',
                'college_shortname' => 'CBA'
            ],
            [
                'college_name' => 'College of Education',
                'college_shortname' => 'COED'
            ],
            [
                'college_name' => 'College of Arts and Sciences',
                'college_shortname' => 'CAS'
            ],
            [
                'college_name' => 'College of Nursing',
                'college_shortname' => 'CON'
            ],
            [
                'college_name' => 'College of Architecture',
                'college_shortname' => 'COA'
            ],
            [
                'college_name' => 'College of Medicine',
                'college_shortname' => 'COM'
            ]
        ];

        foreach ($campuses as $campus) {
            foreach ($colleges as $college) {
                College::create([
                    'college_name' => $college['college_name'],
                    'college_shortname' => $college['college_shortname'],
                    'campus_id' => $campus->id
                ]);
            }
        }
    }
}
