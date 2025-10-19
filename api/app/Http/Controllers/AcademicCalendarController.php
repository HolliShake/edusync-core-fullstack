<?php

namespace App\Http\Controllers;

use App\Enum\CalendarEventEnum;
use App\Service\AcademicCalendarService;
use App\Service\SchoolYearService;
use DateTime;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/AcademicCalendar"
)]
class AcademicCalendarController extends Controller
{
    public function __construct(protected AcademicCalendarService $service, protected SchoolYearService $schoolYearService) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/AcademicCalendar",
        summary: "Get paginated list of AcademicCalendar",
        tags: ["AcademicCalendar"],
        description: "Retrieve a paginated list of AcademicCalendar with optional search",
        operationId:"getAcademicCalendarPaginated",
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
        name: "filter[school_year_id]",
        in: "query",
        description: "Filter by school year ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "include",
        in: "query",
        description: "Comma-separated list of related resources to include in the response",
        required: false,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedAcademicCalendarResponse200")
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
        path: "/api/AcademicCalendar/{id}",
        summary: "Get a specific AcademicCalendar",
        tags: ["AcademicCalendar"],
        description: "Retrieve a AcademicCalendar by its ID",
        operationId: "getAcademicCalendarById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetAcademicCalendarResponse200")
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
        description: "AcademicCalendar not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('AcademicCalendar not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/AcademicCalendar",
        summary: "Create a new AcademicCalendar",
        tags: ["AcademicCalendar"],
        description:" Create a new AcademicCalendar with the provided details",
        operationId: "createAcademicCalendar",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AcademicCalendar")
    )]
    #[OA\Response(
        response: 200,
        description: "AcademicCalendar created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateAcademicCalendarResponse200")
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
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:4096',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'school_year_id' => 'required|integer|exists:school_year,id',
                'event' => 'required|string|in:' . implode(',', array_column(CalendarEventEnum::cases(), 'value')),
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            $school_year = $this->schoolYearService->getById($validated['school_year_id']);

            if (!$school_year) {
                return $this->notFound('School year not found');
            }

            // Validate that start_date and end_date are within school year boundaries
            $start_date = new DateTime($validated['start_date']);
            $end_date = new DateTime($validated['end_date']);
            $school_year_start = new DateTime($school_year->start_date);
            $school_year_end = new DateTime($school_year->end_date);

            if ($start_date < $school_year_start || $start_date > $school_year_end) {
                return $this->validationError([
                    'start_date' => ['Start date must be within the school year period']
                ]);
            }

            if ($end_date < $school_year_start || $end_date > $school_year_end) {
                return $this->validationError([
                    'end_date' => ['End date must be within the school year period']
                ]);
            }

            return $this->ok($this->service->create($validated));
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    #[OA\Put(
        path: "/api/AcademicCalendar/{id}",
        summary: "Update a AcademicCalendar",
        tags: ["AcademicCalendar"],
        description: "Update an existing AcademicCalendar with the provided details",
        operationId: "updateAcademicCalendar",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AcademicCalendar")
    )]
    #[OA\Response(
        response: 200,
        description: "AcademicCalendar updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateAcademicCalendarResponse200")
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
        description: "AcademicCalendar not found"
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
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:4096',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'school_year_id' => 'required|integer|exists:school_year,id',
                'event' => 'required|string|in:' . implode(',', array_column(CalendarEventEnum::cases(), 'value')),
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            $school_year = $this->schoolYearService->getById($validated['school_year_id']);

            if (!$school_year) {
                return $this->notFound('School year not found');
            }

            // Validate that start_date and end_date are within school year boundaries
            $start_date = new DateTime($validated['start_date']);
            $end_date = new DateTime($validated['end_date']);
            $school_year_start = new DateTime($school_year->start_date);
            $school_year_end = new DateTime($school_year->end_date);

            if ($start_date < $school_year_start || $start_date > $school_year_end) {
                return $this->validationError([
                    'start_date' => ['Start date must be within the school year period']
                ]);
            }

            if ($end_date < $school_year_start || $end_date > $school_year_end) {
                return $this->validationError([
                    'end_date' => ['End date must be within the school year period']
                ]);
            }

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('AcademicCalendar not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/AcademicCalendar/{id}",
        summary: "Delete a AcademicCalendar",
        tags: ["AcademicCalendar"],
        description: "Delete a AcademicCalendar by its ID",
        operationId: "deleteAcademicCalendar",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "AcademicCalendar deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteAcademicCalendarResponse200")
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
        description: "AcademicCalendar not found"
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
            return $this->notFound('AcademicCalendar not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
