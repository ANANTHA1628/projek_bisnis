<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_no',
        'cash_session_id',
        'user_id',
        'customer_id',
        'channel',
        'table_no',
        'status',
        'subtotal',
        'discount',
        'pb1',
        'rounding',
        'total',
        'commission_percent',
        'paid_at',
        'void_reason',
        'void_by_user_id',
    ];

    protected $casts = [
        'subtotal' => 'integer',
        'discount' => 'integer',
        'pb1' => 'integer',
        'rounding' => 'integer',
        'total' => 'integer',
        'commission_percent' => 'integer',
        'paid_at' => 'datetime',
    ];

    public function cashSession()
    {
        return $this->belongsTo(CashSession::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function voidByUser()
    {
        return $this->belongsTo(User::class, 'void_by_user_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Hitung total HPP transaksi dari snapshot item
     */
    public function getTotalCostAttribute(): int
    {
        return (int) $this->items->sum(function ($item) {
            $modifiersCost = $item->modifiers ? $item->modifiers->sum('cost_snapshot') : 0;

            return ($item->unit_cost_snapshot + $modifiersCost) * $item->qty;
        });
    }

    /**
     * Hitung nilai komisi ojol dalam rupiah
     */
    public function getCommissionAmountAttribute(): int
    {
        if ($this->commission_percent <= 0) {
            return 0;
        }

        return (int) round($this->subtotal * ($this->commission_percent / 100));
    }
}
