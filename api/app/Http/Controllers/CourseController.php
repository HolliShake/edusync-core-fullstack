<?php

namespace App\Http\Controllers;

use App\Service\CourseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/Course"
)]
class CourseController extends Controller
{
    public function __construct(protected CourseService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/Course",
        summary: "Get paginated list of Course",
        tags: ["Course"],
        description: "Retrieve a paginated list of Course with optional search",
        operationId:"getCoursePaginated",
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
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedCourseResponse200")
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
        path: "/api/Course/{id}",
        summary: "Get a specific Course",
        tags: ["Course"],
        description: "Retrieve a Course by its ID",
        operationId: "getCourseById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetCourseResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "Course not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('Course not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/Course",
        summary: "Create a new Course",
        tags: ["Course"],
        description:" Create a new Course with the provided details",
        operationId: "createCourse",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/Course")
    )]
    #[OA\Response(
        response: 200,
        description: "Course created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateCourseResponse200")
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
                'course_code' => 'required|string|unique:course,course_code',
                'course_title' => 'required|string',
                'course_description' => 'required|string',
                'with_laboratory' => 'boolean',
                'is_specialize' => 'boolean',
                'lecture_units' => 'required|numeric',
                'laboratory_units' => 'required|numeric',
                'credit_units' => 'required|numeric',
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
        path: "/api/Course/{id}",
        summary: "Update a Course",
        tags: ["Course"],
        description: "Update an existing Course with the provided details",
        operationId: "updateCourse",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/Course")
    )]
    #[OA\Response(
        response: 200,
        description: "Course updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateCourseResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "Course not found"
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
                'course_code' => [
                    'required',
                    'string',
                    Rule::unique('course', 'course_code')->ignore($id),
                ],
                'course_title' => 'required|string',
                'course_description' => 'required|string',
                'with_laboratory' => 'boolean',
                'is_specialize' => 'boolean',
                'lecture_units' => 'required|numeric',
                'laboratory_units' => 'required|numeric',
                'credit_units' => 'required|numeric',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('Course not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/Course/{id}",
        summary: "Delete a Course",
        tags: ["Course"],
        description: "Delete a Course by its ID",
        operationId: "deleteCourse",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "Course deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteCourseResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "Course not found"
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
            return $this->notFound('Course not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
