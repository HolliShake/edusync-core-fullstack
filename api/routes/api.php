<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AcademicCalendarController;
use App\Http\Controllers\AcademicProgramController;
use App\Http\Controllers\AcademicProgramCriteriaController;
use App\Http\Controllers\AcademicProgramRequirementController;
use App\Http\Controllers\AcademicTermController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\CampusController;
use App\Http\Controllers\CollegeController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\CurriculumDetailController;
use App\Http\Controllers\DesignitionController;
use App\Http\Controllers\ProgramTypeController;
use App\Http\Controllers\RequirementController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\SchoolYearController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdmissionApplicationController;
use App\Http\Controllers\AdmissionApplicationLogController;
use App\Http\Controllers\AdmissionApplicationScoreController;
use App\Http\Controllers\AdmissionScheduleController;
use App\Http\Controllers\CourseRequisiteController;
use App\Http\Controllers\CurriculumTaggingController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\DocumentRequestLogController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\EnrollmentLogController;
use App\Http\Controllers\FinalGradeController;
use App\Http\Controllers\GradeBookController;
use App\Http\Controllers\GradeBookGradingPeriodController;
use App\Http\Controllers\GradeBookItemController;
use App\Http\Controllers\GradeBookItemDetailController;
use App\Http\Controllers\GradeBookScoreController;
use App\Http\Controllers\GradingPeriodGradeController;
use App\Http\Controllers\ScheduleAssignmentController;
use App\Http\Controllers\SectionTeacherController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/greet', function () {
    return 'Hello World';
});

Route::controller(AuthController::class)->group(function() {
    Route::post('/Auth/login', 'login');
    Route::middleware(['auth:sanctum'])->post('/Auth/logout', 'logout');
    Route::middleware(['auth:sanctum'])->get('/Auth/session', 'session');
});


Route::controller(AcademicCalendarController::class)->group(function() {
    Route::get('/AcademicCalendar', 'index');
    Route::get('/AcademicCalendar/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/AcademicCalendar', 'store');
    Route::put('/AcademicCalendar/{id}', 'update')->where('id', '[0-9]+');
    Route::put('/AcademicCalendar/multiple', 'updateMultiple');
    Route::delete('/AcademicCalendar/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(AcademicProgramController::class)->group(function() {
    Route::get('/AcademicProgram', 'index');
    Route::get('/AcademicProgram/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/AcademicProgram/create', 'store');
    Route::put('/AcademicProgram/update/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/AcademicProgram/delete/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(AcademicTermController::class)->group(function() {
    Route::get('/AcademicTerm', 'index');
    Route::get('/AcademicTerm/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/AcademicTerm', 'store');
    Route::put('/AcademicTerm/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/AcademicTerm/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(BuildingController::class)->group(function() {
    Route::get('/Building', 'index');
    Route::get('/Building/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/Building/create', 'store');
    Route::put('/Building/update/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/Building/delete/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(CampusController::class)->group(function() {
    Route::get('/Campus', 'index');
    Route::get('/Campus/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/Campus/create', 'store');
    Route::put('/Campus/update/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/Campus/delete/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(CollegeController::class)->group(function() {
    Route::get('/College', 'index');
    Route::get('/College/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/College/create', 'store');
    Route::put('/College/update/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/College/delete/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(CourseController::class)->group(function() {
    Route::get('/Course', 'index');
    Route::get('/Course/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/Course', 'store');
    Route::put('/Course/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/Course/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(CourseRequisiteController::class)->group(function() {
    Route::get('/CourseRequisite', 'index');
    Route::get('/CourseRequisite/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/CourseRequisite', 'store');
    Route::put('/CourseRequisite/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/CourseRequisite/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(CurriculumController::class)->group(function() {
    Route::get('/Curriculum', 'index');
    Route::get('/Curriculum/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/Curriculum', 'store');
    Route::put('/Curriculum/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/Curriculum/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(CurriculumDetailController::class)->group(function() {
    Route::get('/CurriculumDetail', 'index');
    Route::get('/CurriculumDetail/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/CurriculumDetail', 'store');
    Route::post('/CurriculumDetail/multiple', 'createMultiple');
    Route::put('/CurriculumDetail/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/CurriculumDetail/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(ProgramTypeController::class)->group(function() {
    Route::get('/ProgramType', 'index');
    Route::get('/ProgramType/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/ProgramType/create', 'store');
    Route::put('/ProgramType/update/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/ProgramType/delete/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(RoomController::class)->group(function() {
    Route::get('/Room', 'index');
    Route::get('/Room/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/Room/create', 'store');
    Route::put('/Room/update/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/Room/delete/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(SchoolYearController::class)->group(function() {
    Route::get('/SchoolYear', 'index');
    Route::get('/SchoolYear/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/SchoolYear', 'store');
    Route::put('/SchoolYear/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/SchoolYear/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(SectionController::class)->group(function() {
    Route::middleware(['throttle:150,1'])->get('/Section', 'index');
    Route::get('/Section/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/Section', 'store');
    Route::post('/Section/generate', 'generate');
    Route::put('/Section/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/Section/{id}', 'destroy')->where('id', '[0-9]+');
    Route::delete('/Section/code/{section_code}', 'destroyBySectionCode');
});

Route::controller(RequirementController::class)->group(function() {
    Route::get('/Requirement', 'index');
    Route::get('/Requirement/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/Requirement', 'store');
    Route::put('/Requirement/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/Requirement/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(UserController::class)->group(function() {
    Route::get('/User', 'index');
    Route::get('/User/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/User', 'store');
    Route::put('/User/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/User/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(DesignitionController::class)->group(function() {
    Route::get('/Designition', 'index');
    Route::get('/Designition/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/Designition', 'store');
    Route::post('/Designition/create-program-chair', 'create_program_chair');
    Route::post('/Designition/create-college-dean', 'create_college_dean');
    Route::post('/Designition/create-campus-registrar', 'create_campus_registrar');
    Route::put('/Designition/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/Designition/{id}', 'destroy')->where('id', '[0-9]+');
});


Route::controller(AcademicProgramRequirementController::class)->group(function() {
    Route::get('/AcademicProgramRequirement', 'index');
    Route::get('/AcademicProgramRequirement/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/AcademicProgramRequirement', 'store');
    Route::put('/AcademicProgramRequirement/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/AcademicProgramRequirement/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(AdmissionApplicationController::class)->group(function() {
    Route::get('/AdmissionApplication', 'index');
    Route::get('/AdmissionApplication/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/AdmissionApplication', 'store');
    Route::put('/AdmissionApplication/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/AdmissionApplication/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(AdmissionScheduleController::class)->group(function() {
    Route::get('/AdmissionSchedule', 'index');
    Route::get('/AdmissionSchedule/active-school-year', 'getActiveSchoolYears');
    Route::get('/AdmissionSchedule/active-campuses', 'getActiveCampuses');
    Route::get('/AdmissionSchedule/active-college-by-campus-id', 'getActiveColleges');
    Route::get('/AdmissionSchedule/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/AdmissionSchedule', 'store');
    Route::put('/AdmissionSchedule/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/AdmissionSchedule/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(AdmissionApplicationLogController::class)->group(function() {
    Route::get('/AdmissionApplicationLog', 'index');
    Route::get('/AdmissionApplicationLog/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/AdmissionApplicationLog', 'store');
    Route::put('/AdmissionApplicationLog/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/AdmissionApplicationLog/{id}', 'destroy')->where('id', '[0-9]+');
});


Route::controller(AcademicProgramCriteriaController::class)->group(function() {
    Route::get('/AcademicProgramCriteria', 'index');
    Route::get('/AcademicProgramCriteria/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/AcademicProgramCriteria', 'store');
    Route::put('/AcademicProgramCriteria/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/AcademicProgramCriteria/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(AdmissionApplicationScoreController::class)->group(function() {
    Route::get('/AdmissionApplicationScore', 'index');
    Route::get('/AdmissionApplicationScore/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/AdmissionApplicationScore', 'store');
    Route::post('/AdmissionApplicationScore/createOrUpdateMultiple', 'createOrUpdateMultiple');
    Route::put('/AdmissionApplicationScore/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/AdmissionApplicationScore/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(EnrollmentController::class)->group(function() {
    Route::get('/Enrollment', 'index');
    Route::get('/Enrollment/campus/scholastic-filter/{campus_id}', 'getScholasticFilterByCampusId')->where('campus_id', '[0-9]+');
    Route::get('/Enrollment/academic-program/scholastic-filter/{academic_program_id}', 'getScholasticFilterByProgramId')->where('academic_program_id', '[0-9]+');
    Route::get('/Enrollment/campus/grouped-by-user-name/{campus_id}', 'getEnrollmentsByCampusIdGroupedByUser')->where('campus_id', '[0-9]+');
    Route::get('/Enrollment/academic-program/grouped-by-user-name/{academic_program_id}', 'getEnrollmentsByAcademicProgramIdGroupedByUser')->where('academic_program_id', '[0-9]+');
    Route::get('/Enrollment/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/Enrollment', 'store');
    Route::post('/Enrollment/enroll', 'enroll');
    Route::put('/Enrollment/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/Enrollment/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(EnrollmentLogController::class)->group(function() {
    Route::get('/EnrollmentLog', 'index');
    Route::get('/EnrollmentLog/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/EnrollmentLog', 'store');
    Route::put('/EnrollmentLog/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/EnrollmentLog/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(DocumentRequestController::class)->group(function() {
    Route::get('/DocumentRequest', 'index');
    Route::get('/DocumentRequest/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/DocumentRequest', 'store');
    Route::put('/DocumentRequest/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/DocumentRequest/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(DocumentRequestLogController::class)->group(function() {
    Route::get('/DocumentRequestLog', 'index');
    Route::get('/DocumentRequestLog/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/DocumentRequestLog', 'store');
    Route::put('/DocumentRequestLog/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/DocumentRequestLog/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(DocumentTypeController::class)->group(function() {
    Route::get('/DocumentType', 'index');
    Route::get('/DocumentType/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/DocumentType', 'store');
    Route::put('/DocumentType/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/DocumentType/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(CurriculumTaggingController::class)->group(function() {
    Route::get('/CurriculumTagging', 'index');
    Route::get('/CurriculumTagging/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/CurriculumTagging', 'store');
    Route::put('/CurriculumTagging/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/CurriculumTagging/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(GradeBookController::class)->group(function() {
    Route::get('/GradeBook', 'index');
    Route::get('/GradeBook/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/GradeBook', 'store');
    Route::post('/GradeBook/generate-from-template/{isTemplateGradeBookId}/{sectionId}', 'generateFromTemplate')->where(['isTemplateGradeBookId' => '[0-9]+', 'sectionId' => '[0-9]+']);
    Route::put('/GradeBook/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/GradeBook/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(GradeBookItemController::class)->group(function() {
    Route::get('/GradeBookItem', 'index');
    Route::get('/GradeBookItem/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/GradeBookItem', 'store');
    Route::put('/GradeBookItem/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/GradeBookItem/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(GradeBookItemDetailController::class)->group(function() {
    Route::get('/GradeBookItemDetail', 'index');
    Route::get('/GradeBookItemDetail/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/GradeBookItemDetail', 'store');
    Route::put('/GradeBookItemDetail/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/GradeBookItemDetail/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(SectionTeacherController::class)->group(function() {
    Route::get('/SectionTeacher', 'index');
    Route::get('/SectionTeacher/campus/{campus_id}', 'getSectionTeachersByCampusIdGroupedByTeacherName')->where('campus_id', '[0-9]+');
    Route::get('/SectionTeacher/program/{academic_program_id}', 'getSectionTeachersByProgramIdGroupedByTeacherName')->where('academic_program_id', '[0-9]+');
    Route::get('/SectionTeacher/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/SectionTeacher', 'store');
    Route::put('/SectionTeacher/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/SectionTeacher/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(GradeBookGradingPeriodController::class)->group(function() {
    Route::get('/GradeBookGradingPeriod', 'index');
    Route::get('/GradeBookGradingPeriod/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/GradeBookGradingPeriod', 'store');
    Route::put('/GradeBookGradingPeriod/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/GradeBookGradingPeriod/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(GradeBookScoreController::class)->group(function() {
    Route::get('/GradeBookScore', 'index');
    Route::get('/GradeBookScore/get-sync/{section_id}', 'getSyncGradeBookScore')->where('section_id', '[0-9]+');
    Route::get('/GradeBookScore/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/GradeBookScore', 'store');
    Route::post('/GradeBookScore/sync-score/{section_id}', 'syncScoreForSection')->where('section_id', '[0-9]+');
    Route::put('/GradeBookScore/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/GradeBookScore/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(GradingPeriodGradeController::class)->group(function() {
    Route::get('/GradingPeriodGrade', 'index');
    Route::get('/GradingPeriodGrade/get-sync/{section_id}', 'getSyncGradingPeriodGrade')->where('section_id', '[0-9]+');
    Route::get('/GradingPeriodGrade/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/GradingPeriodGrade', 'store');
    Route::post('/GradingPeriodGrade/sync-grading-period-grade/{section_id}', 'syncGradingPeriodGradeForSection')->where('section_id', '[0-9]+');
    Route::put('/GradingPeriodGrade/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/GradingPeriodGrade/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(FinalGradeController::class)->group(function() {
    Route::get('/FinalGrade', 'index');
    Route::get('/FinalGrade/get-sync/{section_id}', 'getSyncFinalGrade')->where('section_id', '[0-9]+');
    Route::get('/FinalGrade/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/FinalGrade', 'store');
    Route::post('/FinalGrade/sync-final-grade/{section_id}', 'syncFinalGradeForSection')->where('section_id', '[0-9]+');
    Route::put('/FinalGrade/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/FinalGrade/{id}', 'destroy')->where('id', '[0-9]+');
});

Route::controller(ScheduleAssignmentController::class)->group(function() {
    Route::get('/ScheduleAssignment', 'index');
    Route::get('/ScheduleAssignment/section/{section_code}', 'getBySectionCode');
    Route::get('/ScheduleAssignment/{id}', 'show')->where('id', '[0-9]+');
    Route::post('/ScheduleAssignment', 'store');
    Route::put('/ScheduleAssignment/{id}', 'update')->where('id', '[0-9]+');
    Route::delete('/ScheduleAssignment/{id}', 'destroy')->where('id', '[0-9]+');
});
