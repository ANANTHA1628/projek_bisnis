<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'semi_finished_material_id',
        'version',
        'yield_qty',
        'packaging_cost',
        'is_current',
    ];

    protected $casts = [
        'version' => 'integer',
        'yield_qty' => 'float',
        'packaging_cost' => 'integer',
        'is_current' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function semiFinishedMaterial()
    {
        return $this->belongsTo(RawMaterial::class, 'semi_finished_material_id');
    }

    public function items()
    {
        return $this->hasMany(RecipeItem::class);
    }

    /**
     * Hitung total HPP resep = sum(qty * material.avg_cost_per_unit) + packaging_cost
     */
    public function calculateHpp(): int
    {
        $ingredientsCost = 0;
        foreach ($this->items as $item) {
            $unitCost = $item->rawMaterial ? $item->rawMaterial->avg_cost_per_unit : 0;
            $ingredientsCost += (int) round($item->qty * $unitCost);
        }

        $totalHpp = $ingredientsCost + (int) $this->packaging_cost;
        $yield = $this->yield_qty > 0 ? $this->yield_qty : 1;

        return (int) round($totalHpp / $yield);
    }
}
