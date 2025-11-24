<?php

namespace App\Service;

use App\Interface\IService\IAcademicCalendarService;
use App\Interface\IRepo\IAcademicCalendarRepo;

class AcademicCalendarService extends GenericService implements IAcademicCalendarService
{
    public function __construct(IAcademicCalendarRepo $academicCalendarRepository)
    {
        parent::__construct($academicCalendarRepository);
    }

    public function updateMultiple(array $data): array
    {
        try {
            $this->repository->query()
                ->upsert($data, ['id'], ['name', 'description', 'start_date', 'end_date', 'school_year_id', 'event', 'order']);
            return $this->repository->query()
                ->whereIn('id', array_column($data, 'id'))
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
