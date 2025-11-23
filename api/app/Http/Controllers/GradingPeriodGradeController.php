<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Service\GradingPeriodGradeService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/GradingPeriodGrade"
)]
class GradingPeriodGradeController extends Controller
{
    public function __construct(protected GradingPeriodGradeService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/GradingPeriodGrade",
        summary: "Get paginated list of GradingPeriodGrade",
        tags: ["GradingPeriodGrade"],
        description: "Retrieve a paginated list of GradingPeriodGrade with optional search",
        operationId:"getGradingPeriodGradePaginated",
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
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedGradingPeriodGradeResponse200")
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
        path: "/api/GradingPeriodGrade/get-sync/{section_id}",
        summary: "Get list of GradingPeriodGrade for sync",
        tags: ["GradingPeriodGrade"],
        description: "Retrieve a sync list of GradingPeriodGrade",
        operationId: "getSyncGradingPeriodGrade",
    )]
    #[OA\Parameter(
        name: "section_id",
        in: "path",
        description: "Section ID",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/GetSyncGradingPeriodGradesResponse200")
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
    public function getSyncGradingPeriodGrade(Request $request, $section_id)
    {
        return $this->ok($this->service->getSync($section_id));
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: "/api/GradingPeriodGrade/{id}",
        summary: "Get a specific GradingPeriodGrade",
        tags: ["GradingPeriodGrade"],
        description: "Retrieve a GradingPeriodGrade by its ID",
        operationId: "getGradingPeriodGradeById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetGradingPeriodGradeResponse200")
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
        description: "GradingPeriodGrade not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('GradingPeriodGrade not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/GradingPeriodGrade",
        summary: "Create a new GradingPeriodGrade",
        tags: ["GradingPeriodGrade"],
        description:" Create a new GradingPeriodGrade with the provided details",
        operationId: "createGradingPeriodGrade",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/GradingPeriodGrade")
    )]
    #[OA\Response(
        response: 200,
        description: "GradingPeriodGrade created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateGradingPeriodGradeResponse200")
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
                'gradebook_grading_period_id' => 'required|integer|exists:gradebook_grading_period,id',
                'enrollment_id' => 'required|integer|exists:enrollment,id',
                'grade' => 'required|numeric',
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

    #[OA\Post(
        path: "/api/GradingPeriodGrade/sync-grading-period-grade/{section_id}",
        summary: "Sync grading period grade for a section",
        tags: ["GradingPeriodGrade"],
        description: "Sync grading period grade for a section with the provided details",
        operationId: "syncGradingPeriodGradeForSection",
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
            items: new OA\Items(ref: "#/components/schemas/SyncGradingPeriodGrade")
        )
    )]
    #[OA\Response(
        response: 200,
        description: "GradingPeriodGrade synced successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/GetSyncGradingPeriodGradesResponse200")
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
    public function syncGradingPeriodGradeForSection(Request $request, $section_id)
    {
        try {
            $validator = Validator::make($request->all(), [
                '*.id' => 'nullable|integer|exists:grading_period_grade,id',
                '*.gradebook_grading_period_id' => 'required|integer|exists:gradebook_grading_period,id',
                '*.enrollment_id' => 'required|integer|exists:enrollment,id',
                '*.grade' => 'required|numeric',
                '*.is_posted' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->syncGradingPeriodGradeForSection($section_id, $validated));
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    #[OA\Put(
        path: "/api/GradingPeriodGrade/{id}",
        summary: "Update a GradingPeriodGrade",
        tags: ["GradingPeriodGrade"],
        description: "Update an existing GradingPeriodGrade with the provided details",
        operationId: "updateGradingPeriodGrade",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/GradingPeriodGrade")
    )]
    #[OA\Response(
        response: 200,
        description: "GradingPeriodGrade updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateGradingPeriodGradeResponse200")
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
        description: "GradingPeriodGrade not found"
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
                'gradebook_grading_period_id' => 'required|integer|exists:gradebook_grading_period,id',
                'enrollment_id' => 'required|integer|exists:enrollment,id',
                'grade' => 'required|numeric',
                'is_posted' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('GradingPeriodGrade not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/GradingPeriodGrade/{id}",
        summary: "Delete a GradingPeriodGrade",
        tags: ["GradingPeriodGrade"],
        description: "Delete a GradingPeriodGrade by its ID",
        operationId: "deleteGradingPeriodGrade",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "GradingPeriodGrade deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteGradingPeriodGradeResponse200")
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
        description: "GradingPeriodGrade not found"
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
            return $this->notFound('GradingPeriodGrade not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
