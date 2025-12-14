<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Service\UniversityAdmissionApplicationCriteriaSubmissionService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/UniversityAdmissionApplicationCriteriaSubmission"
)]
class UniversityAdmissionApplicationCriteriaSubmissionController extends Controller
{
    public function __construct(protected UniversityAdmissionApplicationCriteriaSubmissionService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/UniversityAdmissionApplicationCriteriaSubmission",
        summary: "Get paginated list of UniversityAdmissionApplicationCriteriaSubmission",
        tags: ["UniversityAdmissionApplicationCriteriaSubmission"],
        description: "Retrieve a paginated list of UniversityAdmissionApplicationCriteriaSubmission with optional search",
        operationId:"getUniversityAdmissionApplicationCriteriaSubmissionPaginated",
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
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedUniversityAdmissionApplicationCriteriaSubmissionResponse200")
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
        path: "/api/UniversityAdmissionApplicationCriteriaSubmission/{id}",
        summary: "Get a specific UniversityAdmissionApplicationCriteriaSubmission",
        tags: ["UniversityAdmissionApplicationCriteriaSubmission"],
        description: "Retrieve a UniversityAdmissionApplicationCriteriaSubmission by its ID",
        operationId: "getUniversityAdmissionApplicationCriteriaSubmissionById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetUniversityAdmissionApplicationCriteriaSubmissionResponse200")
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
        description: "UniversityAdmissionApplicationCriteriaSubmission not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('UniversityAdmissionApplicationCriteriaSubmission not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/UniversityAdmissionApplicationCriteriaSubmission",
        summary: "Create a new UniversityAdmissionApplicationCriteriaSubmission",
        tags: ["UniversityAdmissionApplicationCriteriaSubmission"],
        description:" Create a new UniversityAdmissionApplicationCriteriaSubmission with the provided details",
        operationId: "createUniversityAdmissionApplicationCriteriaSubmission",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UniversityAdmissionApplicationCriteriaSubmission")
    )]
    #[OA\Response(
        response: 200,
        description: "UniversityAdmissionApplicationCriteriaSubmission created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateUniversityAdmissionApplicationCriteriaSubmissionResponse200")
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
        path: "/api/UniversityAdmissionApplicationCriteriaSubmission/{id}",
        summary: "Update a UniversityAdmissionApplicationCriteriaSubmission",
        tags: ["UniversityAdmissionApplicationCriteriaSubmission"],
        description: "Update an existing UniversityAdmissionApplicationCriteriaSubmission with the provided details",
        operationId: "updateUniversityAdmissionApplicationCriteriaSubmission",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UniversityAdmissionApplicationCriteriaSubmission")
    )]
    #[OA\Response(
        response: 200,
        description: "UniversityAdmissionApplicationCriteriaSubmission updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateUniversityAdmissionApplicationCriteriaSubmissionResponse200")
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
        description: "UniversityAdmissionApplicationCriteriaSubmission not found"
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

            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('UniversityAdmissionApplicationCriteriaSubmission not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/UniversityAdmissionApplicationCriteriaSubmission/{id}",
        summary: "Delete a UniversityAdmissionApplicationCriteriaSubmission",
        tags: ["UniversityAdmissionApplicationCriteriaSubmission"],
        description: "Delete a UniversityAdmissionApplicationCriteriaSubmission by its ID",
        operationId: "deleteUniversityAdmissionApplicationCriteriaSubmission",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "UniversityAdmissionApplicationCriteriaSubmission deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteUniversityAdmissionApplicationCriteriaSubmissionResponse200")
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
        description: "UniversityAdmissionApplicationCriteriaSubmission not found"
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
            return $this->notFound('UniversityAdmissionApplicationCriteriaSubmission not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
