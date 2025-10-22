<?php

namespace App\Http\Controllers;

use App\Service\AdmissionApplicationScoreService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/AdmissionApplicationScore"
)]
class AdmissionApplicationScoreController extends Controller
{
    public function __construct(protected AdmissionApplicationScoreService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/AdmissionApplicationScore",
        summary: "Get paginated list of AdmissionApplicationScore",
        tags: ["AdmissionApplicationScore"],
        description: "Retrieve a paginated list of AdmissionApplicationScore with optional search",
        operationId:"getAdmissionApplicationScorePaginated",
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
        name: "filter[admission_application_id]",
        in: "query",
        description: "Filter by admission application ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedAdmissionApplicationScoreResponse200")
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
        path: "/api/AdmissionApplicationScore/{id}",
        summary: "Get a specific AdmissionApplicationScore",
        tags: ["AdmissionApplicationScore"],
        description: "Retrieve a AdmissionApplicationScore by its ID",
        operationId: "getAdmissionApplicationScoreById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetAdmissionApplicationScoreResponse200")
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
        description: "AdmissionApplicationScore not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('AdmissionApplicationScore not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/AdmissionApplicationScore",
        summary: "Create a new AdmissionApplicationScore",
        tags: ["AdmissionApplicationScore"],
        description:" Create a new AdmissionApplicationScore with the provided details",
        operationId: "createAdmissionApplicationScore",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AdmissionApplicationScore")
    )]
    #[OA\Response(
        response: 200,
        description: "AdmissionApplicationScore created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateAdmissionApplicationScoreResponse200")
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
                'admission_application_id' => 'required|integer|exists:admission_application,id',
                'academic_program_criteria_id' => 'required|integer|exists:academic_program_criteria,id',
                'user_id' => 'required|integer|exists:user,id',
                'score' => 'required|numeric',
                'comments' => 'nullable|string',
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
     * Create or update multiple AdmissionApplicationScores.
     */
    #[OA\Post(
        path: "/api/AdmissionApplicationScore/createOrUpdateMultiple",
        summary: "Create or update multiple AdmissionApplicationScores",
        tags: ["AdmissionApplicationScore"],
        description: "Create or update multiple AdmissionApplicationScores with the provided details",
        operationId: "createOrUpdateMultipleAdmissionApplicationScores",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(ref: "#/components/schemas/AdmissionApplicationScore")
        )
    )]
    #[OA\Response(
        response: 200,
        description: "CurriculumDetail created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/GetAdmissionApplicationScoresResponse200")
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
    public function createOrUpdateMultiple(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                '*.admission_application_id' => 'required|integer|exists:admission_application,id',
                '*.academic_program_criteria_id' => 'required|integer|exists:academic_program_criteria,id',
                '*.user_id' => 'required|integer|exists:user,id',
                '*.score' => 'required|numeric',
                '*.comments' => 'nullable|string',
                '*.is_posted' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->createOrUpdateMultiple($validated));
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    #[OA\Put(
        path: "/api/AdmissionApplicationScore/{id}",
        summary: "Update a AdmissionApplicationScore",
        tags: ["AdmissionApplicationScore"],
        description: "Update an existing AdmissionApplicationScore with the provided details",
        operationId: "updateAdmissionApplicationScore",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AdmissionApplicationScore")
    )]
    #[OA\Response(
        response: 200,
        description: "AdmissionApplicationScore updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateAdmissionApplicationScoreResponse200")
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
        description: "AdmissionApplicationScore not found"
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
                'admission_application_id' => 'required|integer|exists:admission_application,id',
                'academic_program_criteria_id' => 'required|integer|exists:academic_program_criteria,id',
                'user_id' => 'required|integer|exists:user,id',
                'score' => 'required|numeric',
                'comments' => 'nullable|string',
                'is_posted' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('AdmissionApplicationScore not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/AdmissionApplicationScore/{id}",
        summary: "Delete a AdmissionApplicationScore",
        tags: ["AdmissionApplicationScore"],
        description: "Delete a AdmissionApplicationScore by its ID",
        operationId: "deleteAdmissionApplicationScore",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "AdmissionApplicationScore deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteAdmissionApplicationScoreResponse200")
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
        description: "AdmissionApplicationScore not found"
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
            return $this->notFound('AdmissionApplicationScore not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
