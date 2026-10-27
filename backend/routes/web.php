<?php

use App\Http\Controllers\PosApiController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Health check fallback untuk root /health (sering dipanggil probe / monitoring)
Route::get('/health', [PosApiController::class, 'health']);
