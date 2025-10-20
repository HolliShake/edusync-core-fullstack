<?php

namespace App\Service;

use App\Interface\IService\IAdmissionApplicationService;
use App\Interface\IRepo\IAdmissionApplicationRepo;

class AdmissionApplicationService extends GenericService implements IAdmissionApplicationService
{
    public function __construct(IAdmissionApplicationRepo $admissionApplicationRepository)
    {
        parent::__construct($admissionApplicationRepository);
    }
}
