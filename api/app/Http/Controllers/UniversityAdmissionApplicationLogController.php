<?php

namespace App\Http\Controllers;

use App\Enum\AdmissionApplicationLogTypeEnum;
use App\Http\Controllers\Controller;
use App\Service\UniversityAdmissionApplicationLogService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/UniversityAdmissionApplicationLog"
)]
class UniversityAdmissionApplicationLogController extends Controller
{
    public function __construct(protected UniversityAdmissionApplicationLogService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/UniversityAdmissionApplicationLog",
        summary: "Get paginated list of UniversityAdmissionApplicationLog",
        tags: ["UniversityAdmissionApplicationLog"],
        description: "Retrieve a paginated list of UniversityAdmissionApplicationLog with optional search",
        operationId:"getUniversityAdmissionApplicationLogPaginated",
    )]
    #[OA\Parameter(
        name: "search",
        in: "query",
        description: "Search term",
        required: false,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Parameter(
        name: "page",
        in: "query",
        description: "Page number",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Parameter(
        name: "rows",
        in: "query",
        description: "Number of items per page",
        required: false,
        schema: new OA\Schema(type: "integer", default: 10)
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedUniversityAdmissionApplicationLogResponse200")
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthenticated",
        content: new OA\JsonContent(ref: "#/components/schemas/UnauthenticatedResponse")
    )]
    #[OA\Response(
        response: 403,
        description: "Forbidden",
        content: new OA\JsonContent(ref: "#/components/schemas/ForbiddenResponse")
    )]
    public function index(Request $request)
    {
        $srch = $request->query("search", '');
        $page = $request->query("page", 0);
        $rows = $request->query("rows", 10);
        return $this->ok($this->service->getAll(true, $page, $rows));
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: "/api/UniversityAdmissionApplicationLog/{id}",
        summary: "Get a specific UniversityAdmissionApplicationLog",
        tags: ["UniversityAdmissionApplicationLog"],
        description: "Retrieve a UniversityAdmissionApplicationLog by its ID",
        operationId: "getUniversityAdmissionApplicationLogById",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/GetUniversityAdmissionApplicationLogResponse200")
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthenticated",
        content: new OA\JsonContent(ref: "#/components/schemas/UnauthenticatedResponse")
    )]
    #[OA\Response(
        response: 403,
        description: "Forbidden",
        content: new OA\JsonContent(ref: "#/components/schemas/ForbiddenResponse")
    )]
    #[OA\Response(
        response: 404,
        description: "UniversityAdmissionApplicationLog not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('UniversityAdmissionApplicationLog not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/UniversityAdmissionApplicationLog",
        summary: "Create a new UniversityAdmissionApplicationLog",
        tags: ["UniversityAdmissionApplicationLog"],
        description:" Create a new UniversityAdmissionApplicationLog with the provided details",
        operationId: "createUniversityAdmissionApplicationLog",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UniversityAdmissionApplicationLog")
    )]
    #[OA\Response(
        response: 200,
        description: "UniversityAdmissionApplicationLog created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateUniversityAdmissionApplicationLogResponse200")
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthenticated",
        content: new OA\JsonContent(ref: "#/components/schemas/UnauthenticatedResponse")
    )]
    #[OA\Response(
        response: 403,
        description: "Forbidden",
        content: new OA\JsonContent(ref: "#/components/schemas/ForbiddenResponse")
    )]
    #[OA\Response(
        response: 422,
        description: "Validation error",
        content: new OA\JsonContent(ref: "#/components/schemas/ValidationErrorResponse")
    )]
    #[OA\Response(
        response: 500,
        description: "Internal server error",
        content: new OA\JsonContent(ref: "#/components/schemas/InternalServerErrorResponse")
    )]
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'university_admission_application_id' => 'required|integer|exists:university_admission_application,id',
                'user_id' => 'required|integer|exists:user,id',
                'type' => 'required|string|in:' . implode(',', array_column(AdmissionApplicationLogTypeEnum::cases(), 'value')),
                'note' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->create($validated));
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    #[OA\Put(
        path: "/api/UniversityAdmissionApplicationLog/{id}",
        summary: "Update a UniversityAdmissionApplicationLog",
        tags: ["UniversityAdmissionApplicationLog"],
        description: "Update an existing UniversityAdmissionApplicationLog with the provided details",
        operationId: "updateUniversityAdmissionApplicationLog",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UniversityAdmissionApplicationLog")
    )]
    #[OA\Response(
        response: 200,
        description: "UniversityAdmissionApplicationLog updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateUniversityAdmissionApplicationLogResponse200")
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthenticated",
        content: new OA\JsonContent(ref: "#/components/schemas/UnauthenticatedResponse")
    )]
    #[OA\Response(
        response: 403,
        description: "Forbidden",
        content: new OA\JsonContent(ref: "#/components/schemas/ForbiddenResponse")
    )]
    #[OA\Response(
        response: 404,
        description: "UniversityAdmissionApplicationLog not found"
    )]
    #[OA\Response(
        response: 422,
        description: "Validation error",
        content: new OA\JsonContent(ref: "#/components/schemas/ValidationErrorResponse")
    )]
    #[OA\Response(
        response: 500,
        description: "Internal server error",
        content: new OA\JsonContent(ref: "#/components/schemas/InternalServerErrorResponse")
    )]
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'university_admission_application_id' => 'required|integer|exists:university_admission_application,id',
                'user_id' => 'required|integer|exists:user,id',
                'type' => 'required|string|in:' . implode(',', array_column(AdmissionApplicationLogTypeEnum::cases(), 'value')),
                'note' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('UniversityAdmissionApplicationLog not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/UniversityAdmissionApplicationLog/{id}",
        summary: "Delete a UniversityAdmissionApplicationLog",
        tags: ["UniversityAdmissionApplicationLog"],
        description: "Delete a UniversityAdmissionApplicationLog by its ID",
        operationId: "deleteUniversityAdmissionApplicationLog",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "UniversityAdmissionApplicationLog deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteUniversityAdmissionApplicationLogResponse200")
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthenticated",
        content: new OA\JsonContent(ref: "#/components/schemas/UnauthenticatedResponse")
    )]
    #[OA\Response(
        response: 403,
        description: "Forbidden",
        content: new OA\JsonContent(ref: "#/components/schemas/ForbiddenResponse")
    )]
    #[OA\Response(
        response: 404,
        description: "UniversityAdmissionApplicationLog not found"
    )]
    #[OA\Response(
        response: 500,
        description:" Internal server error",
        content: new OA\JsonContent(ref: "#/components/schemas/InternalServerErrorResponse")
    )]
    public function destroy(string $id)
    {
        try {
            $this->service->delete($id);
            return $this->noContent();
        } catch (ModelNotFoundException $e) {
            return $this->notFound('UniversityAdmissionApplicationLog not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
