<?php

namespace App\Service;

use App\Interface\IService\IGradeBookService;
use App\Interface\IRepo\IGradeBookRepo;
use App\Interface\IRepo\ISectionRepo;
use Illuminate\Support\Facades\DB;

class GradeBookService extends GenericService implements IGradeBookService
{
    protected ISectionRepo $sectionRepository;

    public function __construct(IGradeBookRepo $gradeBookRepository, ISectionRepo $sectionRepository)
    {
        parent::__construct($gradeBookRepository);
        $this->sectionRepository = $sectionRepository;
    }

    public function generateFromTemplate(int $isTemplateGradeBookId, int $sectionId)
    {
        $templateGradeBook = $this->repository->getById($isTemplateGradeBookId);
        if (!$templateGradeBook) {
            throw new \Exception('Template grade book not found');
        }

        $section = $this->sectionRepository->getById($sectionId);
        if (!$section) {
            throw new \Exception('Section not found');
        }

        try {
            DB::beginTransaction();

            $gradeBook = $this->repository->create([
                'section_id'          => $sectionId,
                'academic_program_id' => $templateGradeBook->academic_program_id,
                'is_template'         => false,
                'title'               => $templateGradeBook->title . ' - ' . $section->name,
            ])->fresh();

            foreach ($templateGradeBook->gradebook_grading_periods as $gradingPeriod) {
                $gradeBookGradingPeriod = $gradeBook->gradebookGradingPeriods()->create([
                    'title'  => $gradingPeriod['title'],
                    'weight' => $gradingPeriod['weight']
                ])->fresh();

                foreach ($gradingPeriod['gradebook_items'] as $item) {
                    $gradeBookItem = $gradeBookGradingPeriod->gradebookItems()->create([
                        'title'  => $item['title'],
                        'weight' => $item['weight']
                    ])->fresh();

                    foreach ($item['gradebook_item_details'] as $detail) {
                        $gradeBookItem->gradebookItemDetails()->create([
                            'title'     => $detail['title'],
                            'min_score' => $detail['min_score'],
                            'max_score' => $detail['max_score'],
                            'weight'    => $detail['weight']
                        ])->fresh();
                    }
                }
            }

            DB::commit();

            return $gradeBook->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
