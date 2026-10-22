<?php

namespace Tests\Feature;

use App\Models\CashSession;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\RawMaterial;
use App\Models\Recipe;
use App\Models\Setting;
use App\Models\StockMovement;
use App\Models\User;
use App\Services\PricingService;
use App\Services\StockService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PosBusinessRulesTest extends TestCase
{
    use RefreshDatabase;

    protected PricingService $pricingService;

    protected StockService $stockService;

    protected User $admin;

    protected User $cashier;

    protected function setUp(): void
    {
        parent::setUp();
        $this->pricingService = app(PricingService::class);
        $this->stockService = app(StockService::class);

        // Admin & Cashier
        $this->admin = User::create([
            'name' => 'Rina Owner',
            'email' => 'admin@posa.local',
            'role' => 'admin',
            'pin_hash' => Hash::make('1234'),
            'is_active' => true,
        ]);

        $this->cashier = User::create([
            'name' => 'Doni Kasir',
            'email' => 'kasir@posa.local',
            'role' => 'cashier',
            'pin_hash' => Hash::make('0000'),
            'is_active' => true,
        ]);

        Setting::set('tax_pb1_rate', '10');
        Setting::set('tax_mode', 'exclusive');
        Setting::set('ojol_commission_percent', '20');
    }

    /**
     * Kriteria 1: PB1 dan Total cocok pada 10 skenario uji (Section 4.1 & Kriteria Penerimaan Fase 1).
     */
    public function test_pb1_and_total_calculations_across_10_scenarios(): void
    {
        $scenarios = [
            // [Subtotal, Discount, Exclusive?, Rounding?, Expected PB1, Expected Total]
            // Skenario 1: Pesanan standar tanpa diskon (Rp 25.000)
            [25000, 0, true, false, 2500, 27500],
            // Skenario 2: Pesanan dengan diskon manual Rp 5.000 (Rp 50.000 - 5.000 = Rp 45.000)
            [50000, 5000, true, false, 4500, 49500],
            // Skenario 3: Diskon 100% / gratis (Rp 20.000 - 20.000 = 0)
            [20000, 20000, true, false, 0, 0],
            // Skenario 4: Nilai ganjil (Rp 22.350) -> PB1 round(2235) = 2235, Total = 24585
            [22350, 0, true, false, 2235, 24585],
            // Skenario 5: Nilai ganjil dengan pembulatan tunai ke Rp 100 terdekat
            // Rp 24.585 -> sisa 85 >= 50 -> dibulatkan ke atas +15 -> Rp 24.600
            [22350, 0, true, true, 2235, 24600],
            // Skenario 6: Pembulatan tunai ke bawah
            // Rp 20.020 + PB1 2002 = Rp 22.022 -> sisa 22 < 50 -> dibulatkan ke bawah -22 -> Rp 22.000
            [20020, 0, true, true, 2002, 22000],
            // Skenario 7: Mode Pajak Inklusif (Pajak sudah termasuk di harga menu)
            // Rp 110.000 inklusif -> PB1 = round(110.000 * 10/110) = 10.000, Total = 110.000
            [110000, 0, false, false, 10000, 110000],
            // Skenario 8: Mode Pajak Inklusif dengan diskon Rp 10.000
            // Rp 110.000 - 10.000 = Rp 100.000 -> PB1 = round(100.000 * 10/110) = 9091, Total = 100.000
            [110000, 10000, false, false, 9091, 100000],
            // Skenario 9: Pesanan besar (Rp 500.000) -> PB1 50.000, Total 550.000
            [500000, 0, true, false, 50000, 550000],
            // Skenario 10: Pesanan 1 item kecil (Rp 10.000) -> PB1 1.000, Total 11.000
            [10000, 0, true, false, 1000, 11000],
        ];

        foreach ($scenarios as $index => [$subtotal, $disc, $exclusive, $rounding, $expectedPb1, $expectedTotal]) {
            $items = [
                ['name_snapshot' => 'Test Item', 'qty' => 1, 'unit_price' => $subtotal],
            ];

            $calc = $this->pricingService->calculateOrderTotals(
                items: $items,
                channel: 'dine_in',
                discount: $disc,
                taxExclusive: $exclusive,
                applyRounding: $rounding
            );

            $this->assertEquals($expectedPb1, $calc['pb1'], 'Skenario #'.($index + 1).' PB1 tidak sesuai');
            $this->assertEquals($expectedTotal, $calc['total'], 'Skenario #'.($index + 1).' Total tidak sesuai');
        }
    }

    /**
     * Kriteria 2: Transaksi lunas mengurangi stok sesuai resep; void mengembalikannya (Section 4.4 & 4.5).
     */
    public function test_order_payment_deducts_stock_and_void_restores_it(): void
    {
        // Setup raw material: Biji Kopi (stock awal 1000g, avg 200)
        $material = RawMaterial::create([
            'name' => 'Biji Kopi Test',
            'base_unit' => 'g',
            'stock_qty' => 1000,
            'min_stock' => 200,
            'avg_cost_per_unit' => 200,
        ]);

        $category = Category::create(['name' => 'Kopi']);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Kopi Hitam',
            'base_price' => 15000,
        ]);

        $recipe = Recipe::create([
            'product_id' => $product->id,
            'version' => 1,
            'packaging_cost' => 500,
            'is_current' => true,
        ]);

        // Resep butuh 18g biji kopi per cup
        $recipe->items()->create([
            'raw_material_id' => $material->id,
            'qty' => 18,
        ]);

        // Buat Order: 2 cup Kopi Hitam (akan mengurangi 2 * 18 = 36g)
        $order = Order::create([
            'order_no' => 'TRX-TEST-001',
            'channel' => 'dine_in',
            'status' => 'paid',
            'subtotal' => 30000,
            'pb1' => 3000,
            'total' => 33000,
        ]);

        $order->items()->create([
            'product_id' => $product->id,
            'name_snapshot' => $product->name,
            'qty' => 2,
            'unit_price' => 15000,
            'unit_cost_snapshot' => 4100, // (18 * 200) + 500
            'recipe_id' => $recipe->id,
        ]);

        // Jalankan pemotongan stok otomatis saat lunas
        $this->stockService->deductForOrder($order);

        // Verifikasi stok berkurang 36g: 1000 - 36 = 964g
        $this->assertEquals(964.0, (float) $material->fresh()->stock_qty);

        // Verifikasi ada record di buku besar stock_movements
        $movement = StockMovement::where('reference_id', (string) $order->id)->where('type', 'sale')->first();
        $this->assertNotNull($movement);
        $this->assertEquals(-36.0, (float) $movement->qty);

        // Test VOID: Admin membatalkan pesanan (bukan waste -> stok harus kembali)
        $this->stockService->handleOrderVoid(
            order: $order,
            isWaste: false,
            reason: 'Pelanggan salah pesan',
            adminUserId: $this->admin->id
        );

        // Verifikasi stok kembali ke 1000g
        $this->assertEquals(1000.0, (float) $material->fresh()->stock_qty);

        // Verifikasi ada movement type void_return
        $voidReturn = StockMovement::where('reference_id', (string) $order->id)->where('type', 'void_return')->first();
        $this->assertNotNull($voidReturn);
        $this->assertEquals(36.0, (float) $voidReturn->qty);
    }

    /**
     * Kriteria 3: HPP dan Food Cost % dihitung otomatis dan berubah saat restock (Moving Average) (Section 4.3).
     */
    public function test_moving_average_restock_and_food_cost_calculation(): void
    {
        // Awal: stok 100g harga Rp 100/g -> total nilai = Rp 10.000
        $material = RawMaterial::create([
            'name' => 'Biji Kopi MA',
            'base_unit' => 'g',
            'stock_qty' => 100,
            'min_stock' => 50,
            'avg_cost_per_unit' => 100,
        ]);

        // Restock baru: beli 100g seharga Rp 200/g
        // Moving Average baru = (100*100 + 100*200) / 200 = 30.000 / 200 = Rp 150/g
        $this->stockService->processRestock(
            supplierId: null,
            invoiceNo: 'INV-TEST-01',
            date: now()->toDateString(),
            items: [
                ['raw_material_id' => $material->id, 'qty' => 100, 'unit_price' => 200],
            ]
        );

        $material->refresh();
        $this->assertEquals(200.0, (float) $material->stock_qty);
        $this->assertEquals(150, $material->avg_cost_per_unit);

        // Hitung Food Cost % untuk produk harga Rp 20.000 dengan HPP Rp 6.000 (30%) vs Rp 8.000 (40% - warning)
        $safeMetrics = $this->pricingService->calculateFoodCostMetrics(20000, 6000);
        $this->assertEquals(30.0, $safeMetrics['food_cost_percent']);
        $this->assertFalse($safeMetrics['warning']);

        $dangerMetrics = $this->pricingService->calculateFoodCostMetrics(20000, 8000);
        $this->assertEquals(40.0, $dangerMetrics['food_cost_percent']);
        $this->assertTrue($dangerMetrics['warning']);
    }

    /**
     * Kriteria 4: Tutup kasir menghitung selisih dan memvalidasi tagihan terbuka (Section 5.2).
     */
    public function test_shift_closing_with_difference_and_open_bills_blocking(): void
    {
        // 1. Buka Kasir dengan modal awal Rp 500.000
        $responseOpen = $this->postJson('/api/shift/open', [
            'opening_cash' => 500000,
            'notes' => 'Shift Pagi Uji',
        ]);
        $responseOpen->assertStatus(201);
        $session = CashSession::first();

        // 2. Buat Tagihan Terbuka (Open Bill)
        Order::create([
            'order_no' => 'BILL-UNPAID',
            'cash_session_id' => $session->id,
            'channel' => 'dine_in',
            'table_no' => 'Meja 05',
            'status' => 'open',
            'subtotal' => 50000,
            'pb1' => 5000,
            'total' => 55000,
        ]);

        // Coba tutup kasir saat masih ada tagihan terbuka -> HARUS DITOLAK (422)
        $responseCloseFail = $this->postJson('/api/shift/close', [
            'actual_cash' => 500000,
        ]);
        $responseCloseFail->assertStatus(422);
        $responseCloseFail->assertJsonFragment(['open_bills_count' => 1]);

        // Selesaikan tagihan terbuka menjadi paid tunai
        $openOrder = Order::where('order_no', 'BILL-UNPAID')->first();
        $openOrder->update(['status' => 'paid', 'paid_at' => now()]);
        $openOrder->payments()->create(['method' => 'tunai', 'amount' => 55000]);

        // Sekarang tutup kasir dengan uang fisik Rp 555.000
        // Expected cash = Modal Awal (500.000) + Tunai Masuk (55.000) = 555.000
        $responseCloseSuccess = $this->postJson('/api/shift/close', [
            'actual_cash' => 555000,
        ]);

        $responseCloseSuccess->assertStatus(200);
        $responseCloseSuccess->assertJsonPath('summary.difference', 0);
        $responseCloseSuccess->assertJsonPath('summary.status', 'Seimbang (Cocok)');
    }

    /**
     * Kriteria 5: GoFood/GrabFood channel price override dan komisi ojol 20% (Section 4.2).
     */
    public function test_channel_pricing_and_ojol_commission(): void
    {
        $category = Category::create(['name' => 'Minuman']);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Kopi Latte',
            'base_price' => 25000,
        ]);

        // Override GoFood Rp 30.000
        $product->channelPrices()->create([
            'channel' => 'gofood',
            'price' => 30000,
        ]);

        $calc = $this->pricingService->calculateOrderTotals(
            items: [['product_id' => $product->id, 'qty' => 1]],
            channel: 'gofood',
            discount: 0,
            commissionPercent: 20
        );

        // Harga harus pakai override GoFood (Rp 30.000)
        $this->assertEquals(30000, $calc['subtotal']);
        // Komisi 20% dari Rp 30.000 = Rp 6.000
        $this->assertEquals(6000, $calc['commission_amount']);
    }
}
