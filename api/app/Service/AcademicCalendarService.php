<?php

namespace App\Service;

use App\Interface\IService\IAcademicCalendarService;
use App\Interface\IRepo\IAcademicCalendarRepo;
use App\Interface\IRepo\ISchoolYearRepo;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AcademicCalendarService extends GenericService implements IAcademicCalendarService
{
    private ISchoolYearRepo $schoolYearRepo;
    public function __construct(IAcademicCalendarRepo $academicCalendarRepository, ISchoolYearRepo $schoolYearRepo)
    {
        parent::__construct($academicCalendarRepository);
        $this->schoolYearRepo = $schoolYearRepo;
    }

    public function beforeUpdate(int|string $id, array $data): array
    {
        $academicCalendar = $this->repository->getById($id);
        if (!$academicCalendar) {
            $validator = Validator::make([], []);
            $validator->errors()->add('id', 'Academic calendar not found');
            throw new ValidationException($validator);
        }

        $startDate = Carbon::parse($data['start_date'])->startOfDay();
        $endDate = Carbon::parse($data['end_date'])->endOfDay();
        $schoolYearStart = Carbon::parse($academicCalendar->schoolYear->start_date)->startOfDay();
        $schoolYearEnd = Carbon::parse($academicCalendar->schoolYear->end_date)->endOfDay();

        if ($startDate->lt($schoolYearStart) || $startDate->gt($schoolYearEnd)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('start_date', 'Start date must be within the school year period');
            throw new ValidationException($validator);
        }

        if ($endDate->lt($startDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date must be after the start date');
            throw new ValidationException($validator);
        }

        if ($endDate->lt($schoolYearStart) || $endDate->gt($schoolYearEnd)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date must be within the school year period');
            throw new ValidationException($validator);
        }

        return $data;
    }

    public function beforeCreate(array $data): array
    {
        $schoolYear = $this->schoolYearRepo->getById($data['school_year_id']);
        if (!$schoolYear) {
            $validator = Validator::make([], []);
            $validator->errors()->add('school_year_id', 'School year not found');
            throw new ValidationException($validator);
        }

        $startDate = Carbon::parse($data['start_date'])->startOfDay();
        $endDate = Carbon::parse($data['end_date'])->endOfDay();
        $schoolYearStart = Carbon::parse($schoolYear->start_date)->startOfDay();
        $schoolYearEnd = Carbon::parse($schoolYear->end_date)->endOfDay();

        if ($startDate->lt($schoolYearStart) || $startDate->gt($schoolYearEnd)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('start_date', 'Start date must be within the school year period');
            throw new ValidationException($validator);
        }

        if ($endDate->lt($startDate)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date must be after the start date');
            throw new ValidationException($validator);
        }

        if ($endDate->lt($schoolYearStart) || $endDate->gt($schoolYearEnd)) {
            $validator = Validator::make([], []);
            $validator->errors()->add('end_date', 'End date must be within the school year period');
            throw new ValidationException($validator);
        }

        return $data;
    }
    public function beforeUpdateMultiple(array $data): array
    {
        foreach ($data as $item) {
            $this->beforeUpdate($item['id'], $item);
        }
        return $data;
    }

    public function updateMultiple(array $data): array
    {
        try {
            $this->beforeUpdateMultiple($data);
            $this->repository->query()
                ->upsert($data, ['id'], ['name', 'description', 'start_date', 'end_date', 'school_year_id', 'event', 'order']);
            return $this->repository->query()
                ->whereIn('id', array_column($data, 'id'))
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            throw $e;
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        }
    }
}
