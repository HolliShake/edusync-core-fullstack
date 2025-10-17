<?php

namespace App\Service;

use App\Interface\IService\ICurriculumDetailService;
use App\Interface\IRepo\ICurriculumDetailRepo;

class CurriculumDetailService extends GenericService implements ICurriculumDetailService
{
    public function __construct(ICurriculumDetailRepo $curriculumDetailRepository)
    {
        parent::__construct($curriculumDetailRepository);
    }

    public function createMultiple(array $data): array {
        try {
            $curriculum_id = $data['curriculum_id'];
            $year_order = $data['year_order'];
            $term_order = $data['term_order'];
            $term_alias = $data['term_alias'];
            $is_include_gwa = $data['is_include_gwa'];

            $courses = $data['courses'];

            $curriculumDetails = [];

            foreach ($courses as $course) {
                array_push($curriculumDetails, [
                    'curriculum_id' => $curriculum_id,
                    'year_order' => $year_order,
                    'term_order' => $term_order,
                    'term_alias' => $term_alias,
                    'is_include_gwa' => $is_include_gwa,
                    'course_id' => $course,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $result = $this->repository->createMultiple($curriculumDetails);

            return $result;

        } catch (\Exception $e) {
            throw $e;
        }
    }
}
