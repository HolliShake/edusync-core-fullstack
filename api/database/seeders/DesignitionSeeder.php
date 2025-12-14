<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Designition;
use App\Models\AcademicProgram;
use App\Models\User;
use App\Models\Campus;

class DesignitionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get required data
        $programChair = User::find(1); // User 1 will be our multi-role user
        
        if (!$programChair) {
            $this->command->warn('User 1 not found. Make sure UserSeeder has been run.');
            return;
        }

        $this->command->info('Assigning roles to User 1...');

        $designitionCount = 0;

        // 1. Assign Program Chair (Computer Science)
        $bscsProgram = AcademicProgram::where('short_name', 'BSCS')->first();
        
        if ($bscsProgram) {
            $existingProgramDesignition = Designition::where('user_id', 1)
                ->where('designitionable_type', AcademicProgram::class)
                ->where('designitionable_id', $bscsProgram->id)
                ->first();

            if (!$existingProgramDesignition) {
                Designition::create([
                    'user_id' => 1,
                    'designitionable_type' => AcademicProgram::class,
                    'designitionable_id' => $bscsProgram->id,
                    'is_active' => true,
                ]);
                $designitionCount++;
                $this->command->info("Assigned Program Chair to: {$bscsProgram->program_name}");
            }
        } else {
            $this->command->warn('BSCS Program not found.');
        }

        // 2. Assign College Dean (College of Computer Studies - CCS)
        $ccsCollege = \App\Models\College::where('college_shortname', 'CCS')->first();

        if ($ccsCollege) {
            $existingDeanDesignition = Designition::where('user_id', 1)
                ->where('designitionable_type', \App\Models\College::class)
                ->where('designitionable_id', $ccsCollege->id)
                ->first();

            if (!$existingDeanDesignition) {
                Designition::create([
                    'user_id' => 1,
                    'designitionable_type' => \App\Models\College::class,
                    'designitionable_id' => $ccsCollege->id,
                    'is_active' => true,
                ]);
                $designitionCount++;
                $this->command->info("Assigned College Dean to: {$ccsCollege->college_name}");
            }
        } else {
            $this->command->warn('CCS College not found.');
        }

        // 3. Assign Campus Registrar (First Campus)
        $campus = Campus::first();

        if ($campus) {
            $existingRegistrarDesignition = Designition::where('user_id', 1)
                ->where('designitionable_type', Campus::class)
                ->where('designitionable_id', $campus->id)
                ->first();

            if (!$existingRegistrarDesignition) {
                Designition::create([
                    'user_id' => 1,
                    'designitionable_type' => Campus::class,
                    'designitionable_id' => $campus->id,
                    'is_active' => true,
                ]);
                $designitionCount++;
                $this->command->info("Assigned Campus Registrar to: {$campus->name}");
            }
        } else {
            $this->command->warn('No Campus found.');
        }

        $this->command->info("Created {$designitionCount} designitions for User 1 successfully!");
    }
}
