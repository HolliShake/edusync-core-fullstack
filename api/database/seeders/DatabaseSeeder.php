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
use Database\Seeders\RequirementSeeder;
use Database\Seeders\AdmissionScheduleSeeder;
use Database\Seeders\AcademicProgramRequirementSeeder;
use Database\Seeders\AcademicProgramCriteriaSeeder;
use Database\Seeders\AdmissionApplicationSeeder;
use Database\Seeders\SectionSeeder;
use Database\Seeders\EnrollmentSeeder;
use Database\Seeders\EnrollmentLogSeeder;
use Database\Seeders\AdmissionApplicationLogSeeder;
use Database\Seeders\AdmissionApplicationScoreSeeder;
use Database\Seeders\DesignitionSeeder;
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
            // Foundation seeders (no dependencies)
            AcademicTermSeeder::class,
            ProgramTypeSeeder::class,
            CampusSeeder::class,
            CollegeSeeder::class,
            CourseSeeder::class,
            RequirementSeeder::class,
            DocumentTypeSeeder::class,

            // User and basic data
            UserSeeder::class,
            SchoolYearSeeder::class,
            AcademicCalendarSeeder::class,
            BuildingSeeder::class,
            RoomSeeder::class,

            // Academic programs and curriculum
            AcademicProgramSeeder::class,
            CurriculumSeeder::class,
            CurriculumDetailSeeder::class,
            AcademicProgramRequirementSeeder::class,
            AcademicProgramCriteriaSeeder::class,

            // Designations (needs AcademicProgram)
            DesignitionSeeder::class,

            // Sections (needs CurriculumDetail, SchoolYear)
            SectionSeeder::class,

            // Admission applications (needs SchoolYear, AcademicProgram, Users)
            AdmissionApplicationSeeder::class,
            AdmissionApplicationLogSeeder::class,
            AdmissionApplicationScoreSeeder::class,

            // Enrollments (needs Sections, Users)
            EnrollmentSeeder::class,
            EnrollmentLogSeeder::class,

            // Schedules (needs other data)
            AdmissionScheduleSeeder::class,
        ]);
    }
}
