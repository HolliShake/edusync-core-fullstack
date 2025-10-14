<?php

use App\Http\Controllers\AcademicProgramController;
use App\Http\Controllers\ProgramTypeController;
use App\Http\Controllers\BuildingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CampusController;
use App\Http\Controllers\CollegeController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\SchoolYearController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/greet', function () {
    return 'Hello World';
});

Route::controller(CampusController::class)->group(function() {
    Route::get('/Campus', 'index');
    Route::get('/Campus/{id}', 'show');
    Route::post('/Campus/create', 'store');
    Route::put('/Campus/update/{id}', 'update');
    Route::delete('/Campus/delete/{id}', 'destroy');
});


Route::controller(BuildingController::class)->group(function() {
    Route::get('/Building', 'index');
    Route::get('/Building/{id}', 'show');
    Route::post('/Building/create', 'store');
    Route::put('/Building/update/{id}', 'update');
    Route::delete('/Building/delete/{id}', 'destroy');
});


Route::controller(CollegeController::class)->group(function() {
    Route::get('/College', 'index');
    Route::get('/College/{id}', 'show');
    Route::post('/College/create', 'store');
    Route::put('/College/update/{id}', 'update');
    Route::delete('/College/delete/{id}', 'destroy');
});


Route::controller(RoomController::class)->group(function() {
    Route::get('/Room', 'index');
    Route::get('/Room/{id}', 'show');
    Route::post('/Room/create', 'store');
    Route::put('/Room/update/{id}', 'update');
    Route::delete('/Room/delete/{id}', 'destroy');
});


Route::controller(AcademicProgramController::class)->group(function() {
    Route::get('/AcademicProgram', 'index');
    Route::get('/AcademicProgram/{id}', 'show');
    Route::post('/AcademicProgram/create', 'store');
    Route::put('/AcademicProgram/update/{id}', 'update');
    Route::delete('/AcademicProgram/delete/{id}', 'destroy');
});


Route::controller(ProgramTypeController::class)->group(function() {
    Route::get('/ProgramType', 'index');
    Route::get('/ProgramType/{id}', 'show');
    Route::post('/ProgramType/create', 'store');
    Route::put('/ProgramType/update/{id}', 'update');
    Route::delete('/ProgramType/delete/{id}', 'destroy');
});

Route::controller(CurriculumController::class)->group(function() {
    Route::get('/Curriculum', 'index');
    Route::get('/Curriculum/{id}', 'show');
    Route::post('/Curriculum', 'store');
    Route::put('/Curriculum/{id}', 'update');
    Route::delete('/Curriculum/{id}', 'destroy');
});

Route::controller(CourseController::class)->group(function() {
    Route::get('/Course', 'index');
    Route::get('/Course/{id}', 'show');
    Route::post('/Course', 'store');
    Route::put('/Course/{id}', 'update');
    Route::delete('/Course/{id}', 'destroy');
});


Route::controller(SchoolYearController::class)->group(function() {
    Route::get('/SchoolYear', 'index');
    Route::get('/SchoolYear/{id}', 'show');
    Route::post('/SchoolYear', 'store');
    Route::put('/SchoolYear/{id}', 'update');
    Route::delete('/SchoolYear/{id}', 'destroy');
});
