<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Section;
use App\Models\CurriculumDetail;
use App\Models\Curriculum;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all curriculums
        $curriculums = Curriculum::all();

        if ($curriculums->isEmpty()) {
            $this->command->warn('No curriculums found. Make sure CurriculumSeeder has been run.');
            return;
        }

        $this->command->info('Creating sections for curriculums...');

        foreach ($curriculums as $curriculum) {
            // Get unique year and term combinations for this curriculum
            $yearTermCombinations = CurriculumDetail::where('curriculum_id', $curriculum->id)
                ->select('year_order', 'term_order')
                ->distinct()
                ->get();

            foreach ($yearTermCombinations as $combination) {
                // Create 1-3 sections for each year-term combination
                $numberOfSections = rand(1, 3);

                $this->generateSectionsForYearTerm(
                    $curriculum->id,
                    $combination->year_order,
                    $combination->term_order,
                    $numberOfSections,
                    rand(0, 1) === 1 // Randomly post some sections
                );
            }
        }

        $this->command->info('Sections created successfully!');
    }

    /**
     * Generate sections for a curriculum and year-term combination
     * Based on SectionService::generate() logic
     */
    private function generateSectionsForYearTerm(
        int $curriculumId,
        int $yearOrder,
        int $termOrder,
        int $numberOfSections,
        bool $autoPost
    ): void {
        $curriculum = Curriculum::find($curriculumId);

        $curriculumDetails = CurriculumDetail::with('course')
            ->where('curriculum_id', $curriculumId)
            ->where('year_order', $yearOrder)
            ->where('term_order', $termOrder)
            ->get();

        if ($curriculumDetails->isEmpty()) {
            return;
        }

        // Get the highest existing section suffix for this curriculum, year, term
        $existingSections = Section::join('curriculum_detail', 'section.curriculum_detail_id', '=', 'curriculum_detail.id')
            ->where('curriculum_detail.curriculum_id', $curriculumId)
            ->where('curriculum_detail.year_order', $yearOrder)
            ->where('curriculum_detail.term_order', $termOrder)
            ->orderBy('section.section_name', 'desc')
            ->pluck('section.section_name')
            ->toArray();

        // Determine starting section suffix
        $suffix = 'A';
        $number = 1;

        if (!empty($existingSections)) {
            $lastSection = $existingSections[0];
            // Extract suffix from last section name (e.g., "CS_section_1B2" -> "B2")
            if (preg_match('/_section_\d+([A-Z])(\d*)$/', $lastSection, $matches)) {
                $lastLetter = $matches[1];
                $lastNumber = $matches[2] !== '' ? (int)$matches[2] : 1;

                if ($lastLetter === 'Z') {
                    $suffix = 'A';
                    $number = $lastNumber + 1;
                } else {
                    $suffix = chr(ord($lastLetter) + 1);
                    $number = $lastNumber;
                }
            }
        }

        $sections = [];

        // Create multiple sections based on numberOfSections
        for ($i = 0; $i < $numberOfSections; $i++) {
            $sectionSuffix = $suffix . ($number > 1 ? $number : '');
            $sectionName = $curriculum->curriculum_code . '_section_' . $yearOrder . $sectionSuffix;

            // Generate unique section_code for this group of sections
            $code = strtoupper(Str::random(8));
            while (Section::where('section_code', $code)->exists()) {
                $code = strtoupper(Str::random(8));
            }

            foreach ($curriculumDetails as $curriculumDetail) {
                // Check if section already exists for this curriculum_detail
                $existingSection = Section::where('curriculum_detail_id', $curriculumDetail->id)
                    ->where('section_name', $sectionName)
                    ->exists();

                // Skip if section already exists
                if ($existingSection) {
                    continue;
                }

                // Generate unique section_ref
                $rand = strtoupper(Str::random(8));

                $sections[] = [
                    'curriculum_detail_id' => $curriculumDetail->id,
                    'section_ref' => $rand,
                    'section_code' => $code,
                    'section_name' => $sectionName,
                    'min_students' => 20,
                    'max_students' => 40,
                    'is_posted' => $autoPost,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Increment suffix for next section
            if ($suffix === 'Z') {
                $suffix = 'A';
                $number++;
            } else {
                $suffix = chr(ord($suffix) + 1);
            }
        }

        // Bulk insert sections
        if (!empty($sections)) {
            Section::insert($sections);
        }
    }
}
