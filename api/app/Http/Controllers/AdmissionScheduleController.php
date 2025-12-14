<?php

namespace App\Http\Controllers;

use App\Service\AdmissionScheduleService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/AdmissionSchedule"
)]
class AdmissionScheduleController extends Controller
{
    public function __construct(protected AdmissionScheduleService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/AdmissionSchedule",
        summary: "Get paginated list of AdmissionSchedule",
        tags: ["AdmissionSchedule"],
        description: "Retrieve a paginated list of AdmissionSchedule with optional search",
        operationId:"getAdmissionSchedulePaginated",
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
        name: "filter[college_id]",
        in: "query",
        description: "Filter by college ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "filter[academic_program_id]",
        in: "query",
        description: "Filter by academic program ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "filter[university_admission_id]",
        in: "query",
        description: "Filter by university admission ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "sort",
        in: "query",
        description: "Sort by start date and direction. Example: ?sort[start_date]=-start_date (descending), ?sort[start_date]=start_date (ascending)",
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
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedAdmissionScheduleResponse200")
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

    #[OA\Get(
        path: "/api/AdmissionSchedule/active-school-year",
        summary: "Get active school year",
        tags: ["AdmissionSchedule"],
        description: "Retrieve the active school year",
        operationId: "getActiveSchoolYears",
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/GetSchoolYearsResponse200")
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
    public function getActiveSchoolYears(Request $request)
    {
        return $this->ok($this->service->getActiveSchoolYear());
    }

    #[OA\Get(
        path: "/api/AdmissionSchedule/active-campuses",
        summary: "Get active campuses",
        tags: ["AdmissionSchedule"],
        description: "Retrieve the active campuses",
        operationId: "getActiveCampuses",
    )]
    #[OA\Parameter(
        name: "filter[school_year_id]",
        in: "query",
        description: "Filter by school year ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/GetActiveCampusesResponse200")
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
    public function getActiveCampuses(Request $request)
    {
        $schoolYearId = $request->input('filter.school_year_id', null);
        if (!$schoolYearId) {
            return $this->validationError('School year ID is required');
        }
        return $this->ok($this->service->getActiveCampuses($schoolYearId));
    }

    #[OA\Get(
        path: "/api/AdmissionSchedule/active-college-by-campus-id",
        summary: "Get active college by campus ID",
        tags: ["AdmissionSchedule"],
        description: "Retrieve the active college by campus ID",
        operationId: "getActiveColleges",
    )]
    #[OA\Parameter(
        name: "filter[campus_id]",
        in: "query",
        description: "Filter by campus ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/GetCollegesResponse200")
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
    public function getActiveColleges(Request $request)
    {
        $campusId = $request->input('filter.campus_id', null);
        if (!$campusId) {
            return $this->validationError('Campus ID is required');
        }
        return $this->ok($this->service->getActiveCollegeByCampusId($campusId));
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: "/api/AdmissionSchedule/{id}",
        summary: "Get a specific AdmissionSchedule",
        tags: ["AdmissionSchedule"],
        description: "Retrieve a AdmissionSchedule by its ID",
        operationId: "getAdmissionScheduleById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetAdmissionScheduleResponse200")
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
        description: "AdmissionSchedule not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('AdmissionSchedule not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/AdmissionSchedule",
        summary: "Create a new AdmissionSchedule",
        tags: ["AdmissionSchedule"],
        description:" Create a new AdmissionSchedule with the provided details",
        operationId: "createAdmissionSchedule",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AdmissionSchedule")
    )]
    #[OA\Response(
        response: 200,
        description: "AdmissionSchedule created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateAdmissionScheduleResponse200")
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
                'university_admission_id' => 'required|exists:university_admission,id',
                'academic_program_id' => 'required|exists:academic_program,id',
                'intake_limit' => 'required|integer',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
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
        path: "/api/AdmissionSchedule/{id}",
        summary: "Update a AdmissionSchedule",
        tags: ["AdmissionSchedule"],
        description: "Update an existing AdmissionSchedule with the provided details",
        operationId: "updateAdmissionSchedule",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AdmissionSchedule")
    )]
    #[OA\Response(
        response: 200,
        description: "AdmissionSchedule updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateAdmissionScheduleResponse200")
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
        description: "AdmissionSchedule not found"
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
                'university_admission_id' => 'required|exists:university_admission,id',
                'academic_program_id' => 'required|exists:academic_program,id',
                'intake_limit' => 'required|integer',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('AdmissionSchedule not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/AdmissionSchedule/{id}",
        summary: "Delete a AdmissionSchedule",
        tags: ["AdmissionSchedule"],
        description: "Delete a AdmissionSchedule by its ID",
        operationId: "deleteAdmissionSchedule",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "AdmissionSchedule deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteAdmissionScheduleResponse200")
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
        description: "AdmissionSchedule not found"
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
            return $this->notFound('AdmissionSchedule not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
