<?php

namespace App\Interface\IService;

interface ISectionService extends IGenericService
{
    // Add custom service methods here

    /**
     * Generate sections for a curriculum and year
     *
     * @param array $config Configuration array with keys:
     *                      - curriculum_id: integer
     *                      - year_order: integer
     *                      - term_order: integer
     *                      - auto_post: boolean (default: false)
     *                      - number_of_section: integer
     *                      - school_year_id: integer
     * @return array Array of created sections
     */
    public function generate(array $config): array;
}
