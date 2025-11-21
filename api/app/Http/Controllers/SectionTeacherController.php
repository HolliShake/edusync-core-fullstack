<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Service\SectionTeacherService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/SectionTeacher"
)]
class SectionTeacherController extends Controller
{
    public function __construct(protected SectionTeacherService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/SectionTeacher",
        summary: "Get paginated list of SectionTeacher",
        tags: ["SectionTeacher"],
        description: "Retrieve a paginated list of SectionTeacher with optional search",
        operationId:"getSectionTeacherPaginated",
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
        name: "filter[academic_program_id]",
        in: "query",
        description: "Filter by academic program ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "filter[school_year_id]",
        in: "query",
        description: "Filter by school year ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "filter[user_id]",
        in: "query",
        description: "Filter by user ID",
        required: false,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedSectionTeacherResponse200")
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
        path: "/api/SectionTeacher/campus/{campusId}",
        summary: "Get SectionTeachers by Campus ID",
        tags: ["SectionTeacher"],
        description: "Retrieve SectionTeachers by Campus ID",
        operationId: "getSectionTeachersByCampusId",
    )]
    #[OA\Parameter(
        name: "campusId",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
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
                            items: new OA\Items(ref: "#/components/schemas/SectionTeacher")
                        ),
                        example: [
                            "Maria Clara Reyes" => [
                                ["id" => 158, "user_id" => 4, "section_id" => 961],
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
        description: "SectionTeacher not found"
    )]
    public function getSectionTeachersByCampusIdGroupedByTeacherName(Request $request, $campusId)
    {
        $schoolYearId = $request->input("filter.school_year_id", null);
        $page = $request->query("page", 1);
        $rows = $request->query("rows", 10);
        if (!$schoolYearId) {
            return $this->validationError('School year ID is required');
        }
        return $this->ok($this->service->getSectionTeachersByCampusId($campusId, $schoolYearId, $page, $rows));
    }

    #[OA\Get(
        path: "/api/SectionTeacher/program/{academicProgramId}",
        summary: "Get SectionTeachers by Program ID grouped by teacher name",
        tags: ["SectionTeacher"],
        description: "Retrieve SectionTeachers by Program ID grouped by teacher name",
        operationId: "getSectionTeachersByProgramIdGroupedByTeacherName",
    )]
    #[OA\Parameter(
        name: "academicProgramId",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
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
                            items: new OA\Items(ref: "#/components/schemas/SectionTeacher")
                        ),
                        example: [
                            "Maria Clara Reyes" => [
                                ["id" => 158, "user_id" => 4, "section_id" => 961],
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
        description: "SectionTeacher not found"
    )]
    #[OA\Response(
        response: 500,
        description: "Internal server error",
        content: new OA\JsonContent(ref: "#/components/schemas/InternalServerErrorResponse")
    )]
    public function getSectionTeachersByProgramIdGroupedByTeacherName(Request $request, $academicProgramId)
    {
        $schoolYearId = $request->input("filter.school_year_id", null);
        $page = $request->query("page", 1);
        $rows = $request->query("rows", 10);
        if (!$academicProgramId || !$schoolYearId) {
            return $this->validationError('Academic program ID and school year ID are required');
        }
        return $this->ok($this->service->getSectionTeachersByProgramId($academicProgramId, $schoolYearId, $page, $rows));
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: "/api/SectionTeacher/{id}",
        summary: "Get a specific SectionTeacher",
        tags: ["SectionTeacher"],
        description: "Retrieve a SectionTeacher by its ID",
        operationId: "getSectionTeacherById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetSectionTeacherResponse200")
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
        description: "SectionTeacher not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('SectionTeacher not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/SectionTeacher",
        summary: "Create a new SectionTeacher",
        tags: ["SectionTeacher"],
        description:" Create a new SectionTeacher with the provided details",
        operationId: "createSectionTeacher",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/SectionTeacher")
    )]
    #[OA\Response(
        response: 200,
        description: "SectionTeacher created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateSectionTeacherResponse200")
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
        path: "/api/SectionTeacher/{id}",
        summary: "Update a SectionTeacher",
        tags: ["SectionTeacher"],
        description: "Update an existing SectionTeacher with the provided details",
        operationId: "updateSectionTeacher",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/SectionTeacher")
    )]
    #[OA\Response(
        response: 200,
        description: "SectionTeacher updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateSectionTeacherResponse200")
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
        description: "SectionTeacher not found"
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
            return $this->notFound('SectionTeacher not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/SectionTeacher/{id}",
        summary: "Delete a SectionTeacher",
        tags: ["SectionTeacher"],
        description: "Delete a SectionTeacher by its ID",
        operationId: "deleteSectionTeacher",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "SectionTeacher deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteSectionTeacherResponse200")
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
        description: "SectionTeacher not found"
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
            return $this->notFound('SectionTeacher not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
