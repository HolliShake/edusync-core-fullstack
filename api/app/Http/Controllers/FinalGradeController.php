<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Service\FinalGradeService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/FinalGrade"
)]
class FinalGradeController extends Controller
{
    public function __construct(protected FinalGradeService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/FinalGrade",
        summary: "Get paginated list of FinalGrade",
        tags: ["FinalGrade"],
        description: "Retrieve a paginated list of FinalGrade with optional search",
        operationId:"getFinalGradePaginated",
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
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedFinalGradeResponse200")
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

    #[OA\Get(
        path: "/api/FinalGrade/get-sync/{section_id}",
        summary: "Get sync FinalGrade",
        tags: ["FinalGrade"],
        description: "Retrieve a sync FinalGrade by its enrollment ID",
        operationId: "getSyncFinalGrade",
    )]
    #[OA\Parameter(
        name: "section_id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/GetSyncFinalGradesResponse200")
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
        response: 500,
        description: "Internal server error",
        content: new OA\JsonContent(ref: "#/components/schemas/InternalServerErrorResponse")
    )]
    public function getSyncFinalGrade(Request $request, $section_id)
    {
        return $this->ok($this->service->getSync($section_id));
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: "/api/FinalGrade/{id}",
        summary: "Get a specific FinalGrade",
        tags: ["FinalGrade"],
        description: "Retrieve a FinalGrade by its ID",
        operationId: "getFinalGradeById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetFinalGradeResponse200")
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
        description: "FinalGrade not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('FinalGrade not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/FinalGrade",
        summary: "Create a new FinalGrade",
        tags: ["FinalGrade"],
        description:" Create a new FinalGrade with the provided details",
        operationId: "createFinalGrade",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/FinalGrade")
    )]
    #[OA\Response(
        response: 200,
        description: "FinalGrade created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateFinalGradeResponse200")
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
                'enrollment_id' => 'required|integer|exists:enrollment,id',
                'grade' => 'required|numeric',
                'credited_units' => 'required|integer',
                'is_posted' => 'required|boolean',
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
     * Create or update multiple FinalGrades.
     */
    #[OA\Post(
        path: "/api/FinalGrade/sync-final-grade/{section_id}",
        summary: "Sync final grade for a section",
        tags: ["FinalGrade"],
        description: "Sync final grade for a section with the provided details",
        operationId: "syncFinalGradeForSection",
    )]
    #[OA\Parameter(
        name: "section_id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(ref: "#/components/schemas/SyncFinalGrade")
        )
    )]
    #[OA\Response(
        response: 200,
        description: "FinalGrades created or updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/GetSyncFinalGradesResponse200")
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
    public function syncFinalGradeForSection(Request $request, $section_id)
    {
        try {
            $validator = Validator::make($request->all(), [
                '*.id' => 'nullable|integer|exists:final_grade,id',
                '*.enrollment_id' => 'required|integer|exists:enrollment,id',
                '*.grade' => 'nullable|numeric',
                '*.credited_units' => 'nullable|integer',
                '*.is_posted' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->syncFinalGradeForSection($section_id, $validated));
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    #[OA\Put(
        path: "/api/FinalGrade/{id}",
        summary: "Update a FinalGrade",
        tags: ["FinalGrade"],
        description: "Update an existing FinalGrade with the provided details",
        operationId: "updateFinalGrade",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/FinalGrade")
    )]
    #[OA\Response(
        response: 200,
        description: "FinalGrade updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateFinalGradeResponse200")
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
        description: "FinalGrade not found"
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
                'enrollment_id' => 'required|integer|exists:enrollment,id',
                'grade' => 'required|numeric',
                'credited_units' => 'required|integer',
                'is_posted' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('FinalGrade not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/FinalGrade/{id}",
        summary: "Delete a FinalGrade",
        tags: ["FinalGrade"],
        description: "Delete a FinalGrade by its ID",
        operationId: "deleteFinalGrade",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "FinalGrade deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteFinalGradeResponse200")
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
        description: "FinalGrade not found"
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
            return $this->notFound('FinalGrade not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
