<?php

namespace App\Http\Controllers;

use App\Service\SchoolYearService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/SchoolYear"
)]
class SchoolYearController extends Controller
{
    public function __construct(protected SchoolYearService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/SchoolYear",
        summary: "Get paginated list of SchoolYear",
        tags: ["SchoolYear"],
        description: "Retrieve a paginated list of SchoolYear with optional search",
        operationId:"getSchoolYearPaginated",
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
        name: "sort",
        in: "query",
        description: "Sort by fields and direction. Example: ?sort=-start_date (descending), ?sort=start_date (ascending). Supports multiple fields: ?sort=-start_date,title",
        required: false,
        schema: new OA\Schema(
            type: "string",
            example: "-start_date",
            default: "start_date"
        )
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedSchoolYearResponse200")
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
        path: "/api/SchoolYear/{id}",
        summary: "Get a specific SchoolYear",
        tags: ["SchoolYear"],
        description: "Retrieve a SchoolYear by its ID",
        operationId: "getSchoolYearById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetSchoolYearResponse200")
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
        description: "SchoolYear not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('SchoolYear not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/SchoolYear",
        summary: "Create a new SchoolYear",
        tags: ["SchoolYear"],
        description:" Create a new SchoolYear with the provided details",
        operationId: "createSchoolYear",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/SchoolYear")
    )]
    #[OA\Response(
        response: 200,
        description: "SchoolYear created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateSchoolYearResponse200")
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
                'school_year_code' => 'required|string|unique:school_year,school_year_code',
                'name' => 'required|string',
                'start_date' => 'required|string|date',
                'end_date' => 'required|string|date|after_or_equal:start_date',
                'is_active' => 'required|boolean',
            ]);

            // Return validation errors if the initial validation fails
            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            // Custom validation - overlapping date ranges
            $start = $request->input('start_date');
            $end = $request->input('end_date');
            if ($start && $end) {
                $overlap = DB::table('school_year')
                    ->where(function ($q) use ($start, $end) {
                        $q->where('start_date', '<=', $end)
                          ->where('end_date', '>=', $start);
                    })
                    ->exists();
                if ($overlap) {
                    return $this->validationError(['start_date' => ['Date range overlaps with an existing SchoolYear.']]);
                }
            }

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
        path: "/api/SchoolYear/{id}",
        summary: "Update a SchoolYear",
        tags: ["SchoolYear"],
        description: "Update an existing SchoolYear with the provided details",
        operationId: "updateSchoolYear",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/SchoolYear")
    )]
    #[OA\Response(
        response: 200,
        description: "SchoolYear updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateSchoolYearResponse200")
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
        description: "SchoolYear not found"
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
                'school_year_code' => [
                    'required',
                    'string',
                    Rule::unique('school_year', 'school_year_code')->ignore($id),
                ],
                'name' => 'required|string',
                'start_date' => 'required|string|date',
                'end_date' => 'required|string|date|after_or_equal:start_date',
                'is_active' => 'required|boolean',
            ]);

            // Return validation errors if the initial validation fails
            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            // Custom validation - overlapping date ranges
            $start = $request->input('start_date');
            $end = $request->input('end_date');
            if ($start && $end) {
                $overlap = DB::table('school_year')
                    ->where('id', '!=', $id)
                    ->where(function ($q) use ($start, $end) {
                        $q->where('start_date', '<=', $end)
                          ->where('end_date', '>=', $start);
                    })
                    ->exists();
                if ($overlap) {
                    return $this->validationError(['start_date' => ['Date range overlaps with an existing SchoolYear.']]);
                }
            }

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('SchoolYear not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/SchoolYear/{id}",
        summary: "Delete a SchoolYear",
        tags: ["SchoolYear"],
        description: "Delete a SchoolYear by its ID",
        operationId: "deleteSchoolYear",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "SchoolYear deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteSchoolYearResponse200")
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
        description: "SchoolYear not found"
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
            return $this->notFound('SchoolYear not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
