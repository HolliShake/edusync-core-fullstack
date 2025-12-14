<?php

namespace App\Service;

use App\Interface\IRepo\IUniversityAdmissionRepo;
use App\Interface\IService\IAdmissionScheduleService;
use App\Interface\IRepo\IAdmissionScheduleRepo;
use Illuminate\Database\Eloquent\Model;

class AdmissionScheduleService extends GenericService implements IAdmissionScheduleService
{
    private IUniversityAdmissionRepo $universityAdmissionRepo;

    public function __construct(
        IAdmissionScheduleRepo $admissionScheduleRepository,
        IUniversityAdmissionRepo $universityAdmissionRepo
    )
    {
        parent::__construct($admissionScheduleRepository);
        $this->universityAdmissionRepo = $universityAdmissionRepo;
    }

    public function getActiveSchoolYear() {
        return $this->repository->query()
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->whereHas('universityAdmission.schoolYear', function ($query) {
                $query->where('start_date', '<=', now())
                    ->where('end_date', '>=', now());
            })
            ->with('universityAdmission.schoolYear')
            ->get()
            ->pluck('universityAdmission.schoolYear')
            ->unique('id')
            ->values();
    }

    public function getActiveCampuses(int $schoolYearId) {
        return $this->repository->query()
            ->whereHas('universityAdmission', function ($query) use ($schoolYearId) {
                $query->where('school_year_id', $schoolYearId);
            })
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


    public function beforeCreate(array $data): array
    {
        $universityAdmission = $this->universityAdmissionRepo->getById($data['university_admission_id']);

        if (!$universityAdmission) {
            throw new \Exception('University admission not found');
        }

        if (!$universityAdmission->is_open_override && !$universityAdmission->is_ongoing) {
            throw new \Exception('University admission is not open');
        }

        $startDate = $data['start_date'];
        $endDate = $data['end_date'];

        if ($startDate > $endDate) {
            throw new \Exception('Start date must be before or equal to end date');
        }

        $openDate  = $universityAdmission->open_date;
        $closeDate = $universityAdmission->close_date;

        if ($startDate < $openDate || $startDate > $closeDate) {
            throw new \Exception('Start date must be between university admission open and close dates');
        }

        if ($endDate < $openDate || $endDate > $closeDate) {
            throw new \Exception('End date must be between university admission open and close dates');
        }

        return $data;
    }

    public function beforeUpdate(int|string $id, array $data): array
    {
        $universityAdmission = $this->universityAdmissionRepo->getById($data['university_admission_id']);

        if (!$universityAdmission) {
            throw new \Exception('University admission not found');
        }

        if (!$universityAdmission->is_open_override && !$universityAdmission->is_ongoing) {
            throw new \Exception('University admission is not open');
        }

        $startDate = $data['start_date'];
        $endDate = $data['end_date'];

        if ($startDate > $endDate) {
            throw new \Exception('Start date must be before or equal to end date');
        }

        $openDate  = $universityAdmission->open_date;
        $closeDate = $universityAdmission->close_date;

        if ($startDate < $openDate || $startDate > $closeDate) {
            throw new \Exception('Start date must be between university admission open and close dates');
        }

        if ($endDate < $openDate || $endDate > $closeDate) {
            throw new \Exception('End date must be between university admission open and close dates');
        }

        return $data;
    }
}
