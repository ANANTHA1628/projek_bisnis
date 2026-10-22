<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'name_snapshot',
        'qty',
        'unit_price',
        'unit_cost_snapshot',
        'recipe_id',
        'notes',
    ];

    protected $casts = [
        'qty' => 'integer',
        'unit_price' => 'integer',
        'unit_cost_snapshot' => 'integer',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }

    public function modifiers()
    {
        return $this->hasMany(OrderItemModifier::class);
    }

    public function getSubtotalAttribute(): int
    {
        $modifierTotal = $this->modifiers ? $this->modifiers->sum('price') : 0;

        return ($this->unit_price + $modifierTotal) * $this->qty;
    }
}
