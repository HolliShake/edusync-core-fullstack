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
use App\Http\Controllers\CourseRequisiteController;
use App\Http\Controllers\CurriculumTaggingController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\DocumentRequestLogController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\EnrollmentLogController;
use App\Http\Controllers\GradeBookController;
use App\Http\Controllers\GradeBookItemController;
use App\Http\Controllers\GradeBookItemDetailController;

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
    Route::get('/AcademicCalendar/{id}', 'show');
    Route::post('/AcademicCalendar', 'store');
    Route::put('/AcademicCalendar/{id}', 'update');
    Route::delete('/AcademicCalendar/{id}', 'destroy');
});

Route::controller(AcademicProgramController::class)->group(function() {
    Route::get('/AcademicProgram', 'index');
    Route::get('/AcademicProgram/{id}', 'show');
    Route::post('/AcademicProgram/create', 'store');
    Route::put('/AcademicProgram/update/{id}', 'update');
    Route::delete('/AcademicProgram/delete/{id}', 'destroy');
});

Route::controller(AcademicTermController::class)->group(function() {
    Route::get('/AcademicTerm', 'index');
    Route::get('/AcademicTerm/{id}', 'show');
    Route::post('/AcademicTerm', 'store');
    Route::put('/AcademicTerm/{id}', 'update');
    Route::delete('/AcademicTerm/{id}', 'destroy');
});

Route::controller(BuildingController::class)->group(function() {
    Route::get('/Building', 'index');
    Route::get('/Building/{id}', 'show');
    Route::post('/Building/create', 'store');
    Route::put('/Building/update/{id}', 'update');
    Route::delete('/Building/delete/{id}', 'destroy');
});

Route::controller(CampusController::class)->group(function() {
    Route::get('/Campus', 'index');
    Route::get('/Campus/{id}', 'show');
    Route::post('/Campus/create', 'store');
    Route::put('/Campus/update/{id}', 'update');
    Route::delete('/Campus/delete/{id}', 'destroy');
});

Route::controller(CollegeController::class)->group(function() {
    Route::get('/College', 'index');
    Route::get('/College/{id}', 'show');
    Route::post('/College/create', 'store');
    Route::put('/College/update/{id}', 'update');
    Route::delete('/College/delete/{id}', 'destroy');
});

Route::controller(CourseController::class)->group(function() {
    Route::get('/Course', 'index');
    Route::get('/Course/{id}', 'show');
    Route::post('/Course', 'store');
    Route::put('/Course/{id}', 'update');
    Route::delete('/Course/{id}', 'destroy');
});

Route::controller(CourseRequisiteController::class)->group(function() {
    Route::get('/CourseRequisite', 'index');
    Route::get('/CourseRequisite/{id}', 'show');
    Route::post('/CourseRequisite', 'store');
    Route::put('/CourseRequisite/{id}', 'update');
    Route::delete('/CourseRequisite/{id}', 'destroy');
});

Route::controller(CurriculumController::class)->group(function() {
    Route::get('/Curriculum', 'index');
    Route::get('/Curriculum/{id}', 'show');
    Route::post('/Curriculum', 'store');
    Route::put('/Curriculum/{id}', 'update');
    Route::delete('/Curriculum/{id}', 'destroy');
});

Route::controller(CurriculumDetailController::class)->group(function() {
    Route::get('/CurriculumDetail', 'index');
    Route::get('/CurriculumDetail/{id}', 'show');
    Route::post('/CurriculumDetail', 'store');
    Route::post('/CurriculumDetail/multiple', 'createMultiple');
    Route::put('/CurriculumDetail/{id}', 'update');
    Route::delete('/CurriculumDetail/{id}', 'destroy');
});

Route::controller(ProgramTypeController::class)->group(function() {
    Route::get('/ProgramType', 'index');
    Route::get('/ProgramType/{id}', 'show');
    Route::post('/ProgramType/create', 'store');
    Route::put('/ProgramType/update/{id}', 'update');
    Route::delete('/ProgramType/delete/{id}', 'destroy');
});

Route::controller(RoomController::class)->group(function() {
    Route::get('/Room', 'index');
    Route::get('/Room/{id}', 'show');
    Route::post('/Room/create', 'store');
    Route::put('/Room/update/{id}', 'update');
    Route::delete('/Room/delete/{id}', 'destroy');
});

Route::controller(SchoolYearController::class)->group(function() {
    Route::get('/SchoolYear', 'index');
    Route::get('/SchoolYear/{id}', 'show');
    Route::post('/SchoolYear', 'store');
    Route::put('/SchoolYear/{id}', 'update');
    Route::delete('/SchoolYear/{id}', 'destroy');
});

Route::controller(SectionController::class)->group(function() {
    Route::middleware(['throttle:150,1'])->get('/Section', 'index');
    Route::get('/Section/{id}', 'show');
    Route::post('/Section', 'store');
    Route::post('/Section/generate', 'generate');
    Route::put('/Section/{id}', 'update');
    Route::delete('/Section/{id}', 'destroy');
    Route::delete('/Section/code/{section_code}', 'destroyBySectionCode');
});

Route::controller(RequirementController::class)->group(function() {
    Route::get('/Requirement', 'index');
    Route::get('/Requirement/{id}', 'show');
    Route::post('/Requirement', 'store');
    Route::put('/Requirement/{id}', 'update');
    Route::delete('/Requirement/{id}', 'destroy');
});

Route::controller(UserController::class)->group(function() {
    Route::get('/User', 'index');
    Route::get('/User/{id}', 'show');
    Route::post('/User', 'store');
    Route::put('/User/{id}', 'update');
    Route::delete('/User/{id}', 'destroy');
});

Route::controller(DesignitionController::class)->group(function() {
    Route::get('/Designition', 'index');
    Route::get('/Designition/{id}', 'show');
    Route::post('/Designition', 'store');
    Route::post('/Designition/create-program-chair', 'create_program_chair');
    Route::post('/Designition/create-college-dean', 'create_college_dean');
    Route::post('/Designition/create-campus-registrar', 'create_campus_registrar');
    Route::put('/Designition/{id}', 'update');
    Route::delete('/Designition/{id}', 'destroy');
});


Route::controller(AcademicProgramRequirementController::class)->group(function() {
    Route::get('/AcademicProgramRequirement', 'index');
    Route::get('/AcademicProgramRequirement/{id}', 'show');
    Route::post('/AcademicProgramRequirement', 'store');
    Route::put('/AcademicProgramRequirement/{id}', 'update');
    Route::delete('/AcademicProgramRequirement/{id}', 'destroy');
});

Route::controller(AdmissionApplicationController::class)->group(function() {
    Route::get('/AdmissionApplication', 'index');
    Route::get('/AdmissionApplication/{id}', 'show');
    Route::post('/AdmissionApplication', 'store');
    Route::put('/AdmissionApplication/{id}', 'update');
    Route::delete('/AdmissionApplication/{id}', 'destroy');
});


Route::controller(AdmissionApplicationLogController::class)->group(function() {
    Route::get('/AdmissionApplicationLog', 'index');
    Route::get('/AdmissionApplicationLog/{id}', 'show');
    Route::post('/AdmissionApplicationLog', 'store');
    Route::put('/AdmissionApplicationLog/{id}', 'update');
    Route::delete('/AdmissionApplicationLog/{id}', 'destroy');
});


Route::controller(AcademicProgramCriteriaController::class)->group(function() {
    Route::get('/AcademicProgramCriteria', 'index');
    Route::get('/AcademicProgramCriteria/{id}', 'show');
    Route::post('/AcademicProgramCriteria', 'store');
    Route::put('/AcademicProgramCriteria/{id}', 'update');
    Route::delete('/AcademicProgramCriteria/{id}', 'destroy');
});

Route::controller(AdmissionApplicationScoreController::class)->group(function() {
    Route::get('/AdmissionApplicationScore', 'index');
    Route::get('/AdmissionApplicationScore/{id}', 'show');
    Route::post('/AdmissionApplicationScore', 'store');
    Route::post('/AdmissionApplicationScore/createOrUpdateMultiple', 'createOrUpdateMultiple');
    Route::put('/AdmissionApplicationScore/{id}', 'update');
    Route::delete('/AdmissionApplicationScore/{id}', 'destroy');
});

Route::controller(EnrollmentController::class)->group(function() {
    Route::get('/Enrollment', 'index');
    Route::get('/Enrollment/campus/scholastic-filter/{campus_id}', 'getScholasticFilterByCampusId');
    Route::get('/Enrollment/academic-program/scholastic-filter/{academic_program_id}', 'getScholasticFilterByProgramId');
    Route::get('/Enrollment/campus/grouped-by-user-name/{campus_id}', 'getEnrollmentsByCampusIdGroupedByUser');
    Route::get('/Enrollment/academic-program/grouped-by-user-name/{academic_program_id}', 'getEnrollmentsByAcademicProgramIdGroupedByUser');
    Route::get('/Enrollment/{id}', 'show');
    Route::post('/Enrollment', 'store');
    Route::post('/Enrollment/enroll', 'enroll');
    Route::put('/Enrollment/{id}', 'update');
    Route::delete('/Enrollment/{id}', 'destroy');
});

Route::controller(EnrollmentLogController::class)->group(function() {
    Route::get('/EnrollmentLog', 'index');
    Route::get('/EnrollmentLog/{id}', 'show');
    Route::post('/EnrollmentLog', 'store');
    Route::put('/EnrollmentLog/{id}', 'update');
    Route::delete('/EnrollmentLog/{id}', 'destroy');
});

Route::controller(DocumentRequestController::class)->group(function() {
    Route::get('/DocumentRequest', 'index');
    Route::get('/DocumentRequest/{id}', 'show');
    Route::post('/DocumentRequest', 'store');
    Route::put('/DocumentRequest/{id}', 'update');
    Route::delete('/DocumentRequest/{id}', 'destroy');
});

Route::controller(DocumentRequestLogController::class)->group(function() {
    Route::get('/DocumentRequestLog', 'index');
    Route::get('/DocumentRequestLog/{id}', 'show');
    Route::post('/DocumentRequestLog', 'store');
    Route::put('/DocumentRequestLog/{id}', 'update');
    Route::delete('/DocumentRequestLog/{id}', 'destroy');
});

Route::controller(DocumentTypeController::class)->group(function() {
    Route::get('/DocumentType', 'index');
    Route::get('/DocumentType/{id}', 'show');
    Route::post('/DocumentType', 'store');
    Route::put('/DocumentType/{id}', 'update');
    Route::delete('/DocumentType/{id}', 'destroy');
});

Route::controller(CurriculumTaggingController::class)->group(function() {
    Route::get('/CurriculumTagging', 'index');
    Route::get('/CurriculumTagging/{id}', 'show');
    Route::post('/CurriculumTagging', 'store');
    Route::put('/CurriculumTagging/{id}', 'update');
    Route::delete('/CurriculumTagging/{id}', 'destroy');
});

Route::controller(GradeBookController::class)->group(function() {
    Route::get('/GradeBook', 'index');
    Route::get('/GradeBook/{id}', 'show');
    Route::post('/GradeBook', 'store');
    Route::put('/GradeBook/{id}', 'update');
    Route::delete('/GradeBook/{id}', 'destroy');
});

Route::controller(GradeBookItemController::class)->group(function() {
    Route::get('/GradeBookItem', 'index');
    Route::get('/GradeBookItem/{id}', 'show');
    Route::post('/GradeBookItem', 'store');
    Route::put('/GradeBookItem/{id}', 'update');
    Route::delete('/GradeBookItem/{id}', 'destroy');
});

Route::controller(GradeBookItemDetailController::class)->group(function() {
    Route::get('/GradeBookItemDetail', 'index');
    Route::get('/GradeBookItemDetail/{id}', 'show');
    Route::post('/GradeBookItemDetail', 'store');
    Route::put('/GradeBookItemDetail/{id}', 'update');
    Route::delete('/GradeBookItemDetail/{id}', 'destroy');
});