<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Service\DocumentRequestLogService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/DocumentRequestLog"
)]
class DocumentRequestLogController extends Controller
{
    public function __construct(protected DocumentRequestLogService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/DocumentRequestLog",
        summary: "Get paginated list of DocumentRequestLog",
        tags: ["DocumentRequestLog"],
        description: "Retrieve a paginated list of DocumentRequestLog with optional search",
        operationId:"getDocumentRequestLogPaginated",
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
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedDocumentRequestLogResponse200")
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
        path: "/api/DocumentRequestLog/{id}",
        summary: "Get a specific DocumentRequestLog",
        tags: ["DocumentRequestLog"],
        description: "Retrieve a DocumentRequestLog by its ID",
        operationId: "getDocumentRequestLogById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetDocumentRequestLogResponse200")
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
        description: "DocumentRequestLog not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('DocumentRequestLog not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/DocumentRequestLog",
        summary: "Create a new DocumentRequestLog",
        tags: ["DocumentRequestLog"],
        description:" Create a new DocumentRequestLog with the provided details",
        operationId: "createDocumentRequestLog",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/DocumentRequestLog")
    )]
    #[OA\Response(
        response: 200,
        description: "DocumentRequestLog created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateDocumentRequestLogResponse200")
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
        path: "/api/DocumentRequestLog/{id}",
        summary: "Update a DocumentRequestLog",
        tags: ["DocumentRequestLog"],
        description: "Update an existing DocumentRequestLog with the provided details",
        operationId: "updateDocumentRequestLog",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/DocumentRequestLog")
    )]
    #[OA\Response(
        response: 200,
        description: "DocumentRequestLog updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateDocumentRequestLogResponse200")
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
        description: "DocumentRequestLog not found"
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
            return $this->notFound('DocumentRequestLog not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/DocumentRequestLog/{id}",
        summary: "Delete a DocumentRequestLog",
        tags: ["DocumentRequestLog"],
        description: "Delete a DocumentRequestLog by its ID",
        operationId: "deleteDocumentRequestLog",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "DocumentRequestLog deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteDocumentRequestLogResponse200")
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
        description: "DocumentRequestLog not found"
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
            return $this->notFound('DocumentRequestLog not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
