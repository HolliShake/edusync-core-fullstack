<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\TestingCenter;
use Illuminate\Database\Seeder;

class TestingCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some rooms to be testing centers
        // Prefer Lecture Rooms and Auditoriums
        $rooms = Room::where('name', 'like', '%Lecture Room%')
            ->orWhere('name', 'like', '%Auditorium%')
            ->orWhere('name', 'like', '%Conference%')
            ->limit(5)
            ->get();

        if ($rooms->isEmpty()) {
            // Fallback to any rooms
            $rooms = Room::limit(5)->get();
        }

        foreach ($rooms as $index => $room) {
            TestingCenter::create([
                'room_id' => $room->id,
                'code' => 'TC-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
            ]);
        }
    }
}

