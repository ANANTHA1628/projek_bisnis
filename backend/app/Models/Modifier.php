<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Modifier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'price_delta',
        'cost_delta',
        'group',
        'is_active',
    ];

    protected $casts = [
        'price_delta' => 'integer',
        'cost_delta' => 'integer',
        'is_active' => 'boolean',
    ];
}
