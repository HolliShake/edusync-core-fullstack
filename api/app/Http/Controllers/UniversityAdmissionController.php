<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Service\UniversityAdmissionService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/UniversityAdmission"
)]
class UniversityAdmissionController extends Controller
{
    public function __construct(protected UniversityAdmissionService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/UniversityAdmission",
        summary: "Get paginated list of UniversityAdmission",
        tags: ["UniversityAdmission"],
        description: "Retrieve a paginated list of UniversityAdmission with optional search",
        operationId:"getUniversityAdmissionPaginated",
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
    #[OA\Parameter(
        name: "sort",
        in: "query",
        description: "Sort by fields and direction. Example: ?sort=-open_date (descending), ?sort=open_date (ascending). Supports multiple fields: ?sort=-open_date,title",
        required: false,
        schema: new OA\Schema(
            type: "string",
            example: "-open_date",
            default: "open_date"
        )
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedUniversityAdmissionResponse200")
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
     * Get current user's university admission invitation
     */
    #[OA\Get(
        path: "/api/UniversityAdmission/Invitation/{userId}",
        summary: "Get current user's university admission invitation",
        tags: ["UniversityAdmission"],
        description: "Retrieve the current user's university admission invitation if they haven't applied yet",
        operationId:"getCurrentUserInvitation",
    )]
    #[OA\Parameter(
        name: "userId",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/GetUniversityAdmissionResponse200")
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
    public function getCurrentUserInvitation(Request $request, $userId)
    {
        return $this->ok($this->service->getCurrentUserInvitation($userId));
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: "/api/UniversityAdmission/{id}",
        summary: "Get a specific UniversityAdmission",
        tags: ["UniversityAdmission"],
        description: "Retrieve a UniversityAdmission by its ID",
        operationId: "getUniversityAdmissionById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetUniversityAdmissionResponse200")
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
        description: "UniversityAdmission not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('UniversityAdmission not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/UniversityAdmission",
        summary: "Create a new UniversityAdmission",
        tags: ["UniversityAdmission"],
        description:" Create a new UniversityAdmission with the provided details",
        operationId: "createUniversityAdmission",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UniversityAdmission")
    )]
    #[OA\Response(
        response: 200,
        description: "UniversityAdmission created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateUniversityAdmissionResponse200")
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
                'school_year_id' => 'required|integer|exists:school_year,id',
                'open_date' => 'required|date',
                'close_date' => 'required|date|after:open_date',
                'is_open_override' => 'required|boolean',
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
        path: "/api/UniversityAdmission/{id}",
        summary: "Update a UniversityAdmission",
        tags: ["UniversityAdmission"],
        description: "Update an existing UniversityAdmission with the provided details",
        operationId: "updateUniversityAdmission",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UniversityAdmission")
    )]
    #[OA\Response(
        response: 200,
        description: "UniversityAdmission updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateUniversityAdmissionResponse200")
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
        description: "UniversityAdmission not found"
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
                'school_year_id' => 'required|integer|exists:school_year,id',
                'open_date' => 'required|date',
                'close_date' => 'required|date|after:open_date',
                'is_open_override' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('UniversityAdmission not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/UniversityAdmission/{id}",
        summary: "Delete a UniversityAdmission",
        tags: ["UniversityAdmission"],
        description: "Delete a UniversityAdmission by its ID",
        operationId: "deleteUniversityAdmission",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "UniversityAdmission deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteUniversityAdmissionResponse200")
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
        description: "UniversityAdmission not found"
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
            return $this->notFound('UniversityAdmission not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
