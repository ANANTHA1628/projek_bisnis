<?php

namespace App\Services;

use App\Models\Product;

class PricingService
{
    /**
     * Hitung HPP menu berdasarkan resep aktif saat ini dan biaya kemasan.
     */
    public function calculateProductHpp(Product $product): int
    {
        $recipe = $product->currentRecipe;
        if (! $recipe) {
            return 0;
        }

        return $recipe->calculateHpp();
    }

    /**
     * Hitung metrik Food Cost % dan Margin.
     */
    public function calculateFoodCostMetrics(int $price, int $hpp): array
    {
        $margin = $price - $hpp;
        $foodCostPercent = $price > 0 ? round(($hpp / $price) * 100, 1) : 0;
        $isWarning = $foodCostPercent > 35.0; // Default threshold 35%

        return [
            'price' => $price,
            'hpp' => $hpp,
            'margin' => $margin,
            'food_cost_percent' => $foodCostPercent,
            'warning' => $isWarning,
            'warning_message' => $isWarning ? 'Food cost melebihi batas aman 35%!' : null,
        ];
    }

    /**
     * Kalkulasi transaksi lengkap:
     * - Subtotal dari item + modifier berdasarkan kanal
     * - Diskon manual
     * - PB1 10% dari subtotal setelah diskon
     * - Pembulatan tunai opsional
     * - Komisi ojol
     */
    public function calculateOrderTotals(
        array $items,
        string $channel = 'dine_in',
        int $discount = 0,
        bool $taxExclusive = true,
        bool $applyRounding = false,
        int $commissionPercent = 0
    ): array {
        $subtotal = 0;
        $totalCostSnapshot = 0;
        $calculatedItems = [];

        foreach ($items as $item) {
            $product = isset($item['product_id']) ? Product::with(['channelPrices', 'currentRecipe.items.rawMaterial'])->find($item['product_id']) : null;
            $qty = max(1, (int) ($item['qty'] ?? 1));

            // Harga satuan berdasarkan kanal
            $unitPrice = isset($item['unit_price'])
                ? (int) $item['unit_price']
                : ($product ? $product->getPriceForChannel($channel) : 0);

            // Snapshot HPP saat ini
            $unitCost = isset($item['unit_cost_snapshot'])
                ? (int) $item['unit_cost_snapshot']
                : ($product ? $this->calculateProductHpp($product) : 0);

            // Modifiers
            $modifiersTotal = 0;
            $modifiersCost = 0;
            $calculatedModifiers = [];

            if (! empty($item['modifiers'])) {
                foreach ($item['modifiers'] as $mod) {
                    $modPrice = (int) ($mod['price'] ?? 0);
                    $modCost = (int) ($mod['cost_snapshot'] ?? 0);
                    $modifiersTotal += $modPrice;
                    $modifiersCost += $modCost;

                    $calculatedModifiers[] = [
                        'modifier_id' => $mod['modifier_id'] ?? null,
                        'name_snapshot' => $mod['name_snapshot'] ?? $mod['name'] ?? 'Modifier',
                        'price' => $modPrice,
                        'cost_snapshot' => $modCost,
                    ];
                }
            }

            $itemSubtotal = ($unitPrice + $modifiersTotal) * $qty;
            $itemTotalCost = ($unitCost + $modifiersCost) * $qty;

            $subtotal += $itemSubtotal;
            $totalCostSnapshot += $itemTotalCost;

            $calculatedItems[] = [
                'product_id' => $product?->id,
                'name_snapshot' => $item['name_snapshot'] ?? $product?->name ?? 'Item',
                'qty' => $qty,
                'unit_price' => $unitPrice,
                'unit_cost_snapshot' => $unitCost,
                'recipe_id' => $product?->currentRecipe?->id,
                'notes' => $item['notes'] ?? null,
                'subtotal' => $itemSubtotal,
                'cost_total' => $itemTotalCost,
                'modifiers' => $calculatedModifiers,
            ];
        }

        // Subtotal setelah diskon
        $discountAmount = min($subtotal, max(0, $discount));
        $subtotalAfterDiscount = $subtotal - $discountAmount;

        // PB1 10%
        if ($taxExclusive) {
            // Eksklusif: PB1 ditambahkan di atas subtotal setelah diskon
            $pb1 = (int) round($subtotalAfterDiscount * 0.10);
            $grossTotal = $subtotalAfterDiscount + $pb1;
        } else {
            // Inklusif: Pajak sudah termasuk di harga (10/110)
            $pb1 = (int) round($subtotalAfterDiscount * (10 / 110));
            $grossTotal = $subtotalAfterDiscount;
        }

        // Pembulatan tunai opsional ke Rp100 terdekat
        $rounding = 0;
        $total = $grossTotal;

        if ($applyRounding) {
            $remainder = $grossTotal % 100;
            if ($remainder > 0) {
                if ($remainder < 50) {
                    $rounding = -1 * $remainder;
                } else {
                    $rounding = 100 - $remainder;
                }
                $total = $grossTotal + $rounding;
            }
        }

        // Komisi ojol (GoFood/GrabFood)
        $commissionAmount = 0;
        if (in_array($channel, ['gofood', 'grabfood']) && $commissionPercent > 0) {
            $commissionAmount = (int) round($subtotalAfterDiscount * ($commissionPercent / 100));
        }

        // Estimasi Laba Bersih Transaksi
        $netProfit = $subtotalAfterDiscount - $totalCostSnapshot - $commissionAmount;

        return [
            'channel' => $channel,
            'subtotal' => $subtotal,
            'discount' => $discountAmount,
            'subtotal_after_discount' => $subtotalAfterDiscount,
            'pb1' => $pb1,
            'rounding' => $rounding,
            'total' => $total,
            'commission_percent' => $commissionPercent,
            'commission_amount' => $commissionAmount,
            'cost' => $totalCostSnapshot,
            'net_profit' => $netProfit,
            'items' => $calculatedItems,
        ];
    }

    /**
     * Simulator HPP (INV-12):
     * Memungkinkan user mencoba variasi takaran bahan tanpa menyimpan ke database.
     */
    public function simulateHpp(array $ingredients, int $packagingCost = 0, int $targetPrice = 0): array
    {
        $calculatedHpp = (int) $packagingCost;
        $breakdown = [];

        foreach ($ingredients as $ing) {
            $costPerUnit = (int) ($ing['cost_per_unit'] ?? 0);
            $qty = (float) ($ing['qty'] ?? 0);
            $itemTotal = (int) round($qty * $costPerUnit);

            $calculatedHpp += $itemTotal;
            $breakdown[] = [
                'name' => $ing['name'] ?? 'Bahan',
                'qty' => $qty,
                'unit' => $ing['unit'] ?? 'g',
                'cost_per_unit' => $costPerUnit,
                'total_cost' => $itemTotal,
            ];
        }

        $metrics = $targetPrice > 0 ? $this->calculateFoodCostMetrics($targetPrice, $calculatedHpp) : null;

        return [
            'simulated_hpp' => $calculatedHpp,
            'packaging_cost' => $packagingCost,
            'breakdown' => $breakdown,
            'metrics' => $metrics,
        ];
    }
}
