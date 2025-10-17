<?php

namespace App\Http\Controllers;

use App\Service\CurriculumDetailService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/CurriculumDetail"
)]
class CurriculumDetailController extends Controller
{
    public function __construct(protected CurriculumDetailService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/CurriculumDetail",
        summary: "Get paginated list of CurriculumDetail",
        tags: ["CurriculumDetail"],
        description: "Retrieve a paginated list of CurriculumDetail with optional search",
        operationId:"getCurriculumDetailPaginated",
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
        name: "filter[curriculum_id]",
        in: "query",
        description: "Filter by curriculum ID",
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
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedCurriculumDetailResponse200")
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
        path: "/api/CurriculumDetail/{id}",
        summary: "Get a specific CurriculumDetail",
        tags: ["CurriculumDetail"],
        description: "Retrieve a CurriculumDetail by its ID",
        operationId: "getCurriculumDetailById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetCurriculumDetailResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "CurriculumDetail not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('CurriculumDetail not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/CurriculumDetail",
        summary: "Create a new CurriculumDetail",
        tags: ["CurriculumDetail"],
        description:" Create a new CurriculumDetail with the provided details",
        operationId: "createCurriculumDetail",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/CurriculumDetail")
    )]
    #[OA\Response(
        response: 200,
        description: "CurriculumDetail created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateCurriculumDetailResponse200")
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
     * Create multiple CurriculumDetail.
     */
    #[OA\Post(
        path: "/api/CurriculumDetail/multiple",
        summary: "Create multiple CurriculumDetail",
        tags: ["CurriculumDetail"],
        description: "Create multiple CurriculumDetail with the provided details",
        operationId: "createMultipleCurriculumDetail",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/MultipleCurriculumDetail")
    )]
    #[OA\Response(
        response: 200,
        description: "CurriculumDetail created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/GetCurriculumDetailsResponse200")
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
    public function createMultiple(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'curriculum_id' => 'required|exists:curriculum,id',
                'year_order' => 'required|integer|min:1',
                'term_order' => 'required|integer|min:1',
                'term_alias' => 'required|string|max:255',
                'is_include_gwa' => 'required|boolean',
                'courses' => 'required|array|min:1',
                'courses.*' => 'required|integer|exists:course,id',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->createMultiple($validated));
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
    /**
     * Update the specified resource in storage.
     */
    #[OA\Put(
        path: "/api/CurriculumDetail/{id}",
        summary: "Update a CurriculumDetail",
        tags: ["CurriculumDetail"],
        description: "Update an existing CurriculumDetail with the provided details",
        operationId: "updateCurriculumDetail",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/CurriculumDetail")
    )]
    #[OA\Response(
        response: 200,
        description: "CurriculumDetail updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateCurriculumDetailResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "CurriculumDetail not found"
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
            return $this->notFound('CurriculumDetail not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/CurriculumDetail/{id}",
        summary: "Delete a CurriculumDetail",
        tags: ["CurriculumDetail"],
        description: "Delete a CurriculumDetail by its ID",
        operationId: "deleteCurriculumDetail",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "CurriculumDetail deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteCurriculumDetailResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "CurriculumDetail not found"
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
            return $this->notFound('CurriculumDetail not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
