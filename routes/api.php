<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('/testimonials', TestimonialController::class);
Route::controller(TestimonialController::class)->group(function () {
    Route::get('/get-testimonials', 'getTestimonials');
    Route::get('/get-testimonial', 'getTestimonial');
    Route::post('/add-testimonial', 'store');
    Route::post('/update-testimonial', 'update');
    Route::post('/update-order', 'updateOrder');
});
Route::middleware(['guest'])->group(function () {

});

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
    Route::post('/logout', 'logout');
});