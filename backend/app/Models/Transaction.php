<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $fillable = [
        'invoice_number',
        'date',
        'time',
        'customer',
        'table',
        'order_type',
        'method',
        'subtotal',
        'tax',
        'total',
        'cost',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }
}
