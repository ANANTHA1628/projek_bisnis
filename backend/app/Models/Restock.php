<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restock extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'invoice_no',
        'date',
        'total',
    ];

    protected $casts = [
        'total' => 'integer',
        'date' => 'date',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items()
    {
        return $this->hasMany(RestockItem::class);
    }
}
