<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enum\UserRoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "User",
    title: "User",
    type: "object",
    required: [
        "name",
        "email",
        "password"
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", readOnly: true),
        new OA\Property(property: "name", type: "string"),
        new OA\Property(property: "email", type: "string", format: "email"),
        new OA\Property(property: "password", type: "string", format: "password"),
        new OA\Property(property: "role", type: "string", enum: ['admin', 'program-chair', 'college-dean', 'specialization-chair', 'campus-scheduler', 'campus-registrar', 'student', 'faculty', 'guest']),
        new OA\Property(property: "email_verified_at", type: "string", format: "date-time", nullable: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
        // attributes
        new OA\Property(property: "roles", type: "array", items: new OA\Items(type: "string")),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUser",
    title:"PaginatedUser",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/User")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUserResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedUser")
    ]
)]

#[OA\Schema(
    schema: "GetUserResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/User")
    ]
)]

#[OA\Schema(
    schema: "GetUsersResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/User"))
    ]
)]

#[OA\Schema(
    schema: "CreateUserResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/User")
    ]
)]

#[OA\Schema(
    schema: "UpdateUserResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/User")
    ]
)]

#[OA\Schema(
    schema: "DeleteUserResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'user';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the attributes that should be appended.
     *
     * @return array<string>
     */
    protected function appends(): array
    {
        return ['roles'];
    }

    /**
     * Get the roles attribute.
     *
     * @return array<string>
     */
    public function getRolesAttribute(): array
    {
        $roles = [];

        // Check admin role
        if ($this->role === UserRoleEnum::ADMIN->value) {
            $roles[] = UserRoleEnum::ADMIN->value;
        }

        // Check designations with a single query
        $designations = $this->designitions()
            ->whereIn('designitionable_type', [Campus::class, College::class, AcademicProgram::class])
            ->pluck('designitionable_type')
            ->toArray();

        $hasDesignation = false;

        if (in_array(Campus::class, $designations)) {
            $roles[] = UserRoleEnum::CAMPUS_REGISTRAR->value;
            $hasDesignation = true;
        }

        if (in_array(College::class, $designations)) {
            $roles[] = UserRoleEnum::COLLEGE_DEAN->value;
            $hasDesignation = true;
        }

        if (in_array(AcademicProgram::class, $designations)) {
            $roles[] = UserRoleEnum::PROGRAM_CHAIR->value;
            $hasDesignation = true;
        }

        // Check student role - commented out to prevent recursion
        if ($this->is_student) {
            $roles[] = UserRoleEnum::STUDENT->value;
        }

        // Auto assign guest if no roles
        if (empty($roles)) {
            $roles[] = UserRoleEnum::GUEST->value;
        }

        return $roles;
    }

    /**
     * Get the is student attribute.
     * OPTIMIZED: Use direct database query to prevent N+1 and recursion
     *
     * @return bool
     */
    public function getIsStudentAttribute(): bool
    {
        $enrollments = $this->enrollments()
            ->get()
            ->makeHidden(['user', 'section', 'enrollment_logs'])
            ->toArray();

        $validatedEnrollments = array_filter($enrollments, function($enrollment) {
            return $enrollment['validated'] && !$enrollment['is_dropped'];
        });

        return count($validatedEnrollments) > 0;
    }

    /**
     * Get all user enrollments
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get the designitions for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function designitions(): HasMany
    {
        return $this->hasMany(Designition::class, 'user_id', 'id');
    }
}
