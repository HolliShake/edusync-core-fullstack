<?php

namespace App\Http\Controllers;

use App\Service\BuildingService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/Building"
)]
class BuildingController extends Controller
{
    public function __construct(protected BuildingService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/Building",
        summary: "Get paginated list of Building",
        tags: ["Building"],
        description: "Retrieve a paginated list of Building with optional search",
        operationId:"getBuildingPaginated",
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
        name: "filter[campus_id]",
        in: "query",
        description: "Filter by Campus ID",
        required: false,
        schema: new OA\Schema(type: "integer")
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
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedBuildingResponse200")
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
        path: "/api/Building/{id}",
        summary: "Get a specific Building",
        tags: ["Building"],
        description: "Retrieve a Building by its ID",
        operationId: "getBuildingById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetBuildingResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "Building not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('Building not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/Building/create",
        summary: "Create a new Building",
        tags: ["Building"],
        description:" Create a new Building with the provided details",
        operationId: "createBuilding",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/Building")
    )]
    #[OA\Response(
        response: 200,
        description: "Building created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateBuildingResponse200")
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
                'name'       => 'required|string|max:50',
                'short_name' => 'required|string|max:25',
                'latitude'   => 'required|numeric|between:-90,90',
                'longitude'  => 'required|numeric|between:-180,180',
                'campus_id'  => 'required|integer|exists:campus,id'
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
        path: "/api/Building/update/{id}",
        summary: "Update a Building",
        tags: ["Building"],
        description: "Update an existing Building with the provided details",
        operationId: "updateBuilding",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/Building")
    )]
    #[OA\Response(
        response: 200,
        description: "Building updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateBuildingResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "Building not found"
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
                'name'       => 'sometimes|string|max:50',
                'short_name' => 'sometimes|string|max:25',
                'latitude'   => 'sometimes|numeric|between:-90,90',
                'longitude'  => 'sometimes|numeric|between:-180,180',
                'campus_id'  => 'sometimes|integer|exists:campus,id'
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('Building not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/Building/delete/{id}",
        summary: "Delete a Building",
        tags: ["Building"],
        description: "Delete a Building by its ID",
        operationId: "deleteBuilding",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "Building deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteBuildingResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "Building not found"
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
            return $this->notFound('Building not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
