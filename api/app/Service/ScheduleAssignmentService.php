<?php

namespace App\Service;

use App\Interface\IService\IScheduleAssignmentService;
use App\Interface\IRepo\IScheduleAssignmentRepo;

class ScheduleAssignmentService extends GenericService implements IScheduleAssignmentService
{
    public function __construct(IScheduleAssignmentRepo $scheduleAssignmentRepository)
    {
        parent::__construct($scheduleAssignmentRepository);
    }

    public function getBySectionCode(string $section_code)
    {
        return $this->repository->query()
            ->whereHas('section', function ($query) use ($section_code) {
                $query->where('section_code', $section_code);
            })
            ->with(['section', 'room'])
            ->get();
    }
}
