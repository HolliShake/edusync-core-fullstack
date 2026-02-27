<?php

namespace App\Service;

use App\Interface\IRepo\IUniversityAdmissionRepo;
use App\Interface\IService\IAdmissionScheduleService;
use App\Interface\IRepo\IAdmissionScheduleRepo;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

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
            $validator = Validator::make([], []);
            $validator->errors()->add('university_admission_id', 'University admission not found');
            throw new ValidationException($validator);
        }

        // Convert dates to Carbon instances for proper comparison
        $admissionOpenDate = Carbon::parse($universityAdmission->open_date)->startOfDay();
        $admissionCloseDate = Carbon::parse($universityAdmission->close_date)->endOfDay();
        $scheduleStartDate = Carbon::parse($data['start_date'])->startOfDay();
        $scheduleEndDate = Carbon::parse($data['end_date'])->endOfDay();

        // Format dates for error messages
        $minDate = $admissionOpenDate->format('F j, Y');
        $maxDate = $admissionCloseDate->format('F j, Y');
        $givenStartDate = $scheduleStartDate->format('F j, Y');
        $givenEndDate = $scheduleEndDate->format('F j, Y');

        if ($scheduleStartDate->lt($admissionOpenDate) || $scheduleStartDate->gt($admissionCloseDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('start_date', 'Start date (' . $givenStartDate . ') must be within the university admission period (' . $minDate . ' to ' . $maxDate . ')');
            throw new ValidationException($validator);
        }

        if ($scheduleEndDate->lt($scheduleStartDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date (' . $givenEndDate . ') must be after the start date (' . $givenStartDate . ')');
            throw new ValidationException($validator);
        }

        if ($scheduleEndDate->gt($admissionCloseDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date (' . $givenEndDate . ') must be within the university admission period (' . $minDate . ' to ' . $maxDate . ')');
            throw new ValidationException($validator);
        }

        return $data;
    }

    public function beforeUpdate(int|string $id, array $data): array
    {
        $universityAdmission = $this->universityAdmissionRepo->getById($data['university_admission_id']);

        if (!$universityAdmission) {
            $validator = Validator::make([], []);
            $validator->errors()->add('university_admission_id', 'University admission not found');
            throw new ValidationException($validator);
        }

        $startDate = $data['start_date'];
        $endDate = $data['end_date'];
        // Convert dates to Carbon instances for proper comparison
        $admissionOpenDate = Carbon::parse($universityAdmission->open_date)->startOfDay();
        $admissionCloseDate = Carbon::parse($universityAdmission->close_date)->endOfDay();
        $scheduleStartDate = Carbon::parse($startDate)->startOfDay();
        $scheduleEndDate = Carbon::parse($endDate)->endOfDay();

        // Format dates for error messages
        $minDate = $admissionOpenDate->format('F j, Y');
        $maxDate = $admissionCloseDate->format('F j, Y');
        $givenStartDate = $scheduleStartDate->format('F j, Y');
        $givenEndDate = $scheduleEndDate->format('F j, Y');

        if ($scheduleStartDate->lt($admissionOpenDate) || $scheduleStartDate->gt($admissionCloseDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('start_date', 'Start date (' . $givenStartDate . ') must be within the university admission period (' . $minDate . ' to ' . $maxDate . ')');
            throw new ValidationException($validator);
        }

        if ($scheduleEndDate->lt($scheduleStartDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date (' . $givenEndDate . ') must be after the start date (' . $givenStartDate . ')');
            throw new ValidationException($validator);
        }

        if ($scheduleEndDate->gt($admissionCloseDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date (' . $givenEndDate . ') must be within the university admission period (' . $minDate . ' to ' . $maxDate . ')');
            throw new ValidationException($validator);
        }

        return $data;
    }
}
