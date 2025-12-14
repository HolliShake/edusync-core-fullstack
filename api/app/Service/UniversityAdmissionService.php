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
            ->whereYear('open_date', $now->year)
            ->where('close_date', '>=', $now)
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

        if ($start_date < $schoolYear->start_date || $start_date > $schoolYear->end_date) {
            throw new \Exception('Open date must be within the school year period');
        }

        if ($end_date < $schoolYear->start_date || $end_date > $schoolYear->end_date) {
            throw new \Exception('Close date must be within the school year period');
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

        if ($start_date < $schoolYear->start_date || $start_date > $schoolYear->end_date) {
            throw new \Exception('Open date must be within the school year period');
        }

        if ($end_date < $schoolYear->start_date || $end_date > $schoolYear->end_date) {
            throw new \Exception('Close date must be within the school year period');
        }

        return $data;
    }
}
