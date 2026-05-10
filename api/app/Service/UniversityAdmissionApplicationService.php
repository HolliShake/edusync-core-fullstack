<?php

namespace App\Service;

use App\Interface\IRepo\IUniversityAdmissionApplicationCriteriaSubmissionRepo;
use App\Interface\IRepo\IUniversityAdmissionApplicationRepo;
use App\Interface\IRepo\IUniversityAdmissionScheduleRepo;
use App\Interface\IService\IUniversityAdmissionApplicationService;
use App\Models\UniversityAdmissionApplication;
use App\Models\UniversityAdmissionApplicationCriteriaSubmission;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\IOFactory;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class UniversityAdmissionApplicationService extends GenericService implements IUniversityAdmissionApplicationService
{
    protected IUniversityAdmissionApplicationCriteriaSubmissionRepo $universityAdmissionApplicationCriteriaSubmissionRepository;
    protected IUniversityAdmissionScheduleRepo $universityAdmissionScheduleRepository;

    public function __construct(
        IUniversityAdmissionApplicationRepo $universityAdmissionApplicationRepository,
        IUniversityAdmissionApplicationCriteriaSubmissionRepo $universityAdmissionApplicationCriteriaSubmissionRepository,
        IUniversityAdmissionScheduleRepo $universityAdmissionScheduleRepository
    )
    {
        parent::__construct($universityAdmissionApplicationRepository);
        $this->universityAdmissionApplicationCriteriaSubmissionRepository = $universityAdmissionApplicationCriteriaSubmissionRepository;
        $this->universityAdmissionScheduleRepository = $universityAdmissionScheduleRepository;
    }

    public function submitApplicationForm(array $data)
    {
        try {
            return DB::transaction(function () use ($data) {
                $data['user_id'] = array_values(array_unique($data['user_id']));
                $data['university_admission_id'] = array_values(array_unique($data['university_admission_id']));

                $applicationData = [
                    'user_id' => $data['user_id'][0],
                    'university_admission_id' => $data['university_admission_id'][0],
                    'remark' => 'Pending',
                ];

                $universityAdmissionApplication = $this->repository->create($applicationData);

                foreach (array_map(null, $data['university_admission_criteria_id'], $data['file']) as [$criteriaId, $file]) {
                    $criteriaSubmission = $this->universityAdmissionApplicationCriteriaSubmissionRepository->create([
                        'university_admission_application_id' => $universityAdmissionApplication->id,
                        'university_admission_criteria_id' => $criteriaId,
                    ]);

                    if ($file instanceof \Illuminate\Http\UploadedFile) {
                        $criteriaSubmission->addMedia($file)
                            ->preservingOriginal()
                            ->usingFileName($file->getClientOriginalName())
                            ->toMediaCollection(UniversityAdmissionApplicationCriteriaSubmission::$COLLECTION_NAME);
                    } else {
                        throw new \Exception('File is not an instance of Illuminate\\Http\\UploadedFile');
                    }
                }

                $universityAdmissionApplication->refresh();

                return $this->appendQrCode($universityAdmissionApplication);
            });
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getAll(bool $paginate = true, int $page = 1, int $rows = 10): Collection|LengthAwarePaginator
    {
        $result = parent::getAll($paginate, $page, $rows);

        if ($result instanceof LengthAwarePaginator) {
            $result->setCollection(
                $result->getCollection()->map(fn($item) => $this->appendQrCode($item))
            );

            return $result;
        }

        return $result->map(fn($item) => $this->appendQrCode($item));
    }

    public function getById(int|string $id, array $relations = []): Model
    {
        $application = parent::getById($id, $relations);

        return $this->appendQrCode($application);
    }

    public function create(array $data): Model
    {
        $application = parent::create($data);

        return $this->appendQrCode($application);
    }

    public function update(int|string $id, array $data, array $relations = []): Model
    {
        $application = parent::update($id, $data, $relations);

        return $this->appendQrCode($application);
    }

    public function beforeUpdate(int|string $id, array $data): array
    {
        $application = $this->repository->getById($id);

        if (!$application) {
            $validator = Validator::make([], []);
            $validator->errors()->add('id', 'University admission application not found');
            throw new ValidationException($validator);
        }

        if (isset($data['university_admission_schedule_id'])) {
            $scheduleId = $data['university_admission_schedule_id'];

            $schedule = $this->universityAdmissionScheduleRepository->getById($scheduleId);

            if (!$schedule) {
                $validator = Validator::make([], []);
                $validator->errors()->add('university_admission_schedule_id', 'University admission schedule not found');
                throw new ValidationException($validator);
            }

            $capacity = $schedule->testingCenter->room->room_capacity ?? 0;
            $used = $schedule->applications()
                ->where('id', '!=', $id)
                ->count();
            $remainingSlots = max(0, $capacity - $used);

            if ($remainingSlots <= 0) {
                $validator = Validator::make([], []);
                $validator->errors()->add('university_admission_schedule_id', 'University admission schedule slots are full');
                throw new ValidationException($validator);
            }
        }

        return $data;
    }

    /**
     * Parse an uploaded XLSX score sheet and bulk-update application scores.
     *
     * Expected columns (case-insensitive, order-independent):
     *   - Application ID  → temporary_id (YYYY + 6-digit zero-padded pool_no)
     *   - Average Score   → score
     *
     * @param  UploadedFile  $file
     * @return array{updated: int, not_found: int, skipped: int, errors: array<int, array{row: int, application_id: string|null, reason: string}>}
     */
    public function uploadResult(UploadedFile $file): array
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet       = $spreadsheet->getActiveSheet();
        $rows        = $sheet->toArray(null, true, true, true);

        if (empty($rows)) {
            return ['updated' => 0, 'not_found' => 0, 'skipped' => 0, 'errors' => []];
        }

        // Build column-letter → field map from the header row (first row)
        $headerRow = array_shift($rows);
        $colMap    = [];
        foreach ($headerRow as $col => $heading) {
            $normalized = strtolower(trim((string) $heading));
            if ($normalized === 'application id') {
                $colMap['application_id'] = $col;
            } elseif ($normalized === 'average score') {
                $colMap['score'] = $col;
            }
        }

        if (!isset($colMap['application_id'])) {
            throw new \RuntimeException('Column "Application ID" not found in the uploaded file.');
        }

        if (!isset($colMap['score'])) {
            throw new \RuntimeException('Column "Average Score" not found in the uploaded file.');
        }

        $updated  = 0;
        $notFound = 0;
        $skipped  = 0;
        $errors   = [];
        $rowIndex = 2; // data starts at row 2 (after header)

        foreach ($rows as $row) {
            $rawId    = trim((string) ($row[$colMap['application_id']] ?? ''));
            $rawScore = $row[$colMap['score']] ?? null;

            if ($rawId === '') {
                $skipped++;
                $rowIndex++;
                continue;
            }

            // temporary_id format: YYYY (4 chars) + 6-digit zero-padded pool_no
            if (strlen($rawId) < 7) {
                $errors[] = ['row' => $rowIndex, 'application_id' => $rawId, 'reason' => 'Invalid Application ID format'];
                $rowIndex++;
                continue;
            }

            $year   = (int) substr($rawId, 0, 4);
            $poolNo = (int) substr($rawId, 4);

            if ($year < 2000 || $poolNo <= 0) {
                $errors[] = ['row' => $rowIndex, 'application_id' => $rawId, 'reason' => 'Invalid Application ID format'];
                $rowIndex++;
                continue;
            }

            $application = UniversityAdmissionApplication::where('year', $year)
                ->where('pool_no', $poolNo)
                ->first();

            if (!$application) {
                $notFound++;
                $errors[] = ['row' => $rowIndex, 'application_id' => $rawId, 'reason' => 'Application not found'];
                $rowIndex++;
                continue;
            }

            $score = ($rawScore !== null && $rawScore !== '') ? (float) $rawScore : null;
            $application->update(['score' => $score, 'is_passed' => $score > env('ADMISSION_PASSING_SCORE', 0)]);
            $updated++;
            $rowIndex++;
        }

        return [
            'updated'   => $updated,
            'not_found' => $notFound,
            'skipped'   => $skipped,
            'errors'    => $errors,
        ];
    }

    private function appendQrCode(Model $application): Model
    {
        $scheduleId = (int)($application->university_admission_schedule_id ?? 0);

        if ($scheduleId <= 0) {
            $application->setAttribute('qr_code', null);
            return $application;
        }

        $payload = [
            'application_id' => $application->temporary_id,
            'name' => $this->formatQrName((string)($application->user?->name ?? '')),
        ];

        $qrData = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $svg = QrCode::format('svg')
            ->size(280)
            ->margin(1)
            ->errorCorrection('M')
            ->generate($qrData ?: '{}');

        $application->setAttribute('qr_code', 'data:image/svg+xml;base64,' . base64_encode($svg));

        return $application;
    }

    private function formatQrName(string $name): string
    {
        $clean = trim((string)preg_replace('/\s+/', ' ', $name));

        if ($clean === '') {
            return '';
        }

        if (str_contains($clean, ',')) {
            return $clean;
        }

        $parts = explode(' ', $clean);

        if (count($parts) === 1) {
            return $parts[0];
        }

        $lastName = array_pop($parts);
        $firstName = array_shift($parts);
        $middleName = implode(' ', $parts);

        return trim($lastName . ', ' . $firstName . ($middleName !== '' ? ' ' . $middleName : ''));
    }
}
