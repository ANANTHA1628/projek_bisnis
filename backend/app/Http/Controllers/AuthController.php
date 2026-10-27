<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register new user (admin, owner, or karyawan).
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:4'],
            'role' => ['required', 'string', Rule::in(['admin', 'owner', 'karyawan', 'cashier'])],
            'pin' => ['nullable', 'string', 'min:4', 'max:6'],
        ]);

        // Normalize cashier -> karyawan or keep as requested
        $role = $validated['role'] === 'cashier' ? 'karyawan' : $validated['role'];

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $role,
            'pin_hash' => ! empty($validated['pin']) ? Hash::make($validated['pin']) : null,
            'is_active' => true,
        ]);

        $token = $user->createToken('posa-auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ],
        ], 201);
    }

    /**
     * Login using email & password or email & PIN.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['nullable', 'string'],
            'pin' => ['nullable', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['Akun dengan email tersebut tidak ditemukan.'],
            ]);
        }

        if (! $user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun dinonaktifkan. Hubungi admin/owner.',
            ], 403);
        }

        $passwordValid = false;
        if (! empty($validated['password']) && ! empty($user->password)) {
            $passwordValid = Hash::check($validated['password'], $user->password);
        }

        $pinValid = false;
        if (! empty($validated['pin']) && ! empty($user->pin_hash)) {
            $pinValid = Hash::check($validated['pin'], $user->pin_hash);
        }

        // Allow login if either password or PIN is verified
        if (! $passwordValid && ! $pinValid) {
            throw ValidationException::withMessages([
                'password' => ['Password atau PIN yang dimasukkan salah.'],
            ]);
        }

        // Delete old tokens and generate new
        $user->tokens()->delete();
        $token = $user->createToken('posa-auth')->plainTextToken;

        // Normalize display role (if 'cashier' convert to 'karyawan')
        $normalizedRole = $user->role === 'cashier' ? 'karyawan' : $user->role;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $normalizedRole,
                'is_active' => $user->is_active,
            ],
        ]);
    }

    /**
     * Get authenticated user profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $normalizedRole = $user->role === 'cashier' ? 'karyawan' : $user->role;

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $normalizedRole,
                'is_active' => $user->is_active,
            ],
        ]);
    }

    /**
     * Logout user & revoke token.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            $user->tokens()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ]);
    }

    /**
     * List all staff users (for owner/admin attendance management).
     */
    public function staffList(): JsonResponse
    {
        $staff = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $staff,
        ]);
    }
}
