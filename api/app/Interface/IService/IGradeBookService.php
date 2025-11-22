<?php

namespace App\Interface\IService;

interface IGradeBookService extends IGenericService
{
    // Add custom service methods here
    public function generateFromTemplate(int $isTemplateGradeBookId, int $sectionId);
}
