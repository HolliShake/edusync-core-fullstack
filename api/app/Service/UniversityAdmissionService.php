<?php

namespace App\Service;

use App\Interface\IService\IUniversityAdmissionService;
use App\Interface\IRepo\IUniversityAdmissionRepo;
use App\Interface\IRepo\ISchoolYearRepo;
use App\Interface\IRepo\IUniversityAdmissionApplicationRepo;
use Auth;
use Illuminate\Database\Eloquent\Model;

class UniversityAdmissionService extends GenericService implements IUniversityAdmissionService
{
    protected ISchoolYearRepo $schoolYearRepo;
    protected IUniversityAdmissionApplicationRepo $universityAdmissionApplicationRepo;

    public function __construct(IUniversityAdmissionRepo $universityAdmissionRepository, ISchoolYearRepo $schoolYearRepo, IUniversityAdmissionApplicationRepo $universityAdmissionApplicationRepo)
    {
        parent::__construct($universityAdmissionRepository);
        $this->schoolYearRepo = $schoolYearRepo;
        $this->universityAdmissionApplicationRepo = $universityAdmissionApplicationRepo;
    }


    public function getCurrentUserInvitation(int $userId)
    {  
        $now = now();
        
        $admission = $this->repository->query()
            ->where('close_date', '>=', $now->format('Y-m-d'))
            ->first();

        if (!$admission) {
            return null;
        }

        // Check if user already applied
        $hasApplied = $this->universityAdmissionApplicationRepo->query()
            ->where('university_admission_id', $admission->id)
            ->where('user_id', $userId)
            ->exists();
        
        return $hasApplied ? null : $admission;
    }

    public function beforeCreate(array $data): array
    {
        $schoolYear = $this->schoolYearRepo->getById($data['school_year_id']);

        if (!$schoolYear) {
            throw new \Exception('School year not found');
        }

        $start_date = $data['open_date'];
        $end_date   = $data['close_date'];

        // Convert dates to Carbon instances for proper comparison
        $schoolYearStart = \Carbon\Carbon::parse($schoolYear->start_date)->startOfDay();
        $schoolYearEnd = \Carbon\Carbon::parse($schoolYear->end_date)->endOfDay();
        $openDate = \Carbon\Carbon::parse($start_date)->startOfDay();
        $closeDate = \Carbon\Carbon::parse($end_date)->endOfDay();

        // Format dates for error messages
        $minDate = $schoolYearStart->format('F j, Y');
        $maxDate = $schoolYearEnd->format('F j, Y');
        $givenOpenDate = $openDate->format('F j, Y');
        $givenCloseDate = $closeDate->format('F j, Y');

        if ($openDate->lt($schoolYearStart) || $openDate->gt($schoolYearEnd)) {
            throw new \Exception('Open date (' . $givenOpenDate . ') must be within the school year period (' . $minDate . ' to ' . $maxDate . ')');
        }

        if ($closeDate->lt($openDate)) {
            throw new \Exception('Close date (' . $givenCloseDate . ') must be after the open date (' . $givenOpenDate . ')');
        }

        if ($closeDate->gt($schoolYearEnd)) {
            throw new \Exception('Close date (' . $givenCloseDate . ') must be within the school year period (' . $minDate . ' to ' . $maxDate . ')');
        }

        return $data;
    }

    public function beforeUpdate(int|string $id, array $data): array
    {
        $schoolYear = $this->schoolYearRepo->getById($data['school_year_id']);

        if (!$schoolYear) {
            throw new \Exception('School year not found');
        }
        $start_date = $data['open_date'];
        $end_date   = $data['close_date'];

        // Convert dates to Carbon instances for proper comparison
        $schoolYearStart = \Carbon\Carbon::parse($schoolYear->start_date)->startOfDay();
        $schoolYearEnd = \Carbon\Carbon::parse($schoolYear->end_date)->endOfDay();
        $openDate = \Carbon\Carbon::parse($start_date)->startOfDay();
        $closeDate = \Carbon\Carbon::parse($end_date)->endOfDay();

        // Format dates for error messages
        $minDate = $schoolYearStart->format('F j, Y');
        $maxDate = $schoolYearEnd->format('F j, Y');
        $givenOpenDate = $openDate->format('F j, Y');
        $givenCloseDate = $closeDate->format('F j, Y');

        if ($openDate->lt($schoolYearStart) || $openDate->gt($schoolYearEnd)) {
            throw new \Exception('Open date (' . $givenOpenDate . ') must be within the school year period (' . $minDate . ' to ' . $maxDate . ')');
        }

        if ($closeDate->lt($openDate)) {
            throw new \Exception('Close date (' . $givenCloseDate . ') must be after the open date (' . $givenOpenDate . ')');
        }

        if ($closeDate->gt($schoolYearEnd)) {
            throw new \Exception('Close date (' . $givenCloseDate . ') must be within the school year period (' . $minDate . ' to ' . $maxDate . ')');
        }

        return $data;
    }
}
