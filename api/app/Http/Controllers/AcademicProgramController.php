<?php

namespace App\Http\Controllers;

use App\Service\AcademicProgramService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/AcademicProgram"
)]
class AcademicProgramController extends Controller
{
    public function __construct(protected AcademicProgramService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/AcademicProgram",
        summary: "Get paginated list of AcademicProgram",
        tags: ["AcademicProgram"],
        description: "Retrieve a paginated list of AcademicProgram with optional search",
        operationId:"getAcademicProgramPaginated",
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
        name: "include",
        in: "query",
        description: "Include program type",
        required: false,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedAcademicProgramResponse200")
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
        path: "/api/AcademicProgram/{id}",
        summary: "Get a specific AcademicProgram",
        tags: ["AcademicProgram"],
        description: "Retrieve a AcademicProgram by its ID",
        operationId: "getAcademicProgramById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetAcademicProgramResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "AcademicProgram not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('AcademicProgram not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/AcademicProgram/create",
        summary: "Create a new AcademicProgram",
        tags: ["AcademicProgram"],
        description:" Create a new AcademicProgram with the provided details",
        operationId: "createAcademicProgram",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AcademicProgram")
    )]
    #[OA\Response(
        response: 200,
        description: "AcademicProgram created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateAcademicProgramResponse200")
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
                'program_name' => 'required|string|max:255',
                'short_name' => 'required|string|max:50',
                'year_first_implemented' => 'required|date',
                'college_id' => 'required|integer|exists:college,id',
                'program_type_id' => 'required|integer|exists:program_type,id',
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
        path: "/api/AcademicProgram/update/{id}",
        summary: "Update a AcademicProgram",
        tags: ["AcademicProgram"],
        description: "Update an existing AcademicProgram with the provided details",
        operationId: "updateAcademicProgram",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/AcademicProgram")
    )]
    #[OA\Response(
        response: 200,
        description: "AcademicProgram updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateAcademicProgramResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "AcademicProgram not found"
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
                'program_name' => 'required|string|max:255',
                'short_name' => 'required|string|max:50',
                'year_first_implemented' => 'required|date',
                'college_id' => 'required|integer|exists:college,id',
                'program_type_id' => 'required|integer|exists:program_type,id',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->update($id, $validated));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('AcademicProgram not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/AcademicProgram/delete/{id}",
        summary: "Delete a AcademicProgram",
        tags: ["AcademicProgram"],
        description: "Delete a AcademicProgram by its ID",
        operationId: "deleteAcademicProgram",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "AcademicProgram deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteAcademicProgramResponse200")
    )]
    #[OA\Response(
        response: 404,
        description: "AcademicProgram not found"
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
            return $this->notFound('AcademicProgram not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}
