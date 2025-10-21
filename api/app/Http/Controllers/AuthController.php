<?php

namespace App\Http\Controllers;

use App\Enum\UserRoleEnum;
use App\Models\AcademicProgram;
use App\Models\Campus;
use App\Models\College;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/Auth"
)]
class AuthController extends Controller
{
    public function __construct() {
    }

    #[OA\Post(
        path: "/api/Auth/login",
        summary: "Login",
        tags: ["Auth"],
        description: "Login",
        operationId: "login",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AuthCredential")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/LoginResponse200")
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthorized",
        content: new OA\JsonContent(ref: "#/components/schemas/UnauthenticatedResponse")
    )]
    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            "email" => "required|email",
            "password" => "required"
        ]);

        if ($validator->fails()) {
            return $this->badRequest($validator->errors());
        }

        $success = Auth::attempt($request->only("email", "password"), true);
        if (!$success) {
            return $this->unauthorized("Invalid credentials");
        }

        /** @var User $user */
        $user = Auth::user();

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->ok($token);
    }

    #[OA\Post(
        path: "/api/Auth/logout",
        summary: "Logout",
        tags: ["Auth"],
        description: "Logout",
        operationId: "logout",
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse")
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthorized",
        content: new OA\JsonContent(ref: "#/components/schemas/UnauthenticatedResponse")
    )]
    public function logout(Request $request) {
        /** @var User $user */
        $user = Auth::user();
        $user->tokens()->delete();
        $request->user()->currentAccessToken()->delete();
        return $this->ok("Logged out successfully");
    }

    #[OA\Get(
        path: "/api/Auth/session",
        summary: "Get session",
        tags: ["Auth"],
        description: "Get session",
        operationId: "getSession",
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/SessionResponse200")
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthorized",
        content: new OA\JsonContent(ref: "#/components/schemas/UnauthorizedResponse")
    )]
    public function session() {
        /** @var User $user */
        $user = Auth::user();

        // Convert roles array to a set for O(1) lookup
        $userRoles = array_flip($user->roles);

        // Eager load designitions to avoid N+1 queries
        $designitions = $user->designitions()
            ->where('is_active', true)
            ->whereIn('designitionable_type', [Campus::class, College::class, AcademicProgram::class])
            ->get()
            ->keyBy('designitionable_type');

        return $this->ok([
            "id" => $user->id,
            "is_admin" => isset($userRoles[UserRoleEnum::ADMIN->value]),
            "is_program_chair" => isset($userRoles[UserRoleEnum::PROGRAM_CHAIR->value]),
            "is_college_dean" => isset($userRoles[UserRoleEnum::COLLEGE_DEAN->value]),
            "is_specialization_chair" => isset($userRoles[UserRoleEnum::SPECIALIZATION_CHAIR->value]),
            "is_campus_scheduler" => isset($userRoles[UserRoleEnum::CAMPUS_SCHEDULER->value]),
            "is_campus_registrar" => isset($userRoles[UserRoleEnum::CAMPUS_REGISTRAR->value]),
            "is_student" => isset($userRoles[UserRoleEnum::STUDENT->value]),
            "is_faculty" => isset($userRoles[UserRoleEnum::FACULTY->value]),
            "is_guest" => isset($userRoles[UserRoleEnum::GUEST->value]),
            "roles" => $user->roles,
            "active_specialization" => null,
            "active_campus" => $designitions->get(Campus::class)?->designitionable_id ?? null,
            "active_college" => $designitions->get(College::class)?->designitionable_id ?? null,
            "active_academic_program" => $designitions->get(AcademicProgram::class)?->designitionable_id ?? null,
        ]);
    }
}
