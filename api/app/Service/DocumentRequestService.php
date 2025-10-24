<?php

namespace App\Service;

use App\Interface\IService\IDocumentRequestService;
use App\Interface\IRepo\IDocumentRequestRepo;

class DocumentRequestService extends GenericService implements IDocumentRequestService
{
    public function __construct(IDocumentRequestRepo $documentRequestRepository)
    {
        parent::__construct($documentRequestRepository);
    }
}
