<?php

namespace App\Service;

use App\Interface\IService\IDocumentRequestLogService;
use App\Interface\IRepo\IDocumentRequestLogRepo;

class DocumentRequestLogService extends GenericService implements IDocumentRequestLogService
{
    public function __construct(IDocumentRequestLogRepo $documentRequestLogRepository)
    {
        parent::__construct($documentRequestLogRepository);
    }
}
