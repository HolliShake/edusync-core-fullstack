<?php

namespace App\Service;

use App\Interface\IService\IAdmissionScheduleService;
use App\Interface\IRepo\IAdmissionScheduleRepo;

class AdmissionScheduleService extends GenericService implements IAdmissionScheduleService
{
    public function __construct(IAdmissionScheduleRepo $admissionScheduleRepository)
    {
        parent::__construct($admissionScheduleRepository);
    }

    public function getActiveSchoolYear() {
        return $this->repository->query()
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->whereHas('schoolYear', function ($query) {
                $query->where('start_date', '<=', now())
                    ->where('end_date', '>=', now());
            })
            ->with('schoolYear')
            ->get()
            ->pluck('schoolYear')
            ->unique('id')
            ->values();
    }

    public function getActiveCampuses(int $schoolYearId) {
        return $this->repository->query()
            ->where('school_year_id', $schoolYearId)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->with('academicProgram.college.campus')
            ->get()
            ->pluck('academicProgram.college.campus')
            ->unique('id')
            ->values()
            ->toArray();
    }

    public function getActiveCollegeByCampusId(int $campusId) {
        return $this->repository->query()
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->whereHas('academicProgram.college', function ($query) use ($campusId) {
                $query->where('campus_id', $campusId);
            })
            ->with('academicProgram.college')
            ->get()
            ->pluck('academicProgram.college')
            ->unique('id')
            ->values()
            ->toArray();
    }
}
