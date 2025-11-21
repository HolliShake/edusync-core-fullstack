<?php

namespace App\Interface\IService;

interface IAdmissionScheduleService extends IGenericService
{
    // Add custom service methods here
    public function getActiveSchoolYear();
    public function getActiveCampuses(int $schoolYearId);
    public function getActiveCollegeByCampusId(int $campusId);
}
