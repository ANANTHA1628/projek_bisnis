<?php

namespace App\Services;

use App\Models\Order;
use App\Models\RawMaterial;
use App\Models\Recipe;
use App\Models\Restock;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class StockService
{
    /**
     * Catat mutasi stok dan sesuaikan stock_qty di raw_materials.
     * Sumber kebenaran tunggal untuk setiap pergerakan stok.
     */
    public function recordMovement(
        int $rawMaterialId,
        string $type,
        float $qty,
        int $unitCost = 0,
        ?string $referenceType = null,
        ?string $referenceId = null,
        ?string $note = null,
        ?int $userId = null
    ): StockMovement {
        return DB::transaction(function () use (
            $rawMaterialId,
            $type,
            $qty,
            $unitCost,
            $referenceType,
            $referenceId,
            $note,
            $userId
        ) {
            $material = RawMaterial::lockForUpdate()->findOrFail($rawMaterialId);

            if ($unitCost === 0) {
                $unitCost = $material->avg_cost_per_unit;
            }

            // Buat record buku besar
            $movement = StockMovement::create([
                'raw_material_id' => $rawMaterialId,
                'type' => $type,
                'qty' => $qty,
                'unit_cost' => $unitCost,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'note' => $note,
                'user_id' => $userId,
            ]);

            // Update stok fisik (boleh negatif jika kasir mendahului restock)
            $material->stock_qty += $qty;
            $material->save();

            return $movement;
        });
    }

    /**
     * Pengurangan stok otomatis saat pesanan berstatus LUNAS.
     */
    public function deductForOrder(Order $order): array
    {
        $movements = [];

        DB::transaction(function () use ($order, &$movements) {
            $order->load(['items.recipe.items.rawMaterial', 'items.product.currentRecipe.items.rawMaterial']);

            foreach ($order->items as $item) {
                $recipe = $item->recipe ?? ($item->product ? $item->product->currentRecipe : null);

                if (! $recipe) {
                    continue;
                }

                foreach ($recipe->items as $recipeItem) {
                    $deductQty = -1 * ($recipeItem->qty * $item->qty);
                    $movements[] = $this->recordMovement(
                        rawMaterialId: $recipeItem->raw_material_id,
                        type: 'sale',
                        qty: $deductQty,
                        unitCost: $recipeItem->rawMaterial ? $recipeItem->rawMaterial->avg_cost_per_unit : 0,
                        referenceType: 'Order',
                        referenceId: (string) $order->id,
                        note: "Penjualan order #{$order->order_no} ({$item->name_snapshot} x{$item->qty})",
                        userId: $order->user_id
                    );
                }
            }
        });

        return $movements;
    }

    /**
     * Void pesanan lunas:
     * - Jika bukan waste: kembalikan stok (type = 'void_return').
     * - Jika waste: catat sebagai 'waste' (sudah dibuat lalu dibuang).
     */
    public function handleOrderVoid(Order $order, bool $isWaste = false, string $reason = '', ?int $adminUserId = null): array
    {
        $movements = [];

        DB::transaction(function () use ($order, $isWaste, $reason, $adminUserId, &$movements) {
            $order->load(['items.recipe.items.rawMaterial', 'items.product.currentRecipe.items.rawMaterial']);

            foreach ($order->items as $item) {
                $recipe = $item->recipe ?? ($item->product ? $item->product->currentRecipe : null);

                if (! $recipe) {
                    continue;
                }

                foreach ($recipe->items as $recipeItem) {
                    $qtyToReturn = $recipeItem->qty * $item->qty;
                    $materialCost = $recipeItem->rawMaterial ? $recipeItem->rawMaterial->avg_cost_per_unit : 0;

                    if (! $isWaste) {
                        // Kembalikan stok ke gudang/bar
                        $movements[] = $this->recordMovement(
                            rawMaterialId: $recipeItem->raw_material_id,
                            type: 'void_return',
                            qty: $qtyToReturn,
                            unitCost: $materialCost,
                            referenceType: 'OrderVoid',
                            referenceId: (string) $order->id,
                            note: "Void Order #{$order->order_no}: {$reason}",
                            userId: $adminUserId
                        );
                    } else {
                        // Dicatat sebagai waste tanpa mengembalikan stok
                        $movements[] = StockMovement::create([
                            'raw_material_id' => $recipeItem->raw_material_id,
                            'type' => 'waste',
                            'qty' => 0, // stok sudah berkurang saat sale, dicatat sebagai waste log
                            'unit_cost' => $materialCost,
                            'reference_type' => 'OrderVoidWaste',
                            'reference_id' => (string) $order->id,
                            'note' => "Void Waste Order #{$order->order_no} (terlanjur dibuat): {$reason}",
                            'user_id' => $adminUserId,
                        ]);
                    }
                }
            }
        });

        return $movements;
    }

    /**
     * Restock bahan baku dengan metode Rata-rata Bergerak (Moving Average).
     * Formula: new_avg = ((old_stock * old_avg) + (in_qty * unit_price)) / (old_stock + in_qty).
     */
    public function processRestock(
        ?int $supplierId,
        ?string $invoiceNo,
        string $date,
        array $items,
        ?int $userId = null
    ): Restock {
        return DB::transaction(function () use ($supplierId, $invoiceNo, $date, $items, $userId) {
            $totalAmount = 0;
            foreach ($items as $item) {
                $totalAmount += (int) round($item['qty'] * $item['unit_price']);
            }

            $restock = Restock::create([
                'supplier_id' => $supplierId,
                'invoice_no' => $invoiceNo,
                'date' => $date,
                'total' => $totalAmount,
            ]);

            foreach ($items as $item) {
                $material = RawMaterial::lockForUpdate()->findOrFail($item['raw_material_id']);
                $incomingQty = (float) $item['qty'];
                $unitPrice = (int) $item['unit_price'];

                // Hitung Moving Average
                $currentStock = max(0, $material->stock_qty);
                $currentCost = $material->avg_cost_per_unit;

                if ($currentStock + $incomingQty > 0) {
                    $newAvgCost = (int) round(
                        (($currentStock * $currentCost) + ($incomingQty * $unitPrice)) / ($currentStock + $incomingQty)
                    );
                } else {
                    $newAvgCost = $unitPrice;
                }

                $material->avg_cost_per_unit = $newAvgCost;
                $material->save();

                $restock->items()->create([
                    'raw_material_id' => $material->id,
                    'qty' => $incomingQty,
                    'unit_price' => $unitPrice,
                ]);

                $this->recordMovement(
                    rawMaterialId: $material->id,
                    type: 'restock',
                    qty: $incomingQty,
                    unitCost: $unitPrice,
                    referenceType: 'Restock',
                    referenceId: (string) $restock->id,
                    note: "Restock Inv: {$invoiceNo}",
                    userId: $userId
                );
            }

            return $restock->load(['items.rawMaterial', 'supplier']);
        });
    }

    /**
     * Stok Opname: Rekonsiliasi stok sistem vs hitung fisik.
     */
    public function stockOpname(int $rawMaterialId, float $physicalQty, string $reason, ?int $userId = null): StockMovement
    {
        return DB::transaction(function () use ($rawMaterialId, $physicalQty, $reason, $userId) {
            $material = RawMaterial::lockForUpdate()->findOrFail($rawMaterialId);
            $diff = $physicalQty - $material->stock_qty;

            return $this->recordMovement(
                rawMaterialId: $rawMaterialId,
                type: 'opname',
                qty: $diff,
                unitCost: $material->avg_cost_per_unit,
                referenceType: 'Opname',
                referenceId: (string) time(),
                note: "Opname: Sistem {$material->stock_qty} -> Fisik {$physicalQty} (Selisih: {$diff}). Alasan: {$reason}",
                userId: $userId
            );
        });
    }

    /**
     * Catat Buang (Waste): Bahan rusak, tumpah, atau basi.
     */
    public function recordWaste(int $rawMaterialId, float $qty, string $reason, ?int $userId = null): StockMovement
    {
        return DB::transaction(function () use ($rawMaterialId, $qty, $reason, $userId) {
            $material = RawMaterial::findOrFail($rawMaterialId);
            $deductQty = -1 * abs($qty);

            return $this->recordMovement(
                rawMaterialId: $rawMaterialId,
                type: 'waste',
                qty: $deductQty,
                unitCost: $material->avg_cost_per_unit,
                referenceType: 'Waste',
                referenceId: (string) time(),
                note: "Waste: {$reason}",
                userId: $userId
            );
        });
    }

    /**
     * Produksi Bahan Setengah Jadi (mis. batch Cold Brew, Sirup Gula Aren).
     */
    public function produceSemiFinished(int $recipeId, float $batchMultiplier = 1.0, ?int $userId = null): array
    {
        return DB::transaction(function () use ($recipeId, $batchMultiplier, $userId) {
            $recipe = Recipe::with(['items.rawMaterial', 'semiFinishedMaterial'])->findOrFail($recipeId);

            $targetMaterial = $recipe->semiFinishedMaterial;
            if (! $targetMaterial) {
                throw new \InvalidArgumentException('Resep ini bukan resep bahan setengah jadi.');
            }

            $movements = [];
            $batchCost = 0;

            // 1. Kurangi bahan mentah
            foreach ($recipe->items as $item) {
                $consumeQty = -1 * ($item->qty * $batchMultiplier);
                $cost = $item->rawMaterial ? $item->rawMaterial->avg_cost_per_unit : 0;
                $batchCost += (int) round(abs($consumeQty) * $cost);

                $movements[] = $this->recordMovement(
                    rawMaterialId: $item->raw_material_id,
                    type: 'production',
                    qty: $consumeQty,
                    unitCost: $cost,
                    referenceType: 'ProductionBatch',
                    referenceId: (string) $recipe->id,
                    note: "Bahan produksi {$targetMaterial->name} (Batch x{$batchMultiplier})",
                    userId: $userId
                );
            }

            // 2. Tambah stok bahan setengah jadi
            $yieldProduced = $recipe->yield_qty * $batchMultiplier;
            $unitCostProduced = $yieldProduced > 0 ? (int) round($batchCost / $yieldProduced) : 0;

            $movements[] = $this->recordMovement(
                rawMaterialId: $targetMaterial->id,
                type: 'production',
                qty: $yieldProduced,
                unitCost: $unitCostProduced,
                referenceType: 'ProductionYield',
                referenceId: (string) $recipe->id,
                note: "Hasil produksi {$targetMaterial->name} (Batch x{$batchMultiplier})",
                userId: $userId
            );

            return $movements;
        });
    }
}
