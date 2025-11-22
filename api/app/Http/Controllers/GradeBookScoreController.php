<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Service\GradeBookScoreService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/GradeBookScore"
)]
class GradeBookScoreController extends Controller
{
    public function __construct(protected GradeBookScoreService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/GradeBookScore",
        summary: "Get paginated list of GradeBookScore",
        tags: ["GradeBookScore"],
        description: "Retrieve a paginated list of GradeBookScore with optional search",
        operationId:"getGradeBookScorePaginated",
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
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedGradeBookScoreResponse200")
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
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/GradeBookScore/get-sync/{section_id}",
        summary: "Get list of GradeBookScore for sync",
        tags: ["GradeBookScore"],
        description: "Retrieve a sync list of GradeBookScore",
        operationId: "getSyncGradeBookScore",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetSyncGradeBookScoresResponse200")
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
    public function getSyncGradeBookScore(Request $request, $section_id)
    {
        return $this->ok($this->service->getSync($section_id));
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: "/api/GradeBookScore/{id}",
        summary: "Get a specific GradeBookScore",
        tags: ["GradeBookScore"],
        description: "Retrieve a GradeBookScore by its ID",
        operationId: "getGradeBookScoreById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetGradeBookScoreResponse200")
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
        description: "GradeBookScore not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('GradeBookScore not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/GradeBookScore",
        summary: "Create a new GradeBookScore",
        tags: ["GradeBookScore"],
        description:" Create a new GradeBookScore with the provided details",
        operationId: "createGradeBookScore",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/GradeBookScore")
    )]
    #[OA\Response(
        response: 200,
        description: "GradeBookScore created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateGradeBookScoreResponse200")
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
                'gradebook_item_detail_id' => 'required|integer',
                'enrollment_id' => 'required|integer',
                'score' => 'required|numeric',
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
     * Create or update multiple GradeBookScores.
     */
    #[OA\Post(
        path: "/api/GradeBookScore/sync-score/{section_id}",
        summary: "Sync score for a section",
        tags: ["GradeBookScore"],
        description: "Sync score for a section with the provided details",
        operationId: "syncScoreForSection",
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
            items: new OA\Items(ref: "#/components/schemas/GradeBookScore")
        )
    )]
    #[OA\Response(
        response: 200,
        description: "GradeBookScores created or updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/GetSyncGradeBookScoresResponse200")
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
    public function syncScoreForSection(Request $request, $section_id)
    {
        try {
            $validator = Validator::make($request->all(), [
                '*.id' => 'nullable|integer|exists:gradebook_score,id',
                '*.gradebook_item_detail_id' => 'required|integer|exists:gradebook_item_detail,id',
                '*.enrollment_id' => 'required|integer|exists:enrollment,id',
                '*.score' => 'required|numeric',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->syncScoreForSection($section_id, $validated));
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    #[OA\Put(
        path: "/api/GradeBookScore/{id}",
        summary: "Update a GradeBookScore",
        tags: ["GradeBookScore"],
        description: "Update an existing GradeBookScore with the provided details",
        operationId: "updateGradeBookScore",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/GradeBookScore")
    )]
    #[OA\Response(
        response: 200,
        description: "GradeBookScore updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateGradeBookScoreResponse200")
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
        description: "GradeBookScore not found"
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
                'gradebook_item_detail_id' => 'required|integer',
                'enrollment_id' => 'required|integer',
                'score' => 'required|numeric',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('GradeBookScore not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/GradeBookScore/{id}",
        summary: "Delete a GradeBookScore",
        tags: ["GradeBookScore"],
        description: "Delete a GradeBookScore by its ID",
        operationId: "deleteGradeBookScore",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "GradeBookScore deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteGradeBookScoreResponse200")
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
        description: "GradeBookScore not found"
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
            return $this->notFound('GradeBookScore not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
