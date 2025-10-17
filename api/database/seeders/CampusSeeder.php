<?php

namespace Database\Seeders;

use App\Models\Campus;
use Illuminate\Database\Seeder;

class CampusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $campuses = [
            [
                'name' => 'Main Campus',
                'short_name' => 'MC',
                'address' => '123 University Avenue, Metro Manila, Philippines'
            ],
            [
                'name' => 'North Campus',
                'short_name' => 'NC',
                'address' => '456 North Street, Quezon City, Philippines'
            ],
            [
                'name' => 'South Campus',
                'short_name' => 'SC',
                'address' => '789 South Boulevard, Makati City, Philippines'
            ],
            [
                'name' => 'East Campus',
                'short_name' => 'EC',
                'address' => '321 East Road, Pasig City, Philippines'
            ],
            [
                'name' => 'West Campus',
                'short_name' => 'WC',
                'address' => '654 West Avenue, Manila, Philippines'
            ]
        ];

        foreach ($campuses as $campus) {
            Campus::create($campus);
        }
    }
}
