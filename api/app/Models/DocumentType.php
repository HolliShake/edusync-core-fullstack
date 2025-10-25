<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "DocumentType",
    title: "DocumentType",
    type: "object",
    required: [
        // Override required
        'name',
        'description',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "name", type: "string", example: "Transcript"),
        new OA\Property(property: "description", type: "string", example: "Transcript of records"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00.000000Z"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2025-01-01T00:00:00.000000Z"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedDocumentType",
    title:"PaginatedDocumentType",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/DocumentType")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedDocumentTypeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedDocumentType")
    ]
)]

#[OA\Schema(
    schema: "GetDocumentTypeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/DocumentType")
    ]
)]

#[OA\Schema(
    schema: "GetDocumentTypesResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/DocumentType"))
    ]
)]

#[OA\Schema(
    schema: "CreateDocumentTypeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/DocumentType")
    ]
)]

#[OA\Schema(
    schema: "UpdateDocumentTypeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/DocumentType")
    ]
)]

#[OA\Schema(
    schema: "DeleteDocumentTypeResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class DocumentType extends Model
{
    protected $table = 'document_type';

    protected $fillable = [
        'name',
        'description',
    ];
}
