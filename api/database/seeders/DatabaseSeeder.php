<?php

namespace Database\Seeders;

use Database\Seeders\AcademicTermSeeder;
use Database\Seeders\ProgramTypeSeeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\CourseSeeder;
use Database\Seeders\CampusSeeder;
use Database\Seeders\CollegeSeeder;
use Database\Seeders\AcademicProgramSeeder;
use Database\Seeders\CurriculumSeeder;
use Database\Seeders\CurriculumDetailSeeder;
use Database\Seeders\SchoolYearSeeder;
use Database\Seeders\AcademicCalendarSeeder;
use Database\Seeders\BuildingSeeder;
use Database\Seeders\RoomSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AcademicTermSeeder::class,
            UserSeeder::class,
            ProgramTypeSeeder::class,
            CourseSeeder::class,
            CampusSeeder::class,
            CollegeSeeder::class,
            AcademicProgramSeeder::class,
            CurriculumSeeder::class,
            CurriculumDetailSeeder::class,
            SchoolYearSeeder::class,
            AcademicCalendarSeeder::class,
            BuildingSeeder::class,
            RoomSeeder::class
        ]);
    }
}
