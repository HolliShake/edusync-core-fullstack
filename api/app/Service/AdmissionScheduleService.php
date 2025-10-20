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
}
