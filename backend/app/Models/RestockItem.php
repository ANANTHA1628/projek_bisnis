<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RestockItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'restock_id',
        'raw_material_id',
        'qty',
        'unit_price',
    ];

    protected $casts = [
        'qty' => 'float',
        'unit_price' => 'integer',
    ];

    public function restock()
    {
        return $this->belongsTo(Restock::class);
    }

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class);
    }
}
