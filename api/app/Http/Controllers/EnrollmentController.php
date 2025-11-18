<?php

namespace App\Http\Controllers;

use App\Enum\EnrollmentLogActionEnum;
use App\Models\Section;
use App\Service\EnrollmentService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/Enrollment"
)]
class EnrollmentController extends Controller
{
    public function __construct(protected EnrollmentService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/Enrollment",
        summary: "Get paginated list of Enrollment",
        tags: ["Enrollment"],
        description: "Retrieve a paginated list of Enrollment with optional search",
        operationId:"getEnrollmentPaginated",
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
        name: "filter[user_id]",
        in: "query",
        description: "User ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Parameter(
        name: "filter[academic_program_id_grouped_by_user_name]",
        in: "query",
        description: "Academic Program ID grouped by user name",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedEnrollmentResponse200")
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
        path: "/api/Enrollment/campus/scholastic-filter/{campus_id}",
        summary: "Get scholastic filter",
        tags: ["Enrollment"],
        description: "Retrieve a scholastic filter",
        operationId: "getScholasticFilterByCampusId",
    )]
    #[OA\Parameter(
        name: "campus_id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "filter[latest_status]",
        in: "query",
        description: "Latest status",
        required: false,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Parameter(
        name: "filter[school_year_id]",
        in: "query",
        description: "School year ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(
            type: "object",
            properties: [
                // success
                new OA\Property(property: "success", type: "boolean", example: true),
                // data
                new OA\Property(property: "data", type: "object", properties: [
                    new OA\Property(property: "year", type: "array", items: new OA\Items(ref: "#/components/schemas/KeyValuePair")),
                    new OA\Property(property: "term", type: "array", items: new OA\Items(ref: "#/components/schemas/KeyValuePair")),
                ]),
            ]
        )
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
        description: "Academic Program not found"
    )]
    #[OA\Response(
        response: 500,
        description: "Internal server error",
        content: new OA\JsonContent(ref: "#/components/schemas/InternalServerErrorResponse")
    )]
    public function getScholasticFilterByCampusId(Request $request, $campus_id)
    {
        $latestStatus = $request->input('filter.latest_status', null);
        $schoolYearId = $request->input('filter.school_year_id', null);
        if (!$schoolYearId) {
            return $this->validationError('School year ID is required');
        }
        return $this->ok($this->service->getScholasticFilterByCampusId($campus_id, $latestStatus, $schoolYearId));
    }

    #[OA\Get(
        path: "/api/Enrollment/academic-program/scholastic-filter/{academic_program_id}",
        summary: "Get scholastic filter",
        tags: ["Enrollment"],
        description: "Retrieve a scholastic filter",
        operationId: "getScholasticFilterByProgramId",
    )]
    #[OA\Parameter(
        name: "academic_program_id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "filter[latest_status]",
        in: "query",
        description: "Latest status",
        required: false,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Parameter(
        name: "filter[school_year_id]",
        in: "query",
        description: "School year ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(
            type: "object",
            properties: [
                // success
                new OA\Property(property: "success", type: "boolean", example: true),
                // data
                new OA\Property(property: "data", type: "object", properties: [
                    new OA\Property(property: "year", type: "array", items: new OA\Items(ref: "#/components/schemas/KeyValuePair")),
                    new OA\Property(property: "term", type: "array", items: new OA\Items(ref: "#/components/schemas/KeyValuePair")),
                ]),
            ]
        )
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
        description: "Academic Program not found"
    )]
    #[OA\Response(
        response: 500,
        description: "Internal server error",
        content: new OA\JsonContent(ref: "#/components/schemas/InternalServerErrorResponse")
    )]
    public function getScholasticFilterByProgramId(Request $request, $academic_program_id)
    {
        $latestStatus = $request->input('filter.latest_status', null);
        $schoolYearId = $request->input('filter.school_year_id', null);
        if (!$schoolYearId) {
            return $this->validationError('School year ID is required');
        }
        return $this->ok($this->service->getScholasticFilterByProgramId($academic_program_id, $latestStatus, $schoolYearId));
    }

    #[OA\Get(
        path: "/api/Enrollment/campus/grouped-by-user-name/{campus_id}",
        summary: "Get paginated list of Enrollment by Campus ID",
        tags: ["Enrollment"],
        description: "Retrieve a paginated list of Enrollment by Campus ID",
        operationId: "getEnrollmentsByCampusIdGroupedByUser",
    )]
    #[OA\Parameter(
        name: "campus_id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "page",
        in: "query",
        description: "Page number",
        required: false,
        schema: new OA\Schema(type: "integer", default: 1)
    )]
    #[OA\Parameter(
        name: "rows",
        in: "query",
        description: "Number of items per page",
        required: false,
        schema: new OA\Schema(type: "integer", default: 10)
    )]
    #[OA\Parameter(
        name: "filter[latest_status]",
        in: "query",
        description: "Latest status",
        required: false,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Parameter(
        name: "filter[school_year_id]",
        in: "query",
        description: "School year ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Parameter(
        name: "filter[year_id]",
        in: "query",
        description: "Year ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Parameter(
        name: "filter[term_id]",
        in: "query",
        description: "Term ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(
            type: "object",
            properties: [
                new OA\Property(property: "status", type: "string", example: "success"),
                new OA\Property(property: "data", type: "object", properties: [
                    new OA\Property(property: "current_page", type: "integer", example: 1),
                    new OA\Property(
                        property: "data",
                        type: "object",
                        additionalProperties: new OA\AdditionalProperties(
                            type: "array",
                            items: new OA\Items(ref: "#/components/schemas/Enrollment")
                        ),
                        example: [
                            "Maria Clara Reyes" => [
                                ["id" => 158, "user_id" => 4, "section_id" => 961],
                                ["id" => 167, "user_id" => 4, "section_id" => 966]
                            ],
                            "Pedro Santiago" => [
                                ["id" => 168, "user_id" => 5, "section_id" => 966]
                            ]
                        ]
                    ),
                    new OA\Property(property: "first_page_url", type: "string", example: "/?page=1"),
                    new OA\Property(property: "from", type: "integer", example: 1),
                    new OA\Property(property: "last_page", type: "integer", example: 1),
                    new OA\Property(property: "last_page_url", type: "string", example: "/?page=1"),
                    new OA\Property(
                        property: "links",
                        type: "array",
                        items: new OA\Items(
                            type: "object",
                            properties: [
                                new OA\Property(property: "url", type: "string", nullable: true),
                                new OA\Property(property: "label", type: "string"),
                                new OA\Property(property: "page", type: "integer", nullable: true),
                                new OA\Property(property: "active", type: "boolean")
                            ]
                        )
                    ),
                    new OA\Property(property: "next_page_url", type: "string", nullable: true),
                    new OA\Property(property: "path", type: "string", example: "/"),
                    new OA\Property(property: "per_page", type: "integer", example: 10),
                    new OA\Property(property: "prev_page_url", type: "string", nullable: true),
                    new OA\Property(property: "to", type: "integer", example: 3),
                    new OA\Property(property: "total", type: "integer", example: 1)
                ])
            ]
        )
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
        description: "Campus not found"
    )]
    #[OA\Response(
        response: 500,
        description: "Internal server error",
        content: new OA\JsonContent(ref: "#/components/schemas/InternalServerErrorResponse")
    )]
    public function getEnrollmentsByCampusIdGroupedByUser(Request $request, $campus_id)
    {
        $latestStatus = $request->input('filter.latest_status', null);
        $schoolYearId = $request->input('filter.school_year_id', null);
        $yearId = $request->input('filter.year_id', null);
        $termId = $request->input('filter.term_id', null);
        $page = $request->query("page", 1);
        $rows = $request->query("rows", 10);
        if (!$schoolYearId || !$yearId || !$termId) {
            return $this->validationError('School year ID, year ID and term ID are required');
        }
        return $this->ok($this->service->getEnrollmentsByCampusId(
            $campus_id,
            $latestStatus,
            $schoolYearId,
            $yearId,
            $termId,
            $page,
            $rows
        ));
    }

    #[OA\Get(
        path: "/api/Enrollment/academic-program/grouped-by-user-name/{academic_program_id}",
        summary: "Get paginated list of Enrollment by Academic Program ID",
        tags: ["Enrollment"],
        description: "Retrieve a paginated list of Enrollment by Academic Program ID",
        operationId: "getEnrollmentsByAcademicProgramIdGroupedByUser",
    )]
    #[OA\Parameter(
        name: "academic_program_id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "page",
        in: "query",
        description: "Page number",
        required: false,
        schema: new OA\Schema(type: "integer", default: 1)
    )]
    #[OA\Parameter(
        name: "rows",
        in: "query",
        description: "Number of items per page",
        required: false,
        schema: new OA\Schema(type: "integer", default: 10)
    )]
    #[OA\Parameter(
        name: "filter[latest_status]",
        in: "query",
        description: "Latest status",
        required: false,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Parameter(
        name: "filter[school_year_id]",
        in: "query",
        description: "School year ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Parameter(
        name: "filter[year_id]",
        in: "query",
        description: "Year ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Parameter(
        name: "filter[term_id]",
        in: "query",
        description: "Term ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(
            type: "object",
            properties: [
                new OA\Property(property: "status", type: "string", example: "success"),
                new OA\Property(property: "data", type: "object", properties: [
                    new OA\Property(property: "current_page", type: "integer", example: 1),
                    new OA\Property(
                        property: "data",
                        type: "object",
                        additionalProperties: new OA\AdditionalProperties(
                            type: "array",
                            items: new OA\Items(ref: "#/components/schemas/Enrollment")
                        ),
                        example: [
                            "Maria Clara Reyes" => [
                                ["id" => 158, "user_id" => 4, "section_id" => 961],
                                ["id" => 167, "user_id" => 4, "section_id" => 966]
                            ],
                            "Pedro Santiago" => [
                                ["id" => 168, "user_id" => 5, "section_id" => 966]
                            ]
                        ]
                    ),
                    new OA\Property(property: "first_page_url", type: "string", example: "/?page=1"),
                    new OA\Property(property: "from", type: "integer", example: 1),
                    new OA\Property(property: "last_page", type: "integer", example: 1),
                    new OA\Property(property: "last_page_url", type: "string", example: "/?page=1"),
                    new OA\Property(
                        property: "links",
                        type: "array",
                        items: new OA\Items(
                            type: "object",
                            properties: [
                                new OA\Property(property: "url", type: "string", nullable: true),
                                new OA\Property(property: "label", type: "string"),
                                new OA\Property(property: "page", type: "integer", nullable: true),
                                new OA\Property(property: "active", type: "boolean")
                            ]
                        )
                    ),
                    new OA\Property(property: "next_page_url", type: "string", nullable: true),
                    new OA\Property(property: "path", type: "string", example: "/"),
                    new OA\Property(property: "per_page", type: "integer", example: 10),
                    new OA\Property(property: "prev_page_url", type: "string", nullable: true),
                    new OA\Property(property: "to", type: "integer", example: 3),
                    new OA\Property(property: "total", type: "integer", example: 1)
                ])
            ]
        )
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
        description: "Academic Program not found"
    )]
    #[OA\Response(
        response: 500,
        description: "Internal server error",
        content: new OA\JsonContent(ref: "#/components/schemas/InternalServerErrorResponse")
    )]
    public function getEnrollmentsByAcademicProgramIdGroupedByUser(Request $request, $academic_program_id)
    {
        $latestStatus = $request->input('filter.latest_status', null);
        $schoolYearId = $request->input('filter.school_year_id', null);
        $yearId = $request->input('filter.year_id', null);
        $termId = $request->input('filter.term_id', null);
        $page = $request->query("page", 1);
        $rows = $request->query("rows", 10);
        if (!$schoolYearId || !$yearId || !$termId) {
            return $this->validationError('School year ID, year ID and term ID are required');
        }
        return $this->ok($this->service->getEnrollmentsByProgramId(
            $academic_program_id,
            $latestStatus,
            $schoolYearId,
            $yearId,
            $termId,
            $page,
            $rows
        ));
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: "/api/Enrollment/{id}",
        summary: "Get a specific Enrollment",
        tags: ["Enrollment"],
        description: "Retrieve a Enrollment by its ID",
        operationId: "getEnrollmentById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetEnrollmentResponse200")
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
        description: "Enrollment not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('Enrollment not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/Enrollment",
        summary: "Create a new Enrollment",
        tags: ["Enrollment"],
        description:" Create a new Enrollment with the provided details",
        operationId: "createEnrollment",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/Enrollment")
    )]
    #[OA\Response(
        response: 200,
        description: "Enrollment created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateEnrollmentResponse200")
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
                'user_id' => 'required|integer|exists:user,id',
                'section_id' => 'required|integer|exists:section,id',
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

    #[OA\Post(
        path: "/api/Enrollment/enroll",
        summary: "Enroll a user in a section",
        tags: ["Enrollment"],
        description: "Enroll a user in a section with the provided details",
        operationId: "enrollUser",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(ref: "#/components/schemas/Enrollment")
        )
    )]
    #[OA\Response(
        response: 200,
        description: "Enrollment created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateEnrollmentResponse200")
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
    public function enroll(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                '*.section_id' => [
                    'required',
                    'integer',
                    'exists:section,id',
                    function ($attribute, $value, $fail) {
                        $section = Section::find($value);
                        if ($section && $section->available_slots <= 0) {
                            $fail("The section '{$section->section_name}' is already full.");
                        }
                    },
                ],
                '*.user_id' => 'required|integer|exists:user,id',
            ]);

            $validated = $validator->validated();

            $result = $this->service->createMultiple($validated);
            return $this->ok($result);

        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    #[OA\Put(
        path: "/api/Enrollment/{id}",
        summary: "Update a Enrollment",
        tags: ["Enrollment"],
        description: "Update an existing Enrollment with the provided details",
        operationId: "updateEnrollment",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/Enrollment")
    )]
    #[OA\Response(
        response: 200,
        description: "Enrollment updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateEnrollmentResponse200")
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
        description: "Enrollment not found"
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
                'user_id' => 'required|integer|exists:user,id',
                'section_id' => 'required|integer|exists:section,id',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('Enrollment not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/Enrollment/{id}",
        summary: "Delete a Enrollment",
        tags: ["Enrollment"],
        description: "Delete a Enrollment by its ID",
        operationId: "deleteEnrollment",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "Enrollment deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteEnrollmentResponse200")
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
        description: "Enrollment not found"
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
            return $this->notFound('Enrollment not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
