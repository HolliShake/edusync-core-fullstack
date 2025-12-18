<?php

namespace App\Http\Controllers;

use App\Enum\AdmissionApplicationLogTypeEnum;
use App\Http\Controllers\Controller;
use App\Service\UniversityAdmissionApplicationService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

#[OA\PathItem(
    path: "/UniversityAdmissionApplication"
)]
class UniversityAdmissionApplicationController extends Controller
{
    public function __construct(protected UniversityAdmissionApplicationService $service) {
    }

    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: "/api/UniversityAdmissionApplication",
        summary: "Get paginated list of UniversityAdmissionApplication",
        tags: ["UniversityAdmissionApplication"],
        description: "Retrieve a paginated list of UniversityAdmissionApplication with optional search",
        operationId:"getUniversityAdmissionApplicationPaginated",
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
        name: "filter[university_admission_id]",
        in: "query",
        description: "University admission ID",
        required: false,
        schema: new OA\Schema(type: "integer", default: 0)
    )]
    #[OA\Parameter(
        name: "filter[latest_status]",
        in: "query",
        description: "Latest status",
        required: false,
        schema: new OA\Schema(type: "string", enum: AdmissionApplicationLogTypeEnum::class)
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(ref: "#/components/schemas/PaginatedUniversityAdmissionApplicationResponse200")
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
        path: "/api/UniversityAdmissionApplication/{id}",
        summary: "Get a specific UniversityAdmissionApplication",
        tags: ["UniversityAdmissionApplication"],
        description: "Retrieve a UniversityAdmissionApplication by its ID",
        operationId: "getUniversityAdmissionApplicationById",
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
        content: new OA\JsonContent(ref: "#/components/schemas/GetUniversityAdmissionApplicationResponse200")
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
        description: "UniversityAdmissionApplication not found"
    )]
    public function show($id)
    {
        try {
            return $this->ok($this->service->getById($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound('UniversityAdmissionApplication not found');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: "/api/UniversityAdmissionApplication",
        summary: "Create a new UniversityAdmissionApplication",
        tags: ["UniversityAdmissionApplication"],
        description:" Create a new UniversityAdmissionApplication with the provided details",
        operationId: "createUniversityAdmissionApplication",
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UniversityAdmissionApplication")
    )]
    #[OA\Response(
        response: 200,
        description: "UniversityAdmissionApplication created successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/CreateUniversityAdmissionApplicationResponse200")
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
     * Submit the application form.
     */
    #[OA\Post(
        path: "/api/UniversityAdmissionApplication/submitApplicationForm",
        summary: "Submit the application form",
        tags: ["UniversityAdmissionApplication"],
        description: "Submit the application form with the provided details",
        operationId: "submitUniversityAdmissionApplicationForm",
    )]
    #[OA\RequestBody(
        request: "MultiFileUploadRequest",
        required: true,
        content: new OA\MediaType(
            mediaType: "multipart/form-data",
            schema: new OA\Schema(
                type: "object",
                required: [
                    "user_id",
                    "university_admission_id",
                    "university_admission_criteria_id",
                    "file"
                ],
                properties: [
                    new OA\Property(
                        property: "user_id[]",
                        type: "array",
                        items: new OA\Items(type: "integer")
                    ),
                    new OA\Property(
                        property: "university_admission_id[]",
                        type: "array",
                        items: new OA\Items(type: "integer")
                    ),
                    new OA\Property(
                        property: "university_admission_criteria_id[]",
                        type: "array",
                        items: new OA\Items(type: "integer")
                    ),
                    new OA\Property(
                        property: "file[]",
                        type: "array",
                        items: new OA\Items(type: "string", format: "binary")
                    ),
                ]
            )
        )
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
    public function submitApplicationForm(Request $request) {
        try {
            // Validate the 'data' array structure. 
            // The schema is now an object with a 'data' property containing the array.
            $validator = Validator::make(
                array_merge(
                    $request->all(),
                    ['file' => $request->file('file')]
                ),
                [
                    'user_id' => 'required|array',
                    'user_id.*' => 'required|integer|exists:user,id',
            
                    'university_admission_id' => 'required|array',
                    'university_admission_id.*' => 'required|integer|exists:university_admission,id',
            
                    'university_admission_criteria_id' => 'required|array',
                    'university_admission_criteria_id.*' => 'required|integer|exists:university_admission_criteria,id',
            
                    'file' => 'required|array',
                    'file.*' => 'required|file|max:10240',
                ]
            );

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $validated = $validator->validated();

            return $this->ok($this->service->submitApplicationForm($validated));
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    #[OA\Put(
        path: "/api/UniversityAdmissionApplication/{id}",
        summary: "Update a UniversityAdmissionApplication",
        tags: ["UniversityAdmissionApplication"],
        description: "Update an existing UniversityAdmissionApplication with the provided details",
        operationId: "updateUniversityAdmissionApplication",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer"),
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UniversityAdmissionApplication")
    )]
    #[OA\Response(
        response: 200,
        description: "UniversityAdmissionApplication updated successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateUniversityAdmissionApplicationResponse200")
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
        description: "UniversityAdmissionApplication not found"
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
            return $this->notFound('UniversityAdmissionApplication not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: "/api/UniversityAdmissionApplication/{id}",
        summary: "Delete a UniversityAdmissionApplication",
        tags: ["UniversityAdmissionApplication"],
        description: "Delete a UniversityAdmissionApplication by its ID",
        operationId: "deleteUniversityAdmissionApplication",
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 204,
        description: "UniversityAdmissionApplication deleted successfully",
        content: new OA\JsonContent(ref: "#/components/schemas/DeleteUniversityAdmissionApplicationResponse200")
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
        description: "UniversityAdmissionApplication not found"
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
            return $this->notFound('UniversityAdmissionApplication not found');
        } catch (\Exception $e) {
            return $this->internalServerError($e->getMessage());
        }
    }
}

