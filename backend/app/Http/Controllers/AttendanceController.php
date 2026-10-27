<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Get attendance history for the authenticated user, or all attendance if owner/admin.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Attendance::with(['user:id,name,email,role'])->orderBy('date', 'desc')->orderBy('id', 'desc');

        // If not admin or owner, restrict to their own records
        if ($user && ! in_array($user->role, ['admin', 'owner'], true)) {
            $query->where('user_id', $user->id);
        } elseif ($request->filled('user_id')) {
            $query->where('user_id', $request->query('user_id'));
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->query('date'));
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date', [$request->query('start_date'), $request->query('end_date')]);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $attendances = $query->paginate($request->query('per_page', 50));

        // Attendance summary stats for today
        $today = now()->toDateString();
        $totalEmployees = User::whereIn('role', ['karyawan', 'cashier'])->count();
        $presentToday = Attendance::whereDate('date', $today)
            ->whereNotNull('clock_in')
            ->distinct('user_id')
            ->count('user_id');

        return response()->json([
            'success' => true,
            'data' => $attendances->items(),
            'total' => $attendances->total(),
            'current_page' => $attendances->currentPage(),
            'last_page' => $attendances->lastPage(),
            'stats' => [
                'total_employees' => $totalEmployees,
                'present_today' => $presentToday,
                'absent_today' => max(0, $totalEmployees - $presentToday),
            ],
        ]);
    }

    /**
     * Check status absen hari ini untuk user yang sedang login.
     */
    public function todayStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = now()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        return response()->json([
            'success' => true,
            'data' => $attendance,
            'server_time' => now()->toDateTimeString(),
        ]);
    }

    /**
     * Clock in (Absen Masuk).
     */
    public function clockIn(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = now()->toDateString();

        $existing = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if ($existing && $existing->clock_in) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan absen masuk hari ini pukul '.$existing->clock_in->format('H:i'),
                'data' => $existing,
            ], 422);
        }

        $validated = $request->validate([
            'type' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'location' => ['nullable', 'string'],
        ]);

        $currentTime = now();
        $cutoffTime = now()->setTime(8, 30, 0); // batas toleransi 08:30
        $status = $currentTime->greaterThan($cutoffTime) ? 'terlambat' : 'hadir';

        $attendance = Attendance::updateOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            [
                'clock_in' => $currentTime,
                'type' => $validated['type'] ?? 'shift',
                'status' => $status,
                'notes' => $validated['notes'] ?? null,
                'location_in' => $validated['location'] ?? 'POS Outlet Utama',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Absen masuk berhasil tercatat pukul '.$currentTime->format('H:i:s'),
            'data' => $attendance,
        ]);
    }

    /**
     * Clock out (Absen Pulang).
     */
    public function clockOut(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = now()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if (! $attendance || ! $attendance->clock_in) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum melakukan absen masuk hari ini!',
            ], 422);
        }

        if ($attendance->clock_out) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah absen pulang hari ini pukul '.$attendance->clock_out->format('H:i'),
                'data' => $attendance,
            ], 422);
        }

        $validated = $request->validate([
            'notes' => ['nullable', 'string'],
            'location' => ['nullable', 'string'],
        ]);

        $currentTime = now();
        $attendance->update([
            'clock_out' => $currentTime,
            'location_out' => $validated['location'] ?? 'POS Outlet Utama',
            'notes' => $attendance->notes ? ($attendance->notes.' | '.($validated['notes'] ?? '')) : ($validated['notes'] ?? null),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Absen pulang berhasil tercatat pukul '.$currentTime->format('H:i:s'),
            'data' => $attendance,
        ]);
    }

    /**
     * Izin / Sakit manual request.
     */
    public function submitLeave(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'status' => ['required', 'in:izin,sakit'],
            'notes' => ['required', 'string'],
        ]);

        $attendance = Attendance::updateOrCreate(
            ['user_id' => $user->id, 'date' => $validated['date']],
            [
                'status' => $validated['status'],
                'notes' => $validated['notes'],
                'type' => 'izin/sakit',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Keterangan '.$validated['status'].' berhasil dicatat',
            'data' => $attendance,
        ]);
    }
}
