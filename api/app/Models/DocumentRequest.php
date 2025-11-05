<?php

namespace App\Models;

use App\Enum\DocumentRequestLogActionEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "DocumentRequest",
    title: "DocumentRequest",
    type: "object",
    required: [
        // Override required
        'user_id',
        'campus_id',
        'document_type_id',
        'purpose',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "user_id", type: "integer", example: 1),
        new OA\Property(property: "campus_id", type: "integer", example: 1),
        new OA\Property(property: "document_type_id", type: "integer", example: 1),
        new OA\Property(property: "purpose", type: "string", example: "For employment purposes"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00.000000Z"),
        // Computed
        new OA\Property(property: "latest_status", type: "string", enum: DocumentRequestLogActionEnum::class, readOnly: true),
        new OA\Property(property: "latest_status_label", type: "string", readOnly: true),
        // Relations
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
        new OA\Property(property: "campus", ref: "#/components/schemas/Campus"),
        new OA\Property(property: "document_type", ref: "#/components/schemas/DocumentType"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedDocumentRequest",
    title:"PaginatedDocumentRequest",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/DocumentRequest")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedDocumentRequestResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedDocumentRequest")
    ]
)]

#[OA\Schema(
    schema: "GetDocumentRequestResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/DocumentRequest")
    ]
)]

#[OA\Schema(
    schema: "GetDocumentRequestsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/DocumentRequest"))
    ]
)]

#[OA\Schema(
    schema: "CreateDocumentRequestResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/DocumentRequest")
    ]
)]

#[OA\Schema(
    schema: "UpdateDocumentRequestResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/DocumentRequest")
    ]
)]

#[OA\Schema(
    schema: "DeleteDocumentRequestResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class DocumentRequest extends Model
{
    protected $table = 'document_request';

    protected $fillable = [
        'user_id',
        'campus_id',
        'document_type_id',
        'purpose',
    ];

    protected $appends = [
        'user',
        'campus',
        'latest_status',
        'latest_status_label',
    ];

    /**
     * Get the latest status of the document request.
     *
     * @return DocumentRequestLogActionEnum
     */
    public function getLatestStatusAttribute(): DocumentRequestLogActionEnum
    {
        return $this->latestStatus()->first()->action;
    }

    /**
     * Get the latest status label of the document request.
     *
     * @return string
     */
    public function getLatestStatusLabelAttribute(): string
    {
        return $this->latestStatus()->first()->action->value;
    }

    /**
     * Get the user that owns the document request.
     *
     * @return User
     */
    public function getUserAttribute(): User
    {
        return $this->user()->first();
    }

    /**
     * Get the campus that owns the document request.
     *
     * @return Campus
     */
    public function getCampusAttribute(): Campus
    {
        return $this->campus()->first();
    }

    /**
     * Get the user that owns the document request.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the campus that owns the document request.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    /**
     * Get the latest status of the document request.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function latestStatus(): HasOne
    {
        return $this->hasOne(DocumentRequestLog::class)->latestOfMany();
    }
}
