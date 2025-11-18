<?php

namespace App\Service;

use App\Interface\IService\ISectionTeacherService;
use App\Interface\IRepo\ISectionTeacherRepo;
use Illuminate\Database\Eloquent\Collection;

class SectionTeacherService extends GenericService implements ISectionTeacherService
{
    public function __construct(ISectionTeacherRepo $sectionTeacherRepository)
    {
        parent::__construct($sectionTeacherRepository);
    }


    public function getSectionTeachersByCampusId(int $campusId, int $schoolYearId, int $page = 1, int $rows = 10)
    {
        $query = $this->repository->query()
            ->select('section_teacher.*')
            ->whereHas('section.curriculumDetail.curriculum.academicProgram.college.campus', function ($subQuery) use ($campusId) {
                $subQuery->where('id', $campusId);
            })
            ->whereHas('section.curriculumDetail.curriculum.schoolYear', function ($subQuery) use ($schoolYearId) {
                $subQuery->where('id', $schoolYearId);
            })
            ->with('user')
            ->groupBy('user_id', 'section_teacher.id', 'section_teacher.section_id', 'section_teacher.created_at', 'section_teacher.updated_at')
            ->skip(($page-1) * $rows)
            ->take($rows);

        $total_count = $query->count();
        $result = $query->get();

        $grouped = [];
        foreach ($result as $item) {
            $grouped[$item['user']['name']][] = $item;
        }

        return new \Illuminate\Pagination\LengthAwarePaginator($grouped, $total_count, $rows, $page);
    }

    public function getSectionTeachersByProgramId(int $academicProgramId, int $schoolYearId, int $page = 1, int $rows = 10)
    {
        $query = $this->repository->query()
            ->select('section_teacher.*')
            ->whereHas('section.curriculumDetail.curriculum', function ($query) use ($academicProgramId) {
                $query->where('academic_program_id', $academicProgramId);
            })
            ->whereHas('section.curriculumDetail.curriculum.schoolYear', function ($query) use ($schoolYearId) {
                $query->where('id', $schoolYearId);
            })  
            ->with('user')
            ->groupBy('user_id', 'section_teacher.id', 'section_teacher.section_id', 'section_teacher.created_at', 'section_teacher.updated_at')
            ->skip(($page-1) * $rows)
            ->take($rows);

        $total_count = $query->count();
        $result = $query->get();

        $grouped = [];
        foreach ($result as $item) {
            $grouped[$item['user']['name']][] = $item;
        }

        return new \Illuminate\Pagination\LengthAwarePaginator($grouped, $total_count, $rows, $page);
    }
}
