<?php

namespace App\Http\Controllers;

use App\Service\CurriculumService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/Curriculum"
)]
class CurriculumController extends Controller
{
    public function __construct(protected CurriculumService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/Curriculum",
        summary: "Get paginated list of Curriculum",
        tags: ["Curriculum"],
        description: "Retrieve a paginated list of Curriculum with optional search",
        operationId:"getCurriculumPaginated",
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
        description: "Filter by academic program ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "paginate",
        in: "query",
        description: "Paginate the results",
        required: false,
        schema: new OA\Schema(type: "boolean", default: true)
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedCurriculumResponse200")
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
        $paginate = filter_var($request->query("paginate", true), FILTER_VALIDATE_BOOLEAN);
        return $this->ok($this->service->getAll($paginate, $page, $rows));
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: "/api/Curriculum/{id}",
        summary: "Get a specific Curriculum",
        tags: ["Curriculum"],
        description: "Retrieve a Curriculum by its ID",
        operationId: "getCurriculumById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetCurriculumResponse200")
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
        description: "Curriculum not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('Curriculum not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/Curriculum",
        summary: "Create a new Curriculum",
        tags: ["Curriculum"],
        description:" Create a new Curriculum with the provided details",
        operationId: "createCurriculum",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/Curriculum")
    )]
    #[OA\Response(
        response: 200,
        description: "Curriculum created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateCurriculumResponse200")
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
                'academic_program_id' => 'required|exists:academic_program,id',
                'academic_term_id' => 'required|exists:academic_term,id',
                'curriculum_code' => 'required|string|unique:curriculum,curriculum_code',
                'curriculum_name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'effective_year' => 'required|integer|min:1900|max:' . (date('Y') + 10),
                'total_units' => 'nullable|integer|min:0',
                'total_hours' => 'nullable|integer|min:0',
                'status' => 'nullable|in:active,inactive,archived',
                'approved_date' => 'nullable|date|before_or_equal:today'
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
        path: "/api/Curriculum/{id}",
        summary: "Update a Curriculum",
        tags: ["Curriculum"],
        description: "Update an existing Curriculum with the provided details",
        operationId: "updateCurriculum",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/Curriculum")
    )]
    #[OA\Response(
        response: 200,
        description: "Curriculum updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateCurriculumResponse200")
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
        description: "Curriculum not found"
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
                'academic_term_id' => 'required|integer|exists:academic_term,id',
                'curriculum_code' => 'required|string|max:255|unique:curriculum,curriculum_code,' . $id,
                'curriculum_name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'effective_year' => 'required|integer|min:1900|max:' . (date('Y') + 10),
                'total_units' => 'required|integer|min:0',
                'total_hours' => 'required|integer|min:0',
                'status' => 'required|in:active,inactive,archived',
                'approved_date' => 'nullable|date|before_or_equal:today',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('Curriculum not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/Curriculum/{id}",
        summary: "Delete a Curriculum",
        tags: ["Curriculum"],
        description: "Delete a Curriculum by its ID",
        operationId: "deleteCurriculum",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "Curriculum deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteCurriculumResponse200")
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
        description: "Curriculum not found"
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
            return $this->notFound('Curriculum not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
