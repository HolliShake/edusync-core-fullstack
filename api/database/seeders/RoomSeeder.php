<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\Building;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get buildings by short name
        $mainBuilding = Building::where('short_name', 'MB')->first();
        $engineeringBuilding = Building::where('short_name', 'EB')->first();
        $itBuilding = Building::where('short_name', 'ITB')->first();
        $scienceBuilding = Building::where('short_name', 'SMB')->first();
        $technologyBuilding = Building::where('short_name', 'CTB')->first();
        $libraryBuilding = Building::where('short_name', 'LB')->first();

        $rooms = [];

        // Main Building Rooms
        if ($mainBuilding) {
            $rooms = array_merge($rooms, [
                // Ground Floor
                ['name' => 'Main Auditorium', 'short_name' => 'MA', 'building_id' => $mainBuilding->id, 'floor' => 1, 'room_code' => 'MB-G101', 'is_lab' => false, 'room_capacity' => 500],
                ['name' => 'Conference Room 1', 'short_name' => 'CR1', 'building_id' => $mainBuilding->id, 'floor' => 1, 'room_code' => 'MB-G102', 'is_lab' => false, 'room_capacity' => 50],
                ['name' => 'Faculty Lounge', 'short_name' => 'FL', 'building_id' => $mainBuilding->id, 'floor' => 1, 'room_code' => 'MB-G103', 'is_lab' => false, 'room_capacity' => 30],

                // Second Floor
                ['name' => 'Lecture Room 201', 'short_name' => 'LR201', 'building_id' => $mainBuilding->id, 'floor' => 2, 'room_code' => 'MB-201', 'is_lab' => false, 'room_capacity' => 60],
                ['name' => 'Lecture Room 202', 'short_name' => 'LR202', 'building_id' => $mainBuilding->id, 'floor' => 2, 'room_code' => 'MB-202', 'is_lab' => false, 'room_capacity' => 60],
                ['name' => 'Lecture Room 203', 'short_name' => 'LR203', 'building_id' => $mainBuilding->id, 'floor' => 2, 'room_code' => 'MB-203', 'is_lab' => false, 'room_capacity' => 45],
                ['name' => 'Lecture Room 204', 'short_name' => 'LR204', 'building_id' => $mainBuilding->id, 'floor' => 2, 'room_code' => 'MB-204', 'is_lab' => false, 'room_capacity' => 45],

                // Third Floor
                ['name' => 'Lecture Room 301', 'short_name' => 'LR301', 'building_id' => $mainBuilding->id, 'floor' => 3, 'room_code' => 'MB-301', 'is_lab' => false, 'room_capacity' => 50],
                ['name' => 'Lecture Room 302', 'short_name' => 'LR302', 'building_id' => $mainBuilding->id, 'floor' => 3, 'room_code' => 'MB-302', 'is_lab' => false, 'room_capacity' => 50],
                ['name' => 'Lecture Room 303', 'short_name' => 'LR303', 'building_id' => $mainBuilding->id, 'floor' => 3, 'room_code' => 'MB-303', 'is_lab' => false, 'room_capacity' => 40],
            ]);
        }

        // Engineering Building Rooms
        if ($engineeringBuilding) {
            $rooms = array_merge($rooms, [
                // Ground Floor
                ['name' => 'Civil Engineering Laboratory', 'short_name' => 'CELab', 'building_id' => $engineeringBuilding->id, 'floor' => 1, 'room_code' => 'EB-G101', 'is_lab' => true, 'room_capacity' => 35],
                ['name' => 'Materials Testing Lab', 'short_name' => 'MTL', 'building_id' => $engineeringBuilding->id, 'floor' => 1, 'room_code' => 'EB-G102', 'is_lab' => true, 'room_capacity' => 25],
                ['name' => 'Surveying Laboratory', 'short_name' => 'SL', 'building_id' => $engineeringBuilding->id, 'floor' => 1, 'room_code' => 'EB-G103', 'is_lab' => true, 'room_capacity' => 30],

                // Second Floor
                ['name' => 'Mechanical Engineering Lab 1', 'short_name' => 'MEL1', 'building_id' => $engineeringBuilding->id, 'floor' => 2, 'room_code' => 'EB-201', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Mechanical Engineering Lab 2', 'short_name' => 'MEL2', 'building_id' => $engineeringBuilding->id, 'floor' => 2, 'room_code' => 'EB-202', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Engineering Drawing Room 1', 'short_name' => 'EDR1', 'building_id' => $engineeringBuilding->id, 'floor' => 2, 'room_code' => 'EB-203', 'is_lab' => false, 'room_capacity' => 40],
                ['name' => 'Engineering Drawing Room 2', 'short_name' => 'EDR2', 'building_id' => $engineeringBuilding->id, 'floor' => 2, 'room_code' => 'EB-204', 'is_lab' => false, 'room_capacity' => 40],

                // Third Floor
                ['name' => 'Electrical Engineering Lab 1', 'short_name' => 'EEL1', 'building_id' => $engineeringBuilding->id, 'floor' => 3, 'room_code' => 'EB-301', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Electrical Engineering Lab 2', 'short_name' => 'EEL2', 'building_id' => $engineeringBuilding->id, 'floor' => 3, 'room_code' => 'EB-302', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Electronics Laboratory', 'short_name' => 'EL', 'building_id' => $engineeringBuilding->id, 'floor' => 3, 'room_code' => 'EB-303', 'is_lab' => true, 'room_capacity' => 35],
                ['name' => 'Power Systems Laboratory', 'short_name' => 'PSL', 'building_id' => $engineeringBuilding->id, 'floor' => 3, 'room_code' => 'EB-304', 'is_lab' => true, 'room_capacity' => 25],
            ]);
        }

        // IT Building Rooms
        if ($itBuilding) {
            $rooms = array_merge($rooms, [
                // Ground Floor
                ['name' => 'Computer Laboratory 1', 'short_name' => 'CompLab1', 'building_id' => $itBuilding->id, 'floor' => 1, 'room_code' => 'ITB-G101', 'is_lab' => true, 'room_capacity' => 40],
                ['name' => 'Computer Laboratory 2', 'short_name' => 'CompLab2', 'building_id' => $itBuilding->id, 'floor' => 1, 'room_code' => 'ITB-G102', 'is_lab' => true, 'room_capacity' => 40],
                ['name' => 'Computer Laboratory 3', 'short_name' => 'CompLab3', 'building_id' => $itBuilding->id, 'floor' => 1, 'room_code' => 'ITB-G103', 'is_lab' => true, 'room_capacity' => 40],

                // Second Floor
                ['name' => 'Programming Laboratory 1', 'short_name' => 'ProgLab1', 'building_id' => $itBuilding->id, 'floor' => 2, 'room_code' => 'ITB-201', 'is_lab' => true, 'room_capacity' => 35],
                ['name' => 'Programming Laboratory 2', 'short_name' => 'ProgLab2', 'building_id' => $itBuilding->id, 'floor' => 2, 'room_code' => 'ITB-202', 'is_lab' => true, 'room_capacity' => 35],
                ['name' => 'Networking Laboratory', 'short_name' => 'NetLab', 'building_id' => $itBuilding->id, 'floor' => 2, 'room_code' => 'ITB-203', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Database Laboratory', 'short_name' => 'DBLab', 'building_id' => $itBuilding->id, 'floor' => 2, 'room_code' => 'ITB-204', 'is_lab' => true, 'room_capacity' => 30],

                // Third Floor
                ['name' => 'Web Development Laboratory', 'short_name' => 'WebLab', 'building_id' => $itBuilding->id, 'floor' => 3, 'room_code' => 'ITB-301', 'is_lab' => true, 'room_capacity' => 35],
                ['name' => 'Mobile Development Laboratory', 'short_name' => 'MobLab', 'building_id' => $itBuilding->id, 'floor' => 3, 'room_code' => 'ITB-302', 'is_lab' => true, 'room_capacity' => 35],
                ['name' => 'Multimedia Laboratory', 'short_name' => 'MMLab', 'building_id' => $itBuilding->id, 'floor' => 3, 'room_code' => 'ITB-303', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'IT Lecture Room 1', 'short_name' => 'ITLR1', 'building_id' => $itBuilding->id, 'floor' => 3, 'room_code' => 'ITB-304', 'is_lab' => false, 'room_capacity' => 50],

                // Fourth Floor
                ['name' => 'Cybersecurity Laboratory', 'short_name' => 'CyberLab', 'building_id' => $itBuilding->id, 'floor' => 4, 'room_code' => 'ITB-401', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'AI and Machine Learning Lab', 'short_name' => 'AILab', 'building_id' => $itBuilding->id, 'floor' => 4, 'room_code' => 'ITB-402', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Software Engineering Lab', 'short_name' => 'SELab', 'building_id' => $itBuilding->id, 'floor' => 4, 'room_code' => 'ITB-403', 'is_lab' => true, 'room_capacity' => 35],
                ['name' => 'IT Project Room', 'short_name' => 'ITPR', 'building_id' => $itBuilding->id, 'floor' => 4, 'room_code' => 'ITB-404', 'is_lab' => false, 'room_capacity' => 25],
            ]);
        }

        // Science and Mathematics Building Rooms
        if ($scienceBuilding) {
            $rooms = array_merge($rooms, [
                // Ground Floor
                ['name' => 'Chemistry Laboratory 1', 'short_name' => 'ChemLab1', 'building_id' => $scienceBuilding->id, 'floor' => 1, 'room_code' => 'SMB-G101', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Chemistry Laboratory 2', 'short_name' => 'ChemLab2', 'building_id' => $scienceBuilding->id, 'floor' => 1, 'room_code' => 'SMB-G102', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Chemical Storage Room', 'short_name' => 'CSR', 'building_id' => $scienceBuilding->id, 'floor' => 1, 'room_code' => 'SMB-G103', 'is_lab' => false, 'room_capacity' => 10],

                // Second Floor
                ['name' => 'Physics Laboratory 1', 'short_name' => 'PhysLab1', 'building_id' => $scienceBuilding->id, 'floor' => 2, 'room_code' => 'SMB-201', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Physics Laboratory 2', 'short_name' => 'PhysLab2', 'building_id' => $scienceBuilding->id, 'floor' => 2, 'room_code' => 'SMB-202', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Advanced Physics Laboratory', 'short_name' => 'APL', 'building_id' => $scienceBuilding->id, 'floor' => 2, 'room_code' => 'SMB-203', 'is_lab' => true, 'room_capacity' => 25],
                ['name' => 'Science Lecture Room 1', 'short_name' => 'SLR1', 'building_id' => $scienceBuilding->id, 'floor' => 2, 'room_code' => 'SMB-204', 'is_lab' => false, 'room_capacity' => 50],

                // Third Floor
                ['name' => 'Biology Laboratory 1', 'short_name' => 'BioLab1', 'building_id' => $scienceBuilding->id, 'floor' => 3, 'room_code' => 'SMB-301', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Biology Laboratory 2', 'short_name' => 'BioLab2', 'building_id' => $scienceBuilding->id, 'floor' => 3, 'room_code' => 'SMB-302', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Microbiology Laboratory', 'short_name' => 'MicroLab', 'building_id' => $scienceBuilding->id, 'floor' => 3, 'room_code' => 'SMB-303', 'is_lab' => true, 'room_capacity' => 25],
                ['name' => 'Biotechnology Laboratory', 'short_name' => 'BioTechLab', 'building_id' => $scienceBuilding->id, 'floor' => 3, 'room_code' => 'SMB-304', 'is_lab' => true, 'room_capacity' => 25],

                // Fourth Floor
                ['name' => 'Mathematics Computer Lab', 'short_name' => 'MathCompLab', 'building_id' => $scienceBuilding->id, 'floor' => 4, 'room_code' => 'SMB-401', 'is_lab' => true, 'room_capacity' => 35],
                ['name' => 'Mathematics Lecture Room 1', 'short_name' => 'MLR1', 'building_id' => $scienceBuilding->id, 'floor' => 4, 'room_code' => 'SMB-402', 'is_lab' => false, 'room_capacity' => 45],
                ['name' => 'Mathematics Lecture Room 2', 'short_name' => 'MLR2', 'building_id' => $scienceBuilding->id, 'floor' => 4, 'room_code' => 'SMB-403', 'is_lab' => false, 'room_capacity' => 45],
                ['name' => 'Statistics Laboratory', 'short_name' => 'StatLab', 'building_id' => $scienceBuilding->id, 'floor' => 4, 'room_code' => 'SMB-404', 'is_lab' => true, 'room_capacity' => 30],
            ]);
        }

        // College of Technology Building Rooms
        if ($technologyBuilding) {
            $rooms = array_merge($rooms, [
                // Ground Floor
                ['name' => 'Automotive Technology Workshop', 'short_name' => 'ATW', 'building_id' => $technologyBuilding->id, 'floor' => 1, 'room_code' => 'CTB-G101', 'is_lab' => true, 'room_capacity' => 25],
                ['name' => 'Welding and Fabrication Shop', 'short_name' => 'WFS', 'building_id' => $technologyBuilding->id, 'floor' => 1, 'room_code' => 'CTB-G102', 'is_lab' => true, 'room_capacity' => 20],
                ['name' => 'Machine Shop', 'short_name' => 'MS', 'building_id' => $technologyBuilding->id, 'floor' => 1, 'room_code' => 'CTB-G103', 'is_lab' => true, 'room_capacity' => 20],

                // Second Floor
                ['name' => 'Industrial Technology Laboratory', 'short_name' => 'ITL', 'building_id' => $technologyBuilding->id, 'floor' => 2, 'room_code' => 'CTB-201', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Electronics Technology Lab', 'short_name' => 'ETL', 'building_id' => $technologyBuilding->id, 'floor' => 2, 'room_code' => 'CTB-202', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Refrigeration and Aircon Lab', 'short_name' => 'RAL', 'building_id' => $technologyBuilding->id, 'floor' => 2, 'room_code' => 'CTB-203', 'is_lab' => true, 'room_capacity' => 25],
                ['name' => 'Technology Lecture Room 1', 'short_name' => 'TLR1', 'building_id' => $technologyBuilding->id, 'floor' => 2, 'room_code' => 'CTB-204', 'is_lab' => false, 'room_capacity' => 40],

                // Third Floor
                ['name' => 'Electrical Technology Lab', 'short_name' => 'ETechLab', 'building_id' => $technologyBuilding->id, 'floor' => 3, 'room_code' => 'CTB-301', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Mechanical Technology Lab', 'short_name' => 'MTL', 'building_id' => $technologyBuilding->id, 'floor' => 3, 'room_code' => 'CTB-302', 'is_lab' => true, 'room_capacity' => 30],
                ['name' => 'Technology Lecture Room 2', 'short_name' => 'TLR2', 'building_id' => $technologyBuilding->id, 'floor' => 3, 'room_code' => 'CTB-303', 'is_lab' => false, 'room_capacity' => 40],
                ['name' => 'Technology Lecture Room 3', 'short_name' => 'TLR3', 'building_id' => $technologyBuilding->id, 'floor' => 3, 'room_code' => 'CTB-304', 'is_lab' => false, 'room_capacity' => 40],
            ]);
        }

        // Library Building Rooms
        if ($libraryBuilding) {
            $rooms = array_merge($rooms, [
                // Ground Floor
                ['name' => 'Main Reading Hall', 'short_name' => 'MRH', 'building_id' => $libraryBuilding->id, 'floor' => 1, 'room_code' => 'LB-G101', 'is_lab' => false, 'room_capacity' => 200],
                ['name' => 'Digital Library', 'short_name' => 'DL', 'building_id' => $libraryBuilding->id, 'floor' => 1, 'room_code' => 'LB-G102', 'is_lab' => true, 'room_capacity' => 50],
                ['name' => 'Periodicals Section', 'short_name' => 'PS', 'building_id' => $libraryBuilding->id, 'floor' => 1, 'room_code' => 'LB-G103', 'is_lab' => false, 'room_capacity' => 50],

                // Second Floor
                ['name' => 'Reference Section', 'short_name' => 'RS', 'building_id' => $libraryBuilding->id, 'floor' => 2, 'room_code' => 'LB-201', 'is_lab' => false, 'room_capacity' => 100],
                ['name' => 'Study Room 1', 'short_name' => 'SR1', 'building_id' => $libraryBuilding->id, 'floor' => 2, 'room_code' => 'LB-202', 'is_lab' => false, 'room_capacity' => 20],
                ['name' => 'Study Room 2', 'short_name' => 'SR2', 'building_id' => $libraryBuilding->id, 'floor' => 2, 'room_code' => 'LB-203', 'is_lab' => false, 'room_capacity' => 20],
                ['name' => 'Study Room 3', 'short_name' => 'SR3', 'building_id' => $libraryBuilding->id, 'floor' => 2, 'room_code' => 'LB-204', 'is_lab' => false, 'room_capacity' => 20],

                // Third Floor
                ['name' => 'Thesis and Dissertation Room', 'short_name' => 'TDR', 'building_id' => $libraryBuilding->id, 'floor' => 3, 'room_code' => 'LB-301', 'is_lab' => false, 'room_capacity' => 60],
                ['name' => 'Filipiniana Section', 'short_name' => 'FS', 'building_id' => $libraryBuilding->id, 'floor' => 3, 'room_code' => 'LB-302', 'is_lab' => false, 'room_capacity' => 40],
                ['name' => 'Archives Room', 'short_name' => 'AR', 'building_id' => $libraryBuilding->id, 'floor' => 3, 'room_code' => 'LB-303', 'is_lab' => false, 'room_capacity' => 30],
            ]);
        }

        foreach ($rooms as $room) {
            Room::create($room);
        }
    }
}

