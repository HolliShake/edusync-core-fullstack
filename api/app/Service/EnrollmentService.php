<?php

namespace App\Service;

use App\Interface\IService\IEnrollmentService;
use App\Interface\IRepo\IEnrollmentRepo;
use Illuminate\Pagination\LengthAwarePaginator;

class EnrollmentService extends GenericService implements IEnrollmentService
{
    public function __construct(IEnrollmentRepo $enrollmentRepository)
    {
        parent::__construct($enrollmentRepository);
    }

    public function createMultiple(array $data): array
    {
        return $this->repository->createMultiple($data);
    }

    public function getScholasticFilterByCampusId(int $campusId, ?string $latestStatus, int $schoolYearId): array
    {
        $enrollments = $this->repository->query()
            ->select('enrollment.*')
            ->whereHas('section.curriculumDetail.curriculum.academicProgram.college.campus', function ($query) use ($campusId) {
                $query->where('id', $campusId);
            })
            ->when($latestStatus != null, function ($query) use ($latestStatus) {
                $query->whereHas('latestStatus', function ($subQuery) use ($latestStatus) {
                    $subQuery->where('action', $latestStatus);
                });
            })
            ->whereHas('section.curriculumDetail.curriculum.schoolYear', function ($subQuery) use ($schoolYearId) {
                $subQuery->where('id', $schoolYearId);
            })
            ->with('section.curriculumDetail.curriculum.academicTerm')
            ->join('section', 'enrollment.section_id', '=', 'section.id')
            ->join('curriculum_detail', 'section.curriculum_detail_id', '=', 'curriculum_detail.id')
            ->orderBy('curriculum_detail.year_order')
            ->orderBy('curriculum_detail.term_order')
            ->get();

        $years = [];
        $terms = [];

        foreach ($enrollments as $enrollment) {
            $yearOrder = $enrollment->section->curriculumDetail->year_order;
            $termOrder = $enrollment->section->curriculumDetail->term_order;
            $academicTerm = $enrollment->section->curriculumDetail->curriculum->academicTerm;

            // Add unique years
            if (!isset($years[$yearOrder])) {
                $years[$yearOrder] = [
                    'label' => 'Year ' . $yearOrder,
                    'value' => $yearOrder,
                    'parent_value' => null
                ];
            }

            // Add unique terms
            if (!isset($terms[$termOrder])) {
                $terms[$termOrder] = [
                    'label' => $academicTerm->suffix . ' ' . $termOrder,
                    'value' => $termOrder,
                    'parent_value' => $yearOrder
                ];
            }
        }

        return [
            'year' => array_values($years),
            'term' => array_values($terms)
        ];
    }

    public function getScholasticFilterByProgramId(int $academicProgramId, ?string $latestStatus, int $schoolYearId): array
    {
        $enrollments = $this->repository->query()
            ->select('enrollment.*')
            ->whereHas('section.curriculumDetail.curriculum.academicProgram', function ($query) use ($academicProgramId) {
                $query->where('id', $academicProgramId);
            })
            ->when($latestStatus != null, function ($query) use ($latestStatus) {
                $query->whereHas('latestStatus', function ($subQuery) use ($latestStatus) {
                    $subQuery->where('action', $latestStatus);
                });
            })
            ->whereHas('section.curriculumDetail.curriculum.schoolYear', function ($subQuery) use ($schoolYearId) {
                $subQuery->where('id', $schoolYearId);
            })
            ->with('section.curriculumDetail.curriculum.academicTerm')
            ->join('section', 'enrollment.section_id', '=', 'section.id')
            ->join('curriculum_detail', 'section.curriculum_detail_id', '=', 'curriculum_detail.id')
            ->orderBy('curriculum_detail.year_order')
            ->orderBy('curriculum_detail.term_order')
            ->get();

        $years = [];
        $terms = [];

        foreach ($enrollments as $enrollment) {
            $yearOrder = $enrollment->section->curriculumDetail->year_order;
            $termOrder = $enrollment->section->curriculumDetail->term_order;
            $academicTerm = $enrollment->section->curriculumDetail->curriculum->academicTerm;

            // Add unique years
            if (!isset($years[$yearOrder])) {
                $years[$yearOrder] = [
                    'label' => 'Year ' . $yearOrder,
                    'value' => $yearOrder,
                    'parent_value' => null
                ];
            }

            // Add unique terms
            if (!isset($terms[$termOrder])) {
                $terms[$termOrder] = [
                    'label' => $academicTerm->suffix . ' ' . $termOrder,
                    'value' => $termOrder,
                    'parent_value' => $yearOrder
                ];
            }
        }

        return [
            'year' => array_values($years),
            'term' => array_values($terms)
        ];
    }

    public function getEnrollmentsByCampusId(int $campusId, ?string $latestStatus, int $schoolYearId, int $yearId, int $termId, int $page = 1, int $rows = 10): LengthAwarePaginator
    {
        $query = $this->repository->query()
            ->select('enrollment.*')
            ->whereHas('section.curriculumDetail.curriculum.academicProgram.college.campus', function ($query) use ($campusId) {
                $query->where('id', $campusId);
            })
            ->when($latestStatus != null, function ($query) use ($latestStatus) {
                $query->whereHas('latestStatus', function ($subQuery) use ($latestStatus) {
                    $subQuery->where('action', $latestStatus);
                });
            })
            ->when($schoolYearId != null, function ($query) use ($schoolYearId) {
                $query->whereHas('section.curriculumDetail.curriculum.schoolYear', function ($subQuery) use ($schoolYearId) {
                    $subQuery->where('id', $schoolYearId);
                });
            })
            ->whereHas('section.curriculumDetail', function ($subQuery) use ($yearId, $termId) {
                $subQuery->where('year_order', $yearId);
                $subQuery->where('term_order', $termId);
            })
            ->with('section.curriculumDetail.course')
            ->with('user')
            ->groupBy('user_id', 'enrollment.id', 'enrollment.section_id', 'enrollment.created_at', 'enrollment.updated_at')
            ->skip(($page-1) * $rows)
            ->take($rows);

        $total_count = $query->count();
        $result = $query->get();

        $grouped = [];
        foreach ($result as $item) {
            $grouped[$item['user']['name']][] = $item;
        }

        return new LengthAwarePaginator($grouped, $total_count, $rows, $page);
    }

    public function getEnrollmentsByProgramId(int $academicProgramId, ?string $latestStatus, int $schoolYearId, int $yearId, int $termId, int $page = 1, int $rows = 10): LengthAwarePaginator
    {
        $query = $this->repository->query()
            ->select('enrollment.*')
            ->whereHas('section.curriculumDetail.curriculum.academicProgram', function ($query) use ($academicProgramId) {
                $query->where('id', $academicProgramId);
            })
            ->when($latestStatus != null, function ($query) use ($latestStatus) {
                $query->whereHas('latestStatus', function ($subQuery) use ($latestStatus) {
                    $subQuery->where('action', $latestStatus);
                });
            })
            ->when($schoolYearId != null, function ($query) use ($schoolYearId) {
                $query->whereHas('section.curriculumDetail.curriculum.schoolYear', function ($subQuery) use ($schoolYearId) {
                    $subQuery->where('id', $schoolYearId);
                });
            })
            ->whereHas('section.curriculumDetail', function ($subQuery) use ($yearId, $termId) {
                $subQuery->where('year_order', $yearId);
                $subQuery->where('term_order', $termId);
            })
            ->with('section.curriculumDetail.course')
            ->with('user')
            ->groupBy('user_id', 'enrollment.id', 'enrollment.section_id', 'enrollment.created_at', 'enrollment.updated_at')
            ->skip(($page-1) * $rows)
            ->take($rows);

        $total_count = $query->count();
        $result = $query->get();

        $grouped = [];
        foreach ($result as $item) {
            $grouped[$item['user']['name']][] = $item;
        }

        return new LengthAwarePaginator($grouped, $total_count, $rows, $page);
    }
}
