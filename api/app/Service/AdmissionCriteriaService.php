<?php

namespace App\Service;

use App\Interface\IService\IAdmissionCriteriaService;
use App\Interface\IRepo\IAdmissionCriteriaRepo;

class AdmissionCriteriaService extends GenericService implements IAdmissionCriteriaService
{
    public function __construct(IAdmissionCriteriaRepo $AdmissionCriteriaRepository)
    {
        parent::__construct($AdmissionCriteriaRepository);
    }
}
