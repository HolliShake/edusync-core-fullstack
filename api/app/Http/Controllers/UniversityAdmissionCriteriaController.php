<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Service\UniversityAdmissionCriteriaService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/UniversityAdmissionCriteria"
)]
class UniversityAdmissionCriteriaController extends Controller
{
    public function __construct(protected UniversityAdmissionCriteriaService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/UniversityAdmissionCriteria",
        summary: "Get paginated list of UniversityAdmissionCriteria",
        tags: ["UniversityAdmissionCriteria"],
        description: "Retrieve a paginated list of UniversityAdmissionCriteria with optional search",
        operationId:"getUniversityAdmissionCriteriaPaginated",
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
        name: "filter[university_admission_id]",
        in: "query",
        description: "University admission ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedUniversityAdmissionCriteriaResponse200")
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
        path: "/api/UniversityAdmissionCriteria/{id}",
        summary: "Get a specific UniversityAdmissionCriteria",
        tags: ["UniversityAdmissionCriteria"],
        description: "Retrieve a UniversityAdmissionCriteria by its ID",
        operationId: "getUniversityAdmissionCriteriaById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetUniversityAdmissionCriteriaResponse200")
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
        description: "UniversityAdmissionCriteria not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('UniversityAdmissionCriteria not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/UniversityAdmissionCriteria",
        summary: "Create a new UniversityAdmissionCriteria",
        tags: ["UniversityAdmissionCriteria"],
        description:" Create a new UniversityAdmissionCriteria with the provided details",
        operationId: "createUniversityAdmissionCriteria",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UniversityAdmissionCriteria")
    )]
    #[OA\Response(
        response: 200,
        description: "UniversityAdmissionCriteria created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateUniversityAdmissionCriteriaResponse200")
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
                'university_admission_id' => 'required|exists:university_admission,id',
                'requirement_id' => 'required|exists:requirement,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'max_score' => 'required|integer',
                'min_score' => 'required|integer',
                'weight' => 'required|integer',
                'is_active' => 'required|boolean',
                'file_suffix' => 'required|string|max:255',
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
        path: "/api/UniversityAdmissionCriteria/{id}",
        summary: "Update a UniversityAdmissionCriteria",
        tags: ["UniversityAdmissionCriteria"],
        description: "Update an existing UniversityAdmissionCriteria with the provided details",
        operationId: "updateUniversityAdmissionCriteria",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UniversityAdmissionCriteria")
    )]
    #[OA\Response(
        response: 200,
        description: "UniversityAdmissionCriteria updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateUniversityAdmissionCriteriaResponse200")
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
        description: "UniversityAdmissionCriteria not found"
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
                'university_admission_id' => 'required|exists:university_admission,id',
                'requirement_id' => 'required|exists:requirement,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'max_score' => 'required|integer',
                'min_score' => 'required|integer',
                'weight' => 'required|integer',
                'is_active' => 'required|boolean',
                'file_suffix' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('UniversityAdmissionCriteria not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/UniversityAdmissionCriteria/{id}",
        summary: "Delete a UniversityAdmissionCriteria",
        tags: ["UniversityAdmissionCriteria"],
        description: "Delete a UniversityAdmissionCriteria by its ID",
        operationId: "deleteUniversityAdmissionCriteria",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "UniversityAdmissionCriteria deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteUniversityAdmissionCriteriaResponse200")
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
        description: "UniversityAdmissionCriteria not found"
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
            return $this->notFound('UniversityAdmissionCriteria not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
