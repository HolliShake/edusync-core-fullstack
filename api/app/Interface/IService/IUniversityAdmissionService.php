<?php

namespace App\Interface\IService;

interface IUniversityAdmissionService extends IGenericService
{
    // Add custom service methods here
    public function getCurrentUserInvitation(int $userId);
}
