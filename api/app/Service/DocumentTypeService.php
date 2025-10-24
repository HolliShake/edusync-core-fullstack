<?php

namespace App\Service;

use App\Interface\IService\IDocumentTypeService;
use App\Interface\IRepo\IDocumentTypeRepo;

class DocumentTypeService extends GenericService implements IDocumentTypeService
{
    public function __construct(IDocumentTypeRepo $documentTypeRepository)
    {
        parent::__construct($documentTypeRepository);
    }
}
