<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItemModifier extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_item_id',
        'modifier_id',
        'name_snapshot',
        'price',
        'cost_snapshot',
    ];

    protected $casts = [
        'price' => 'integer',
        'cost_snapshot' => 'integer',
    ];

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function modifier()
    {
        return $this->belongsTo(Modifier::class);
    }
}
