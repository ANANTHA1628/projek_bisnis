<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PosApiController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Health & Settings
Route::get('/health', [PosApiController::class, 'health']);
Route::get('/settings', [PosApiController::class, 'getSettings']);

// Auth Endpoints (Public)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected Auth Endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/staff', [AuthController::class, 'staffList']);

    // Attendance Endpoints
    Route::get('/attendances', [AttendanceController::class, 'index']);
    Route::get('/attendance/today', [AttendanceController::class, 'todayStatus']);
    Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn']);
    Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut']);
    Route::post('/attendance/leave', [AttendanceController::class, 'submitLeave']);
});

// Master Catalog & Modifiers
Route::get('/categories', [PosApiController::class, 'getCategories']);
Route::get('/products', [PosApiController::class, 'getProducts']);
Route::get('/modifiers', [PosApiController::class, 'getModifiers']);

// Inventory & Stock
Route::get('/materials', [PosApiController::class, 'getMaterials']);
Route::post('/materials', [PosApiController::class, 'storeMaterial']);
Route::delete('/materials/{id}', [PosApiController::class, 'deleteMaterial']);
Route::get('/suppliers', [PosApiController::class, 'getSuppliers']);
Route::post('/restocks', [PosApiController::class, 'processRestock']);
Route::post('/opname', [PosApiController::class, 'processOpname']);
Route::post('/waste', [PosApiController::class, 'processWaste']);
Route::get('/stock-movements', [PosApiController::class, 'getStockMovements']);

// HPP Simulator (INV-12)
Route::post('/simulator/hpp', [PosApiController::class, 'simulateHpp']);

// Sesi Kasir / Shift (PRD 5.2)
Route::get('/shift/active', [PosApiController::class, 'getActiveShift']);
Route::post('/shift/open', [PosApiController::class, 'openShift']);
Route::post('/shift/close', [PosApiController::class, 'closeShift']);

// Orders & Transactions
Route::get('/orders', [PosApiController::class, 'getOrders']);
Route::get('/orders/open', [PosApiController::class, 'getOpenBills']);
Route::post('/orders', [PosApiController::class, 'storeOrder']);
Route::post('/orders/{id}/pay', [PosApiController::class, 'payOrder']);
Route::post('/orders/{id}/void', [PosApiController::class, 'voidOrder']);

// Biaya Operasional (Expenses)
Route::get('/expenses', [PosApiController::class, 'getExpenses']);
Route::post('/expenses', [PosApiController::class, 'storeExpense']);

// Laporan (RPT-01 s/d RPT-06)
Route::get('/reports/{type}', [PosApiController::class, 'getReport']);

// Ekspor Excel & PDF
Route::post('/export/excel', [ReportController::class, 'exportExcel']);
Route::post('/export/pdf', [ReportController::class, 'exportPdf']);
