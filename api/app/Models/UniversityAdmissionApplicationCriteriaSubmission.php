<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use OpenApi\Attributes as OA;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[OA\Schema(
    schema: "UniversityAdmissionApplicationCriteriaSubmission",
    title: "UniversityAdmissionApplicationCriteriaSubmission",
    type: "object",
    required: [
        "university_admission_application_id",
        "university_admission_criteria_id"
    ],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "university_admission_application_id", type: "integer", example: 1),
        new OA\Property(property: "university_admission_criteria_id", type: "integer", example: 1),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
        // Relations
        new OA\Property(property: "university_admission_application", ref: "#/components/schemas/UniversityAdmissionApplication"),
        new OA\Property(property: "university_admission_criteria", ref: "#/components/schemas/UniversityAdmissionCriteria"),
        new OA\Property(
            property: "files",
            type: "array",
            items: new OA\Items(
                type: "object",
                properties: [
                    new OA\Property(property: "id", type: "integer"),
                    new OA\Property(property: "model_type", type: "string"),
                    new OA\Property(property: "model_id", type: "integer"),
                    new OA\Property(property: "uuid", type: "string", nullable: true),
                    new OA\Property(property: "collection_name", type: "string"),
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "file_name", type: "string"),
                    new OA\Property(property: "mime_type", type: "string", nullable: true),
                    new OA\Property(property: "disk", type: "string"),
                    new OA\Property(property: "conversions_disk", type: "string", nullable: true),
                    new OA\Property(property: "size", type: "integer"),
                    new OA\Property(property: "manipulations", type: "object"),
                    new OA\Property(property: "custom_properties", type: "object"),
                    new OA\Property(property: "generated_conversions", type: "object"),
                    new OA\Property(property: "responsive_images", type: "object"),
                    new OA\Property(property: "order_column", type: "integer", nullable: true),
                    new OA\Property(property: "created_at", type: "string", format: "date-time", nullable: true),
                    new OA\Property(property: "updated_at", type: "string", format: "date-time", nullable: true),
                ]
            )
        ),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionApplicationCriteriaSubmission",
    title:"PaginatedUniversityAdmissionApplicationCriteriaSubmission",
    type: "object",
    properties: [
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionApplicationCriteriaSubmission")),
        new OA\Property(property: "current_page", type: "integer"),
        new OA\Property(property: "last_page", type: "integer"),
        new OA\Property(property: "per_page", type: "integer"),
        new OA\Property(property: "total", type: "integer"),
        new OA\Property(property: "from", type: "integer", nullable: true),
        new OA\Property(property: "to", type: "integer", nullable: true),
    ]
)]

#[OA\Schema(
    schema: "PaginatedUniversityAdmissionApplicationCriteriaSubmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/PaginatedUniversityAdmissionApplicationCriteriaSubmission")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionApplicationCriteriaSubmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplicationCriteriaSubmission")
    ]
)]

#[OA\Schema(
    schema: "GetUniversityAdmissionApplicationCriteriaSubmissionsResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/UniversityAdmissionApplicationCriteriaSubmission"))
    ]
)]

#[OA\Schema(
    schema: "CreateUniversityAdmissionApplicationCriteriaSubmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplicationCriteriaSubmission")
    ]
)]

#[OA\Schema(
    schema: "UpdateUniversityAdmissionApplicationCriteriaSubmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true),
        new OA\Property(property: "data", ref: "#/components/schemas/UniversityAdmissionApplicationCriteriaSubmission")
    ]
)]

#[OA\Schema(
    schema: "DeleteUniversityAdmissionApplicationCriteriaSubmissionResponse200",
    type: "object",
    properties: [
        new OA\Property(property: "success", type: "boolean", example: true)
    ]
)]

class UniversityAdmissionApplicationCriteriaSubmission extends Model implements HasMedia
{
    use InteractsWithMedia;

    public static $COLLECTION_NAME = 'university_admission_application_criteria_submission_files';

    protected $table = 'university_admission_application_criteria_submission';

    protected $fillable = [
        'university_admission_application_id',
        'university_admission_criteria_id',
    ];

    protected $casts = [
        'university_admission_application_id' => 'integer',
        'university_admission_criteria_id' => 'integer',
    ];

    protected $appends = [
        'university_admission_application',
        'university_admission_criteria',
        'files',
    ];

    /**
     * Get the university admission application associated with this criteria submission.
     * 
     * @return UniversityAdmissionApplication
     */
    public function getUniversityAdmissionApplicationAttribute(): UniversityAdmissionApplication
    {
        return $this->universityAdmissionApplication()->first();
    }

    /**
     * Get the university admission criteria associated with this submission.
     * 
     * @return UniversityAdmissionCriteria
     */
    public function getUniversityAdmissionCriteriaAttribute(): UniversityAdmissionCriteria
    {
        return $this->universityAdmissionCriteria()->first();
    }

    /**
     * Get all files associated with this criteria submission.
     * 
     * @return array
     */
    public function getFilesAttribute(): array
    {
        return $this->files()->get()->makeHidden(['university_admission_application_criteria_submission'])->toArray();
    }

    /**
     * Define the relationship to the university admission application.
     * 
     * @return BelongsTo
     */
    public function universityAdmissionApplication(): BelongsTo
    {
        return $this->belongsTo(UniversityAdmissionApplication::class, 'university_admission_application_id');
    }

    /**
     * Define the relationship to the university admission criteria.
     * 
     * @return BelongsTo
     */
    public function universityAdmissionCriteria(): BelongsTo
    {
        return $this->belongsTo(UniversityAdmissionCriteria::class, 'university_admission_criteria_id');
    }

    /**
     * Get all media files in the 'files' collection.
     * 
     * @return MorphMany
     */
    public function files(): MorphMany
    {
        return $this->media()->where('collection_name', self::$COLLECTION_NAME);
    }

    /**
     * Register media collections for this model.
     * Configures the 'files' collection to accept a single file.
     * 
     * @return void
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::$COLLECTION_NAME)->singleFile();
    }
}
