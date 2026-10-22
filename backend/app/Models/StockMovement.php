<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'raw_material_id',
        'type', // restock, sale, waste, opname, production, void_return
        'qty',
        'unit_cost',
        'reference_type',
        'reference_id',
        'note',
        'user_id',
    ];

    protected $casts = [
        'qty' => 'float',
        'unit_cost' => 'integer',
    ];

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
