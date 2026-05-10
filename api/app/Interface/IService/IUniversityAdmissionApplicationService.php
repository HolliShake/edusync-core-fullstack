<?php

namespace App\Interface\IService;

interface IUniversityAdmissionApplicationService extends IGenericService
{
    // Add custom service methods here
    public function uploadResult(\Illuminate\Http\UploadedFile $file): array;
}
