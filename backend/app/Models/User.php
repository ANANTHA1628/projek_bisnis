<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'pin_hash',
        'role', // 'admin', 'owner', 'karyawan' (or 'cashier')
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'pin_hash',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    public function isKaryawan(): bool
    {
        return in_array($this->role, ['karyawan', 'cashier'], true);
    }

    public function isCashier(): bool
    {
        return in_array($this->role, ['karyawan', 'cashier'], true);
    }

    public function cashSessions(): HasMany
    {
        return $this->hasMany(CashSession::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}
