<?php

namespace App\Http\Controllers;

use App\Enum\WeeklyScheduleEnum;
use App\Http\Controllers\Controller;
use App\Service\ScheduleAssignmentService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/ScheduleAssignment"
)]
class ScheduleAssignmentController extends Controller
{
    public function __construct(protected ScheduleAssignmentService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/ScheduleAssignment",
        summary: "Get paginated list of ScheduleAssignment",
        tags: ["ScheduleAssignment"],
        description: "Retrieve a paginated list of ScheduleAssignment with optional search",
        operationId:"getScheduleAssignmentPaginated",
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
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedScheduleAssignmentResponse200")
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
     * Get ScheduleAssignment by section code.
     */
    #[OA\Get(
        path: "/api/ScheduleAssignment/section/{section_code}",
        summary: "Get ScheduleAssignment by section code",
        tags: ["ScheduleAssignment"],
        description: "Retrieve ScheduleAssignment by section code",
        operationId: "getScheduleAssignmentBySectionCode",
    )]
    #[OA\Parameter(
        name: "section_code",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/GetScheduleAssignmentsResponse200")
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
        description: "ScheduleAssignment not found"
    )]
    #[OA\Response(
        response: 500,
        description: "Internal server error",
        content: new OA\JsonContent(ref: "#/components/schemas/InternalServerErrorResponse")
    )]
    public function getBySectionCode(Request $request, $section_code)
    {
        return $this->ok($this->service->getBySectionCode($section_code));
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: "/api/ScheduleAssignment/{id}",
        summary: "Get a specific ScheduleAssignment",
        tags: ["ScheduleAssignment"],
        description: "Retrieve a ScheduleAssignment by its ID",
        operationId: "getScheduleAssignmentById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetScheduleAssignmentResponse200")
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
        description: "ScheduleAssignment not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('ScheduleAssignment not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/ScheduleAssignment",
        summary: "Create a new ScheduleAssignment",
        tags: ["ScheduleAssignment"],
        description:" Create a new ScheduleAssignment with the provided details",
        operationId: "createScheduleAssignment",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/ScheduleAssignment")
    )]
    #[OA\Response(
        response: 200,
        description: "ScheduleAssignment created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateScheduleAssignmentResponse200")
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
                'section_id' => 'required|integer|exists:section,id',
                'room_id' => 'required|integer|exists:room,id',
                'day_schedule' => 'required|string|in:' . implode(',', array_column(WeeklyScheduleEnum::cases(), 'value')),
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
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
        path: "/api/ScheduleAssignment/{id}",
        summary: "Update a ScheduleAssignment",
        tags: ["ScheduleAssignment"],
        description: "Update an existing ScheduleAssignment with the provided details",
        operationId: "updateScheduleAssignment",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/ScheduleAssignment")
    )]
    #[OA\Response(
        response: 200,
        description: "ScheduleAssignment updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateScheduleAssignmentResponse200")
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
        description: "ScheduleAssignment not found"
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
                'section_id' => 'sometimes|required|integer|exists:section,id',
                'room_id' => 'sometimes|required|integer|exists:room,id',
                'day_schedule' => 'sometimes|required|string|in:' . implode(',', array_column(WeeklyScheduleEnum::cases(), 'value')),
                'start_time' => 'sometimes|required|date_format:H:i',
                'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('ScheduleAssignment not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/ScheduleAssignment/{id}",
        summary: "Delete a ScheduleAssignment",
        tags: ["ScheduleAssignment"],
        description: "Delete a ScheduleAssignment by its ID",
        operationId: "deleteScheduleAssignment",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "ScheduleAssignment deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteScheduleAssignmentResponse200")
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
        description: "ScheduleAssignment not found"
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
            return $this->notFound('ScheduleAssignment not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
