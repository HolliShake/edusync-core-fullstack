<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "DocumentRequestLog",
    title: "DocumentRequestLog",
    type: "object",
    required: [
        // Override required
        'document_request_id',
        'user_id',
        'action',
        'note',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "document_request_id", type: "integer", example: 1),
        new OA\Property(property: "user_id", type: "integer", example: 1),
        new OA\Property(property: "action", type: "string", example: "submitted"),
        new OA\Property(property: "note", type: "string", example: "Document request submitted"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00.000000Z"),
        // Relations
        new OA\Property(property: "document_request", ref: "#/components/schemas/DocumentRequest"),
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedDocumentRequestLog",
    title:"PaginatedDocumentRequestLog",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/DocumentRequestLog")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedDocumentRequestLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedDocumentRequestLog")
    ]
)]

#[OA\Schema(
    schema: "GetDocumentRequestLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/DocumentRequestLog")
    ]
)]

#[OA\Schema(
    schema: "GetDocumentRequestLogsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/DocumentRequestLog"))
    ]
)]

#[OA\Schema(
    schema: "CreateDocumentRequestLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/DocumentRequestLog")
    ]
)]

#[OA\Schema(
    schema: "UpdateDocumentRequestLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/DocumentRequestLog")
    ]
)]

#[OA\Schema(
    schema: "DeleteDocumentRequestLogResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class DocumentRequestLog extends Model
{
    protected $table = 'document_request_log';

    protected $fillable = [
        'document_request_id',
        'user_id',
        'action',
        'note',
    ];

    protected $appends = [
        'document_request',
        'user',
    ];

    /**
     * Get the document request that owns the document request log.
     *
     * @return DocumentRequest
     */
    public function getDocumentRequestAttribute(): DocumentRequest
    {
        return $this->documentRequest()->first();
    }

    /**
     * Get the user that owns the document request log.
     *
     * @return User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first();
    }

    /**
     * Get the document request that owns the document request log.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function documentRequest(): BelongsTo
    {
        return $this->belongsTo(DocumentRequest::class);
    }

    /**
     * Get the user that owns the document request log.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
