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

    public function getActiveCampuses() {
        return $this->repository->query()
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->with('academicProgram.college.campus')
            ->get()
            ->pluck('academicProgram.college.campus')
            ->unique('id');
    }

    public function getActiveAcademicYearByCampusId(int $campusId) {
        return $this->repository->query()
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->with('academicProgram.college.campus')
            ->get()
            ->pluck('academicProgram.college.campus')
            ->unique('id');
    }

    public function getActiveCollegeByCampusAndAcademicYear(int $programId) {
        return $this->repository->query()
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->with('academicProgram.college.campus')
            ->get()
            ->pluck('academicProgram.college.campus')
            ->unique('id');
    }
}
