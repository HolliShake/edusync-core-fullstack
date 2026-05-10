<?php

namespace App\Interface\IService;

interface IAdmissionApplicationService extends IGenericService
{
    // Add custom service methods here
    public function submitApplicationForm(array $data);
}
