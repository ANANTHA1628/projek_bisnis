<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'opened_at',
        'closed_at',
        'opening_cash',
        'expected_cash',
        'actual_cash',
        'difference',
        'notes',
    ];

    protected $casts = [
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
        'opening_cash' => 'integer',
        'expected_cash' => 'integer',
        'actual_cash' => 'integer',
        'difference' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function isOpen(): bool
    {
        return $this->closed_at === null;
    }
}
