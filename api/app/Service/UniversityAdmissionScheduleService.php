<?php

namespace App\Service;

use App\Interface\IRepo\IUniversityAdmissionRepo;
use App\Interface\IService\IUniversityAdmissionScheduleService;
use App\Interface\IRepo\IUniversityAdmissionScheduleRepo;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UniversityAdmissionScheduleService extends GenericService implements IUniversityAdmissionScheduleService
{
    private IUniversityAdmissionRepo $universityAdmissionRepo;

    public function __construct(IUniversityAdmissionScheduleRepo $universityAdmissionScheduleRepository, IUniversityAdmissionRepo $universityAdmissionRepo)
    {
        parent::__construct($universityAdmissionScheduleRepository);
        $this->universityAdmissionRepo = $universityAdmissionRepo;
    }


    public function beforeCreate(array $data): array
    {
        // validate if start_date is between range of its parent
        $universityAdmission = $this->universityAdmissionRepo->getById($data['university_admission_id']);

        if (!$universityAdmission) {
            $validator = Validator::make([], []);
            $validator->errors()->add('university_admission_id', 'University admission not found');
            throw new ValidationException($validator);
        }

        $startDate = Carbon::parse($data['start_date'])->startOfDay();
        $endDate = Carbon::parse($data['end_date'])->startOfDay();
        $openDate = Carbon::parse($universityAdmission->open_date)->startOfDay();
        $closeDate = Carbon::parse($universityAdmission->close_date)->endOfDay();

        // Format dates for error messages
        $minDate = $openDate->format('F j, Y');
        $maxDate = $closeDate->format('F j, Y');
        $givenStartDate = $startDate->format('F j, Y');
        $givenEndDate = $endDate->format('F j, Y');

        if ($startDate->lt($openDate) || $startDate->gt($closeDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('start_date', 'Start date (' . $givenStartDate . ') must be within the university admission period (' . $minDate . ' to ' . $maxDate . ')');
            throw new ValidationException($validator);
        }

        if ($endDate->lt($startDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date (' . $givenEndDate . ') must be after the start date (' . $givenStartDate . ')');
            throw new ValidationException($validator);
        }

        if ($endDate->lt($openDate) || $endDate->gt($closeDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date (' . $givenEndDate . ') must be within the university admission period (' . $minDate . ' to ' . $maxDate . ')');
            throw new ValidationException($validator);
        }

        return $data;
    }

    public function beforeUpdate(int|string $id, array $data): array
    {
        // validate if start_date is between range of its parent
        $universityAdmission = $this->universityAdmissionRepo->getById($data['university_admission_id']);

        if (!$universityAdmission) {
            $validator = Validator::make([], []);
            $validator->errors()->add('university_admission_id', 'University admission not found');
            throw new ValidationException($validator);
        }

        $startDate = Carbon::parse($data['start_date'])->startOfDay();
        $endDate = Carbon::parse($data['end_date'])->startOfDay();
        $openDate = Carbon::parse($universityAdmission->open_date)->startOfDay();
        $closeDate = Carbon::parse($universityAdmission->close_date)->endOfDay();

        // Format dates for error messages
        $minDate = $openDate->format('F j, Y');
        $maxDate = $closeDate->format('F j, Y');
        $givenStartDate = $startDate->format('F j, Y');
        $givenEndDate = $endDate->format('F j, Y');

        if ($startDate->lt($openDate) || $startDate->gt($closeDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('start_date', 'Start date (' . $givenStartDate . ') must be within the university admission period (' . $minDate . ' to ' . $maxDate . ')');
            throw new ValidationException($validator);
        }

        if ($endDate->lt($startDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date (' . $givenEndDate . ') must be after the start date (' . $givenStartDate . ')');
            throw new ValidationException($validator);
        }

        if ($endDate->lt($openDate) || $endDate->gt($closeDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date (' . $givenEndDate . ') must be within the university admission period (' . $minDate . ' to ' . $maxDate . ')');
            throw new ValidationException($validator);
        }

        return $data;
    }
}
