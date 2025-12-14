<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "FamilyBackground",
    title: "FamilyBackground",
    type: "object",
    required: [
        "user_id",
        "fullname",
        "relationship"
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "user_id", type: "integer", example: 1),
        new OA\Property(property: "fullname", type: "string", example: "John Doe"),
        new OA\Property(property: "relationship", type: "string", enum: ["father", "mother", "brother", "guardian", "other"], example: "father"),
        new OA\Property(property: "occupation", type: "string", nullable: true, example: "Engineer"),
        new OA\Property(property: "birthdate", type: "string", format: "date", nullable: true, example: "1970-01-01"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedFamilyBackground",
    title:"PaginatedFamilyBackground",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/FamilyBackground")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedFamilyBackgroundResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedFamilyBackground")
    ]
)]

#[OA\Schema(
    schema: "GetFamilyBackgroundResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/FamilyBackground")
    ]
)]

#[OA\Schema(
    schema: "GetAllFamilyBackgroundsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/FamilyBackground"))
    ]
)]

#[OA\Schema(
    schema: "CreateFamilyBackgroundResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/FamilyBackground")
    ]
)]

#[OA\Schema(
    schema: "UpdateFamilyBackgroundResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/FamilyBackground")
    ]
)]

#[OA\Schema(
    schema: "DeleteFamilyBackgroundResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class FamilyBackground extends Model
{
    protected $table = 'family_background';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'fullname',
        'relationship',
        'occupation',
        'birthdate',
    ];
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birthdate' => 'date',
    ];

    /**
     * Get the user that owns the family background.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
