<?php

namespace App\Http\Controllers;

use App\Enum\CourseRequisiteTypeEnum;
use App\Http\Controllers\Controller;
use App\Service\CourseRequisiteService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/CourseRequisite"
)]
class CourseRequisiteController extends Controller
{
    public function __construct(protected CourseRequisiteService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/CourseRequisite",
        summary: "Get paginated list of CourseRequisite",
        tags: ["CourseRequisite"],
        description: "Retrieve a paginated list of CourseRequisite with optional search",
        operationId:"getCourseRequisitePaginated",
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
        name: "filter[course_id]",
        in: "query",
        description: "Filter by course ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedCourseRequisiteResponse200")
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
        path: "/api/CourseRequisite/{id}",
        summary: "Get a specific CourseRequisite",
        tags: ["CourseRequisite"],
        description: "Retrieve a CourseRequisite by its ID",
        operationId: "getCourseRequisiteById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetCourseRequisiteResponse200")
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
        description: "CourseRequisite not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('CourseRequisite not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/CourseRequisite",
        summary: "Create a new CourseRequisite",
        tags: ["CourseRequisite"],
        description:" Create a new CourseRequisite with the provided details",
        operationId: "createCourseRequisite",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/CourseRequisite")
    )]
    #[OA\Response(
        response: 200,
        description: "CourseRequisite created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateCourseRequisiteResponse200")
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
                'course_id' => 'required|integer|exists:course,id',
                'requisite_course_id' => 'required|integer|exists:course,id',
                'requisite_type' => 'required|string|in:' . implode(',', array_column(CourseRequisiteTypeEnum::cases(), 'value')),
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
        path: "/api/CourseRequisite/{id}",
        summary: "Update a CourseRequisite",
        tags: ["CourseRequisite"],
        description: "Update an existing CourseRequisite with the provided details",
        operationId: "updateCourseRequisite",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/CourseRequisite")
    )]
    #[OA\Response(
        response: 200,
        description: "CourseRequisite updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateCourseRequisiteResponse200")
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
        description: "CourseRequisite not found"
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
                'course_id' => 'required|integer|exists:course,id',
                'requisite_course_id' => 'required|integer|exists:course,id',
                'requisite_type' => 'required|string|in:' . implode(',', array_column(CourseRequisiteTypeEnum::cases(), 'value')),
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('CourseRequisite not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/CourseRequisite/{id}",
        summary: "Delete a CourseRequisite",
        tags: ["CourseRequisite"],
        description: "Delete a CourseRequisite by its ID",
        operationId: "deleteCourseRequisite",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "CourseRequisite deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteCourseRequisiteResponse200")
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
        description: "CourseRequisite not found"
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
            return $this->notFound('CourseRequisite not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
