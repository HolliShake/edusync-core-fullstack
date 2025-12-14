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

    public function create(array $data): Model
    {
        $schoolYear = $this->schoolYearRepo->getById($data['school_year_id']);

        // Check if an admission already exists for this school year
        $existingAdmission = $this->repository->query()
            ->where('school_year_id', $data['school_year_id'])
            ->first();
        if ($existingAdmission) {
            throw new \Exception('A university admission already exists for this school year');
        }

        $start_date = $data['open_date'];
        $end_date = $data['close_date'];

        if ($start_date < $schoolYear->start_date || $end_date > $schoolYear->end_date) {
            throw new \Exception('Open date and close date must be within the school year period');
        }

        return parent::create($data);
    }

    // update
    public function update(int|string $id, array $data, array $relations = []): Model
    {
        $universityAdmission = $this->repository->getById($id);

        // Check if school_year_id is being updated
        if (isset($data['school_year_id']) && $data['school_year_id'] != $universityAdmission->school_year_id) {
            // Check if an admission already exists for the new school year
            $existingAdmission = $this->repository->query()
                ->where('school_year_id', $data['school_year_id'])
                ->where('id', '!=', $id)
                ->first();

            if ($existingAdmission) {
                throw new \Exception('A university admission already exists for this school year');
            }
        }

        $schoolYearId = $data['school_year_id'] ?? $universityAdmission->school_year_id;
        $schoolYear = $this->schoolYearRepo->getById($schoolYearId);

        $start_date = $data['open_date'] ?? $universityAdmission->open_date;
        $end_date = $data['close_date'] ?? $universityAdmission->close_date;

        if ($start_date < $schoolYear->start_date || $end_date > $schoolYear->end_date) {
            throw new \Exception('Open date and close date must be within the school year period');
        }

        return parent::update($id, $data, $relations);
    }
}
