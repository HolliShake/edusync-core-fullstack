<?php

use App\Http\Controllers\BuildingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CampusController;
use App\Http\Controllers\CollegeController;
use App\Http\Controllers\RoomController;

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
