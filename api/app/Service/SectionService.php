<?php

namespace App\Service;

use App\Interface\IRepo\ICurriculumRepo;
use App\Interface\IRepo\ICurriculumDetailRepo;
use App\Interface\IService\ISectionService;
use App\Interface\IRepo\ISectionRepo;
use Illuminate\Support\Str;

class SectionService extends GenericService implements ISectionService
{
    protected ICurriculumRepo $curriculumRepository;
    protected ICurriculumDetailRepo $curriculumDetailRepository;

    public function __construct(ISectionRepo $sectionRepository,
        ICurriculumRepo $curriculumRepository,
        ICurriculumDetailRepo $curriculumDetailRepository)
    {
        parent::__construct($sectionRepository);
        $this->curriculumRepository = $curriculumRepository;
        $this->curriculumDetailRepository = $curriculumDetailRepository;
    }

    /**
     * Generate sections for a curriculum and year
     *
     * @param array $config Configuration array with keys:
     *                      - curriculum_id: integer
     *                      - year_order: integer
     *                      - term_order: integer
     *                      - auto_post: boolean (default: false)
     *                      - number_of_section: integer
     * @return array Array of created sections
     */
    public function generate(array $config): array {
        $curriculum_id  = $config['curriculum_id'];
        $year_order     = $config['year_order'];
        $term_order     = $config['term_order'];
        $auto_post      = $config['auto_post'];
        $number_of_section = $config['number_of_section'];

        $curriculum = $this->curriculumRepository->getById($curriculum_id);

        $curriculum_details = $this->curriculumDetailRepository->query()
            ->with('course')
            ->where('curriculum_id', $curriculum_id)
            ->where('year_order', $year_order)
            ->where('term_order', $term_order)
            ->get()
            ->toArray();

        // Get the highest existing section suffix for this curriculum, year, term, and school year
        $existingSections = $this->repository->query()
            ->join('curriculum_detail', 'section.curriculum_detail_id', '=', 'curriculum_detail.id')
            ->where('curriculum_detail.curriculum_id', $curriculum_id)
            ->where('curriculum_detail.year_order', $year_order)
            ->where('curriculum_detail.term_order', $term_order)
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

        // Create multiple sections based on number_of_section
        for ($i = 0; $i < $number_of_section; $i++) {
            $sectionSuffix = $suffix . ($number > 1 ? $number : '');
            $sectionName = $curriculum['curriculum_code']  . '_section_' . $year_order . $sectionSuffix;

            $code = Str::random(8);

            while ($this->repository->query()->where('section_code', $code)->exists()) {
                $code = Str::random(8);
            }

            foreach ($curriculum_details as $curriculum_detail) {
                // Check if section already exists for this curriculum_detail and school_year
                $existingSection = $this->repository->query()
                    ->where('curriculum_detail_id', $curriculum_detail['id'])
                    ->where('section_name', $sectionName)
                    ->exists();

                // Skip if section already exists
                if ($existingSection) {
                    continue;
                }

                $rand = Str::random(8);

                $sections[] = [
                    'curriculum_detail_id' => $curriculum_detail['id'],
                    'section_ref'    => strtoupper($rand),
                    'section_code'   => strtoupper($code),
                    'section_name'   => $sectionName,
                    'min_students'   => 20,
                    'max_students'   => 40,
                    'is_posted'      => $auto_post,
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

        $result = $this->repository->createMultiple($sections);

        return $result;
    }

    public function deleteBySectionCode(string $section_code): void
    {
        $this->repository->query()->where('section_code', $section_code)->delete();
    }
}
