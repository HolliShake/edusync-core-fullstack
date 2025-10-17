<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AcademicTerm",
    title: "AcademicTerm",
    type: "object",
    required: [
        // Override required
        'name',
        'description',
        'suffix',
        'number_of_terms',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "name", type: "string", example: "Term 1"),
        new OA\Property(property: "description", type: "string", nullable: true, example: "Description of Term 1"),
        new OA\Property(property: "suffix", type: "string", example: "Semester"),
        new OA\Property(property: "number_of_terms", type: "integer", example: 1),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2024-01-01T12:00:00Z", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", example: "2024-01-01T12:00:00Z", readOnly: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAcademicTerm",
    title:"PaginatedAcademicTerm",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AcademicTerm")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAcademicTermResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAcademicTerm")
    ]
)]

#[OA\Schema(
    schema: "GetAcademicTermResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicTerm")
    ]
)]

#[OA\Schema(
    schema: "GetAcademicTermsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AcademicTerm"))
    ]
)]

#[OA\Schema(
    schema: "CreateAcademicTermResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicTerm")
    ]
)]

#[OA\Schema(
    schema: "UpdateAcademicTermResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AcademicTerm")
    ]
)]

#[OA\Schema(
    schema: "DeleteAcademicTermResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AcademicTerm extends Model
{
    protected $table = 'academic_term';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'description',
        'suffix',
        'number_of_terms',
    ];

    protected $casts = [
        'number_of_terms' => 'integer',
    ];
}
