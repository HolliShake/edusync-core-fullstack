<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\Campus;
use Illuminate\Database\Seeder;

class BuildingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the Main Campus (assuming it's the first one)
        $mainCampus = Campus::where('short_name', 'MC')->first();

        if (!$mainCampus) {
            // If no campus exists, create a default one
            $mainCampus = Campus::create([
                'name' => 'Main Campus',
                'short_name' => 'MC',
                'address' => 'Cagayan de Oro City, Misamis Oriental, Philippines'
            ]);
        }

        $buildings = [
            [
                'name' => 'Main Building',
                'short_name' => 'MB',
                'latitude' => 8.4857,
                'longitude' => 124.6565,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'Engineering Building',
                'short_name' => 'EB',
                'latitude' => 8.4858,
                'longitude' => 124.6566,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'Information Technology Building',
                'short_name' => 'ITB',
                'latitude' => 8.4859,
                'longitude' => 124.6567,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'Science and Mathematics Building',
                'short_name' => 'SMB',
                'latitude' => 8.4860,
                'longitude' => 124.6568,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'College of Technology Building',
                'short_name' => 'CTB',
                'latitude' => 8.4861,
                'longitude' => 124.6569,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'Graduate School Building',
                'short_name' => 'GSB',
                'latitude' => 8.4862,
                'longitude' => 124.6570,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'Library Building',
                'short_name' => 'LB',
                'latitude' => 8.4863,
                'longitude' => 124.6571,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'Student Center',
                'short_name' => 'SC',
                'latitude' => 8.4864,
                'longitude' => 124.6572,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'Physical Education and Sports Complex',
                'short_name' => 'PESC',
                'latitude' => 8.4865,
                'longitude' => 124.6573,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'Administration Building',
                'short_name' => 'AB',
                'latitude' => 8.4866,
                'longitude' => 124.6574,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'Research and Development Center',
                'short_name' => 'RDC',
                'latitude' => 8.4867,
                'longitude' => 124.6575,
                'campus_id' => $mainCampus->id
            ],
            [
                'name' => 'Teacher Education Building',
                'short_name' => 'TEB',
                'latitude' => 8.4868,
                'longitude' => 124.6576,
                'campus_id' => $mainCampus->id
            ]
        ];

        foreach ($buildings as $building) {
            Building::create($building);
        }
    }
}

