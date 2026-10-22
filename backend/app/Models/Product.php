<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'sku',
        'base_price',
        'is_active',
        'image',
        'icon',
    ];

    protected $casts = [
        'base_price' => 'integer',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function channelPrices()
    {
        return $this->hasMany(ProductChannelPrice::class);
    }

    public function recipes()
    {
        return $this->hasMany(Recipe::class);
    }

    public function currentRecipe()
    {
        return $this->hasOne(Recipe::class)->where('is_current', true)->latest('version');
    }

    /**
     * Dapatkan harga untuk kanal tertentu (mis. dine_in, takeaway, gofood, grabfood).
     * Jika tidak ada override, gunakan base_price.
     */
    public function getPriceForChannel(string $channel): int
    {
        $override = $this->channelPrices->firstWhere('channel', $channel);

        return $override ? (int) $override->price : (int) $this->base_price;
    }
}
