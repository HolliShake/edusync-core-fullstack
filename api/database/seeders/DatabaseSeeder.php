<?php

namespace Database\Seeders;

use Database\Seeders\AcademicTermSeeder;
use Database\Seeders\ProgramTypeSeeder;
use Database\Seeders\UserSeeder;
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
        ]);
    }
}
