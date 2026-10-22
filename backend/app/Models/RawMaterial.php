<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RawMaterial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'base_unit',
        'stock_qty',
        'min_stock',
        'avg_cost_per_unit',
        'daily_usage',
        'is_semi_finished',
    ];

    protected $casts = [
        'stock_qty' => 'float',
        'min_stock' => 'float',
        'avg_cost_per_unit' => 'integer',
        'daily_usage' => 'float',
        'is_semi_finished' => 'boolean',
    ];

    public function movements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function recipeItems()
    {
        return $this->hasMany(RecipeItem::class);
    }

    /**
     * Hitung status stok: Aman, Hampir Habis, Habis.
     */
    public function getStockStatusAttribute(): string
    {
        if ($this->stock_qty <= 0) {
            return 'Habis';
        }
        if ($this->stock_qty <= $this->min_stock) {
            return 'Hampir Habis';
        }

        return 'Aman';
    }

    /**
     * Hitung nilai aset stok (stok * HPP per satuan).
     */
    public function getAssetValueAttribute(): int
    {
        return (int) round(max(0, $this->stock_qty) * $this->avg_cost_per_unit);
    }
}
