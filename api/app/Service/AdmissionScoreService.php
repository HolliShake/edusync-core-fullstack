<?php

namespace App\Service;

use App\Interface\IService\IAdmissionScoreService;
use App\Interface\IRepo\IAdmissionScoreRepo;

class AdmissionScoreService extends GenericService implements IAdmissionScoreService
{
    public function __construct(IAdmissionScoreRepo $admissionScoreRepository)
    {
        parent::__construct($admissionScoreRepository);
    }
}
