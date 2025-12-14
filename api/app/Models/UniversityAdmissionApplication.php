<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "UniversityAdmissionApplication",
    title: "UniversityAdmissionApplication",
    type: "object",
    required: [
        "university_admission_id",
        "user_id",
        "remark"
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "university_admission_id", type: "integer"),
        new OA\Property(property: "university_admission_schedule_id", type: "integer", nullable: true),
        new OA\Property(property: "user_id", type: "integer"),
        new OA\Property(property: "is_passed", type: "boolean", nullable: true),
        new OA\Property(property: "score", type: "number", format: "decimal", nullable: true),
        new OA\Property(property: "remark", type: "string"),
        new OA\Property(property: "year", type: "integer"),
        new OA\Property(property: "pool_no", type: "integer"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", readOnly: true),
        new OA\Property(property: "updated_at", type: "string", format: "date-time", readOnly: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionApplication",
    title:"PaginatedUniversityAdmissionApplication",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionApplication")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedUniversityAdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "GetAllUniversityAdmissionApplicationsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionApplication"))
    ]
)]

#[OA\Schema(
    schema: "CreateUniversityAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "UpdateUniversityAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "DeleteUniversityAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class UniversityAdmissionApplication extends Model
{
    protected $table = 'university_admission_application';

    protected $fillable = [
        'university_admission_id',
        'university_admission_schedule_id',
        'user_id',
        'is_passed',
        'score',
        'remark'
    ];

    protected $casts = [
        'is_passed' => 'boolean',
        'score' => 'decimal:2',
    ];

    /********************************/
    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->year)) {
                $model->year = now()->year;
            }

            // Ensure no duplicate during concurrency
            $model->pool_no = DB::transaction(function () use ($model) {
                $lastNo = self::where('year', $model->year)
                    ->lockForUpdate()
                    ->max('pool_no');

                return $lastNo ? $lastNo + 1 : 1;
            });
        });
    }
}
