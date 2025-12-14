<?php

namespace App\Service;

use App\Interface\IRepo\IUniversityAdmissionRepo;
use App\Interface\IService\IUniversityAdmissionScheduleService;
use App\Interface\IRepo\IUniversityAdmissionScheduleRepo;

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
            throw new \Exception('University admission not found');
        }

        $startDate = $data['start_date'];
        $endDate = $data['end_date'];

        if ($startDate < $universityAdmission->open_date || $startDate > $universityAdmission->close_date) {
            throw new \Exception('Start date must be between university admission open and close dates');
        }

        if ($endDate < $universityAdmission->open_date || $endDate > $universityAdmission->close_date) {
            throw new \Exception('End date must be between university admission open and close dates');
        }

        return $data;
    }

    public function beforeUpdate(int|string $id, array $data): array
    {
        // validate if start_date is between range of its parent
        $universityAdmission = $this->universityAdmissionRepo->getById($data['university_admission_id']);

        if (!$universityAdmission) {
            throw new \Exception('University admission not found');
        }

        $startDate = $data['start_date'];
        $endDate   = $data['end_date'  ];

        if ($startDate < $universityAdmission->open_date || $startDate > $universityAdmission->close_date) {
            throw new \Exception('Start date must be between university admission open and close dates');
        }

        if ($endDate < $universityAdmission->open_date || $endDate > $universityAdmission->close_date) {
            throw new \Exception('End date must be between university admission open and close dates');
        }

        return $data;
    }
}
