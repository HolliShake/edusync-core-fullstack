<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AdmissionApplication",
    title: "AdmissionApplication",
    type: "object",
    required: [
        // Override required
        'firstName',
        'lastName',
        'email',
        'phone',
        'address',
    ],
    properties: [
        // Override fillables
        new OA\Property(property: "year", type: "integer"),
        new OA\Property(property: "pool_no", type: "integer"),
        new OA\Property(property: "firstName", type: "string"),
        new OA\Property(property: "lastName", type: "string"),
        new OA\Property(property: "middleName", type: "string", nullable: true),
        new OA\Property(property: "email", type: "string"),
        new OA\Property(property: "phone", type: "string"),
        new OA\Property(property: "address", type: "string"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionApplication",
    title:"PaginatedAdmissionApplication",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplication")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedAdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "GetAdmissionApplicationsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/AdmissionApplication"))
    ]
)]

#[OA\Schema(
    schema: "CreateAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "UpdateAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/AdmissionApplication")
    ]
)]

#[OA\Schema(
    schema: "DeleteAdmissionApplicationResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class AdmissionApplication extends Model
{
    protected $table = 'admission_application';

    public $timestamps = true;

    protected $fillable = [
        // 'year',
        // 'pool_no',
        'firstName',
        'lastName',
        'middleName',
        'email',
        'phone',
        'address',
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
