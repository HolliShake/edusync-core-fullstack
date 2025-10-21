<?php

namespace App\Http\Controllers;

use App\Service\AcademicProgramCriteriaService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/AcademicProgramCriteria"
)]
class AcademicProgramCriteriaController extends Controller
{
    public function __construct(protected AcademicProgramCriteriaService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/AcademicProgramCriteria",
        summary: "Get paginated list of AcademicProgramCriteria",
        tags: ["AcademicProgramCriteria"],
        description: "Retrieve a paginated list of AcademicProgramCriteria with optional search",
        operationId:"getAcademicProgramCriteriaPaginated",
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
        name: "filter[academic_program_id]",
        in: "query",
        description: "Academic program ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "filter[school_year_id]",
        in: "query",
        description: "School year ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedAcademicProgramCriteriaResponse200")
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
        path: "/api/AcademicProgramCriteria/{id}",
        summary: "Get a specific AcademicProgramCriteria",
        tags: ["AcademicProgramCriteria"],
        description: "Retrieve a AcademicProgramCriteria by its ID",
        operationId: "getAcademicProgramCriteriaById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetAcademicProgramCriteriaResponse200")
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
        description: "AcademicProgramCriteria not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('AcademicProgramCriteria not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/AcademicProgramCriteria",
        summary: "Create a new AcademicProgramCriteria",
        tags: ["AcademicProgramCriteria"],
        description:" Create a new AcademicProgramCriteria with the provided details",
        operationId: "createAcademicProgramCriteria",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AcademicProgramCriteria")
    )]
    #[OA\Response(
        response: 200,
        description: "AcademicProgramCriteria created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateAcademicProgramCriteriaResponse200")
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
                'academic_program_id' => 'required|integer|exists:academic_program,id',
                'school_year_id' => 'required|integer|exists:school_year,id',
                'title' => 'required|string',
                'description' => 'nullable|string',
                'max_score' => 'required|integer',
                'min_score' => 'required|integer',
                'weight' => 'required|integer',
                'is_active' => 'boolean',
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
        path: "/api/AcademicProgramCriteria/{id}",
        summary: "Update a AcademicProgramCriteria",
        tags: ["AcademicProgramCriteria"],
        description: "Update an existing AcademicProgramCriteria with the provided details",
        operationId: "updateAcademicProgramCriteria",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AcademicProgramCriteria")
    )]
    #[OA\Response(
        response: 200,
        description: "AcademicProgramCriteria updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateAcademicProgramCriteriaResponse200")
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
        description: "AcademicProgramCriteria not found"
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
                'academic_program_id' => 'required|integer|exists:academic_program,id',
                'school_year_id' => 'required|integer|exists:school_year,id',
                'title' => 'required|string',
                'description' => 'nullable|string',
                'max_score' => 'required|integer',
                'min_score' => 'required|integer',
                'weight' => 'required|integer',
                'is_active' => 'boolean',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('AcademicProgramCriteria not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/AcademicProgramCriteria/{id}",
        summary: "Delete a AcademicProgramCriteria",
        tags: ["AcademicProgramCriteria"],
        description: "Delete a AcademicProgramCriteria by its ID",
        operationId: "deleteAcademicProgramCriteria",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "AcademicProgramCriteria deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteAcademicProgramCriteriaResponse200")
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
        description: "AcademicProgramCriteria not found"
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
            return $this->notFound('AcademicProgramCriteria not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
