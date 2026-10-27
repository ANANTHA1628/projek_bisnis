<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthAndAttendanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_register_users_with_different_roles(): void
    {
        // 1. Register Owner
        $ownerRes = $this->postJson('/api/auth/register', [
            'name' => 'Pak Bos',
            'email' => 'bos@posa.local',
            'password' => 'secret123',
            'role' => 'owner',
            'pin' => '1234',
        ]);
        $ownerRes->assertStatus(201)
            ->assertJsonPath('user.role', 'owner')
            ->assertJsonStructure(['token', 'user']);

        // 2. Register Karyawan
        $karyawanRes = $this->postJson('/api/auth/register', [
            'name' => 'Joko Karyawan',
            'email' => 'joko@posa.local',
            'password' => 'secret123',
            'role' => 'karyawan',
            'pin' => '0000',
        ]);
        $karyawanRes->assertStatus(201)
            ->assertJsonPath('user.role', 'karyawan');
    }

    public function test_can_login_with_password_and_pin(): void
    {
        $user = User::create([
            'name' => 'Sari',
            'email' => 'sari@posa.local',
            'password' => 'pass1234',
            'pin_hash' => Hash::make('4321'),
            'role' => 'karyawan',
            'is_active' => true,
        ]);

        // Login with password
        $resPass = $this->postJson('/api/auth/login', [
            'email' => 'sari@posa.local',
            'password' => 'pass1234',
        ]);
        $resPass->assertOk()->assertJsonPath('success', true);

        // Login with PIN
        $resPin = $this->postJson('/api/auth/login', [
            'email' => 'sari@posa.local',
            'pin' => '4321',
        ]);
        $resPin->assertOk()->assertJsonPath('success', true);
    }

    public function test_karyawan_can_clock_in_and_clock_out(): void
    {
        $karyawan = User::create([
            'name' => 'Agus',
            'email' => 'agus@posa.local',
            'password' => 'pass1234',
            'role' => 'karyawan',
            'is_active' => true,
        ]);

        // Clock In
        $inRes = $this->actingAs($karyawan, 'sanctum')->postJson('/api/attendance/clock-in', [
            'notes' => 'Masuk shift pagi',
        ]);
        $inRes->assertOk()->assertJsonPath('success', true);

        $this->assertDatabaseHas('attendances', [
            'user_id' => $karyawan->id,
            'date' => now()->toDateString(),
        ]);

        // Clock Out
        $outRes = $this->actingAs($karyawan, 'sanctum')->postJson('/api/attendance/clock-out', [
            'notes' => 'Pulang shift pagi',
        ]);
        $outRes->assertOk()->assertJsonPath('success', true);
    }

    public function test_owner_can_see_all_attendance_and_karyawan_only_sees_own(): void
    {
        $owner = User::create([
            'name' => 'Ibu Owner',
            'email' => 'ibu@posa.local',
            'password' => 'pass1234',
            'role' => 'owner',
            'is_active' => true,
        ]);

        $karyawan1 = User::create([
            'name' => 'Staf 1',
            'email' => 'staf1@posa.local',
            'password' => 'pass1234',
            'role' => 'karyawan',
            'is_active' => true,
        ]);

        $karyawan2 = User::create([
            'name' => 'Staf 2',
            'email' => 'staf2@posa.local',
            'password' => 'pass1234',
            'role' => 'karyawan',
            'is_active' => true,
        ]);

        Attendance::create([
            'user_id' => $karyawan1->id,
            'date' => now()->toDateString(),
            'clock_in' => now(),
            'status' => 'hadir',
        ]);

        Attendance::create([
            'user_id' => $karyawan2->id,
            'date' => now()->toDateString(),
            'clock_in' => now(),
            'status' => 'terlambat',
        ]);

        // Owner sees both attendances
        $ownerRes = $this->actingAs($owner, 'sanctum')->getJson('/api/attendances');
        $ownerRes->assertOk();
        $this->assertCount(2, $ownerRes->json('data'));

        // Karyawan 1 only sees their own
        $karyawanRes = $this->actingAs($karyawan1, 'sanctum')->getJson('/api/attendances');
        $karyawanRes->assertOk();
        $this->assertCount(1, $karyawanRes->json('data'));
        $this->assertEquals($karyawan1->id, $karyawanRes->json('data.0.user_id'));
    }
}
