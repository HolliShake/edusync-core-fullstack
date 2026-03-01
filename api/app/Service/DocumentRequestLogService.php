<?php

namespace App\Service;

use App\Enum\DocumentRequestLogActionEnum;
use App\Interface\IService\IDocumentRequestLogService;
use App\Interface\IRepo\IDocumentRequestLogRepo;
use App\Models\DocumentRequestLog;

class DocumentRequestLogService extends GenericService implements IDocumentRequestLogService
{
    public function __construct(IDocumentRequestLogRepo $documentRequestLogRepository)
    {
        parent::__construct($documentRequestLogRepository);
    }

    protected function beforeCreate(array $data): array
    {
        $documentRequestId = $data['document_request_id'];
        $newAction = $data['action'];

        $newActionValue = $newAction instanceof DocumentRequestLogActionEnum ? $newAction->value : (string) $newAction;

        $duplicateExists = DocumentRequestLog::where('document_request_id', $documentRequestId)
            ->where('action', $newActionValue)
            ->exists();

        if ($duplicateExists) {
            throw new \Exception('A log entry with this action already exists for this document request.');
        }

        if ($newActionValue === DocumentRequestLogActionEnum::REJECTED->value || $newActionValue === DocumentRequestLogActionEnum::CANCELLED->value) {
            $alreadyCompleted = DocumentRequestLog::where('document_request_id', $documentRequestId)
                ->where('action', DocumentRequestLogActionEnum::COMPLETED->value)
                ->exists();

            if ($alreadyCompleted) {
                throw new \Exception('Cannot reject or cancel a document request that has already been completed.');
            }
        }

        return parent::beforeCreate($data);
    }

    protected function beforeUpdate(int|string $id, array $data): array
    {
        $existing = DocumentRequestLog::find($id);
        if (!$existing) {
            return parent::beforeUpdate($id, $data);
        }

        $documentRequestId = $data['document_request_id'] ?? $existing->document_request_id;
        $newAction = $data['action'] ?? $existing->action;
        $newActionValue = $newAction instanceof DocumentRequestLogActionEnum ? $newAction->value : (string) $newAction;

        $duplicateExists = DocumentRequestLog::where('document_request_id', $documentRequestId)
            ->where('action', $newActionValue)
            ->where('id', '!=', $id)
            ->exists();

        if ($duplicateExists) {
            throw new \Exception('A log entry with this action already exists for this document request.');
        }

        if ($newActionValue === DocumentRequestLogActionEnum::REJECTED->value || $newActionValue === DocumentRequestLogActionEnum::CANCELLED->value) {
            $alreadyCompleted = DocumentRequestLog::where('document_request_id', $documentRequestId)
                ->where('action', DocumentRequestLogActionEnum::COMPLETED->value)
                ->where('id', '!=', $id)
                ->exists();

            if ($alreadyCompleted) {
                throw new \Exception('Cannot reject or cancel a document request that has already been completed.');
            }
        }

        return parent::beforeUpdate($id, $data);
    }
}
