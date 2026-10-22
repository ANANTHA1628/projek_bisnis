<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\CashSession;
use App\Models\Category;
use App\Models\Expense;
use App\Models\Modifier;
use App\Models\Order;
use App\Models\Product;
use App\Models\RawMaterial;
use App\Models\Setting;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\User;
use App\Services\PricingService;
use App\Services\StockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PosApiController extends Controller
{
    public function __construct(
        protected StockService $stockService,
        protected PricingService $pricingService
    ) {}

    /**
     * Health check endpoint.
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'healthy',
            'system' => 'posa v3.0 (POS & F&B Inventory System)',
            'database' => 'SQLite (WAL mode)',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Settings
     */
    public function getSettings(): JsonResponse
    {
        return response()->json(Setting::pluck('value', 'key'));
    }

    /**
     * Master Categories
     */
    public function getCategories(): JsonResponse
    {
        return response()->json(Category::where('is_active', true)->orderBy('sort_order')->get());
    }

    /**
     * Master Products with channel prices and active recipe.
     */
    public function getProducts(): JsonResponse
    {
        $products = Product::with([
            'category',
            'channelPrices',
            'currentRecipe.items.rawMaterial',
        ])
            ->where('is_active', true)
            ->get();

        // Sertakan info HPP & Food Cost % terhitung
        $result = $products->map(function ($p) {
            $hpp = $this->pricingService->calculateProductHpp($p);
            $metrics = $this->pricingService->calculateFoodCostMetrics($p->base_price, $hpp);

            return array_merge($p->toArray(), [
                'calculated_hpp' => $hpp,
                'metrics' => $metrics,
            ]);
        });

        return response()->json($result);
    }

    /**
     * Modifiers (Add-ons, Milk, Sugar)
     */
    public function getModifiers(): JsonResponse
    {
        return response()->json(Modifier::where('is_active', true)->get());
    }

    /**
     * Raw Materials (Bahan Baku) dengan status dan nilai aset real-time.
     */
    public function getMaterials(): JsonResponse
    {
        $materials = RawMaterial::all()->map(function ($m) {
            return array_merge($m->toArray(), [
                'stock_status' => $m->stock_status,
                'asset_value' => $m->asset_value,
            ]);
        });

        return response()->json($materials);
    }

    /**
     * Simpan / Update Bahan Baku.
     */
    public function storeMaterial(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'nullable|integer',
            'name' => 'required|string',
            'base_unit' => 'required|string|in:g,ml,pcs,kg,liter',
            'stock_qty' => 'required|numeric',
            'min_stock' => 'required|numeric|min:0',
            'avg_cost_per_unit' => 'required|integer|min:0',
            'daily_usage' => 'nullable|numeric|min:0',
            'is_semi_finished' => 'nullable|boolean',
        ]);

        if (! empty($validated['id'])) {
            $material = RawMaterial::findOrFail($validated['id']);
            $material->update($validated);
        } else {
            $material = RawMaterial::create($validated);
        }

        return response()->json([
            'message' => 'Bahan baku berhasil disimpan',
            'material' => $material,
        ]);
    }

    /**
     * Hapus bahan baku (soft delete).
     */
    public function deleteMaterial(int $id): JsonResponse
    {
        $material = RawMaterial::findOrFail($id);
        $material->delete();

        return response()->json(['message' => 'Bahan baku berhasil dinonaktifkan']);
    }

    /**
     * Master Suppliers
     */
    public function getSuppliers(): JsonResponse
    {
        return response()->json(Supplier::all());
    }

    /**
     * Sesi Kasir Aktif (PRD 5.2)
     */
    public function getActiveShift(): JsonResponse
    {
        $session = CashSession::with('user')->whereNull('closed_at')->latest('opened_at')->first();

        return response()->json([
            'is_open' => (bool) $session,
            'session' => $session,
        ]);
    }

    /**
     * Buka Sesi Kasir (Shift)
     */
    public function openShift(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'opening_cash' => 'required|integer|min:0',
            'notes' => 'nullable|string',
            'user_id' => 'nullable|integer',
        ]);

        // Cek jika sudah ada sesi buka
        $active = CashSession::whereNull('closed_at')->first();
        if ($active) {
            return response()->json([
                'message' => 'Sesi kasir sudah terbuka!',
                'session' => $active,
            ], 422);
        }

        $userId = $validated['user_id'] ?? User::first()?->id ?? 1;

        $session = CashSession::create([
            'user_id' => $userId,
            'opened_at' => now(),
            'opening_cash' => $validated['opening_cash'],
            'expected_cash' => $validated['opening_cash'],
            'notes' => $validated['notes'] ?? 'Buka Shift Kasir',
        ]);

        return response()->json([
            'message' => 'Sesi kasir berhasil dibuka',
            'session' => $session,
        ], 201);
    }

    /**
     * Tutup Sesi Kasir (Shift Closing)
     * Aturan PRD 5.2: Tagihan terbuka harus diselesaikan, dipindah, atau dibatalkan sebelum ditutup.
     */
    public function closeShift(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'actual_cash' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $session = CashSession::whereNull('closed_at')->latest('opened_at')->first();
        if (! $session) {
            return response()->json(['message' => 'Tidak ada sesi kasir yang sedang aktif!'], 404);
        }

        // Pembatas: cek tagihan terbuka (open bills)
        $openBillsCount = Order::where('cash_session_id', $session->id)->where('status', 'open')->count();
        if ($openBillsCount > 0) {
            return response()->json([
                'message' => "Terdapat {$openBillsCount} tagihan terbuka (Open Bills) yang belum diselesaikan atau dibatalkan!",
                'open_bills_count' => $openBillsCount,
            ], 422);
        }

        // Hitung total tunai masuk selama sesi
        $cashIn = Order::where('cash_session_id', $session->id)
            ->where('status', 'paid')
            ->whereHas('payments', function ($q) {
                $q->where('method', 'tunai');
            })
            ->sum('total');

        $expectedCash = $session->opening_cash + $cashIn;
        $actualCash = $validated['actual_cash'];
        $difference = $actualCash - $expectedCash;

        $session->update([
            'closed_at' => now(),
            'expected_cash' => $expectedCash,
            'actual_cash' => $actualCash,
            'difference' => $difference,
            'notes' => $validated['notes'] ?? $session->notes,
        ]);

        return response()->json([
            'message' => 'Sesi kasir berhasil ditutup',
            'session' => $session,
            'summary' => [
                'opening_cash' => $session->opening_cash,
                'cash_in' => $cashIn,
                'expected_cash' => $expectedCash,
                'actual_cash' => $actualCash,
                'difference' => $difference,
                'status' => $difference === 0 ? 'Seimbang (Cocok)' : ($difference > 0 ? 'Surplus (+)' : 'Selisih Kurang (-)'),
            ],
        ]);
    }

    /**
     * Ambil Tagihan Terbuka (Open Bills)
     */
    public function getOpenBills(): JsonResponse
    {
        $bills = Order::with(['items.modifiers', 'customer'])
            ->where('status', 'open')
            ->latest()
            ->get();

        return response()->json($bills);
    }

    /**
     * Simpan Order Baru (Draft, Open Bill, atau Langsung Bayar)
     */
    public function storeOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'channel' => 'required|string|in:dine_in,takeaway,gofood,grabfood',
            'table_no' => 'nullable|string',
            'customer_name' => 'nullable|string',
            'customer_phone' => 'nullable|string',
            'status' => 'required|string|in:draft,open,paid',
            'discount' => 'nullable|integer|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|integer',
            'items.*.name_snapshot' => 'required|string',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|integer|min:0',
            'items.*.unit_cost_snapshot' => 'nullable|integer|min:0',
            'items.*.notes' => 'nullable|string',
            'items.*.modifiers' => 'nullable|array',
            'payment_method' => 'nullable|string|in:tunai,qris,debit,bayar_nanti',
            'paid_amount' => 'nullable|integer|min:0',
        ]);

        $activeSession = CashSession::whereNull('closed_at')->latest('opened_at')->first();

        // Hitung kalkulasi order via PricingService
        $commissionPercent = in_array($validated['channel'], ['gofood', 'grabfood'])
            ? (int) Setting::get('ojol_commission_percent', 20)
            : 0;

        $calc = $this->pricingService->calculateOrderTotals(
            items: $validated['items'],
            channel: $validated['channel'],
            discount: $validated['discount'] ?? 0,
            taxExclusive: Setting::get('tax_mode', 'exclusive') === 'exclusive',
            applyRounding: ($validated['payment_method'] ?? 'tunai') === 'tunai',
            commissionPercent: $commissionPercent
        );

        $order = DB::transaction(function () use ($validated, $calc, $activeSession, $commissionPercent) {
            $orderNo = 'TRX-'.date('YmdHis').'-'.rand(100, 999);

            $order = Order::create([
                'order_no' => $orderNo,
                'cash_session_id' => $activeSession?->id,
                'channel' => $validated['channel'],
                'table_no' => $validated['table_no'] ?? '-',
                'status' => $validated['status'],
                'subtotal' => $calc['subtotal'],
                'discount' => $calc['discount'],
                'pb1' => $calc['pb1'],
                'rounding' => $calc['rounding'],
                'total' => $calc['total'],
                'commission_percent' => $commissionPercent,
                'paid_at' => $validated['status'] === 'paid' ? now() : null,
            ]);

            foreach ($calc['items'] as $itemData) {
                $orderItem = $order->items()->create([
                    'product_id' => $itemData['product_id'],
                    'name_snapshot' => $itemData['name_snapshot'],
                    'qty' => $itemData['qty'],
                    'unit_price' => $itemData['unit_price'],
                    'unit_cost_snapshot' => $itemData['unit_cost_snapshot'],
                    'recipe_id' => $itemData['recipe_id'],
                    'notes' => $itemData['notes'],
                ]);

                if (! empty($itemData['modifiers'])) {
                    foreach ($itemData['modifiers'] as $mod) {
                        $orderItem->modifiers()->create([
                            'modifier_id' => $mod['modifier_id'],
                            'name_snapshot' => $mod['name_snapshot'],
                            'price' => $mod['price'],
                            'cost_snapshot' => $mod['cost_snapshot'],
                        ]);
                    }
                }
            }

            // Jika status paid, catat pembayaran & kurangi stok
            if ($validated['status'] === 'paid') {
                $method = $validated['payment_method'] ?? 'tunai';
                $order->payments()->create([
                    'method' => $method,
                    'amount' => $validated['paid_amount'] ?? $calc['total'],
                    'reference' => "Bayar {$method}",
                ]);

                // Kurangi stok via StockService
                $this->stockService->deductForOrder($order);
            }

            return $order->load(['items.modifiers', 'payments']);
        });

        return response()->json([
            'message' => 'Pesanan berhasil disimpan',
            'order' => $order,
        ], 201);
    }

    /**
     * Selesaikan Pembayaran Tagihan Terbuka (Open Bill -> Paid)
     */
    public function payOrder(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'payment_method' => 'required|string|in:tunai,qris,debit,bayar_nanti',
            'paid_amount' => 'nullable|integer|min:0',
            'reference' => 'nullable|string',
        ]);

        $order = Order::with(['items.recipe.items.rawMaterial'])->findOrFail($id);

        if ($order->status === 'paid') {
            return response()->json(['message' => 'Pesanan ini sudah lunas!'], 422);
        }

        DB::transaction(function () use ($order, $validated) {
            $order->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            $order->payments()->create([
                'method' => $validated['payment_method'],
                'amount' => $validated['paid_amount'] ?? $order->total,
                'reference' => $validated['reference'] ?? 'Pelunasan Tagihan',
            ]);

            // Pengurangan stok otomatis saat lunas
            $this->stockService->deductForOrder($order);
        });

        return response()->json([
            'message' => 'Pembayaran tagihan berhasil!',
            'order' => $order->fresh(['items.modifiers', 'payments']),
        ]);
    }

    /**
     * Void Pesanan (POS-10 & PRD 3)
     * Memerlukan PIN Admin dan Alasan Wajib.
     */
    public function voidOrder(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'admin_pin' => 'required|string',
            'reason' => 'required|string|min:3',
            'is_waste' => 'nullable|boolean', // jika true, stok tidak dikembalikan (sudah dibuat lalu dibuang)
        ]);

        // Verifikasi PIN Admin
        $admin = User::where('role', 'admin')->where('is_active', true)->first();
        if (! $admin || ! Hash::check($validated['admin_pin'], $admin->pin_hash)) {
            return response()->json(['message' => 'PIN Admin tidak valid!'], 403);
        }

        $order = Order::findOrFail($id);
        if ($order->status === 'void') {
            return response()->json(['message' => 'Pesanan ini sudah di-void sebelumnya.'], 422);
        }

        $oldStatus = $order->status;
        $isWaste = (bool) ($validated['is_waste'] ?? false);

        DB::transaction(function () use ($order, $admin, $validated, $isWaste, $oldStatus) {
            $order->update([
                'status' => 'void',
                'void_reason' => $validated['reason'],
                'void_by_user_id' => $admin->id,
            ]);

            // Jika pesanan sebelumnya lunas, lakukan penanganan stok via StockService
            if ($oldStatus === 'paid') {
                $this->stockService->handleOrderVoid(
                    order: $order,
                    isWaste: $isWaste,
                    reason: $validated['reason'],
                    adminUserId: $admin->id
                );
            }

            // Catat audit log
            AuditLog::create([
                'user_id' => $admin->id,
                'action' => 'void_order',
                'entity' => 'order',
                'entity_id' => (string) $order->id,
                'old_values' => ['status' => $oldStatus],
                'new_values' => ['status' => 'void', 'is_waste' => $isWaste],
                'reason' => $validated['reason'],
            ]);
        });

        return response()->json([
            'message' => 'Pesanan berhasil di-void dan stok telah disesuaikan.',
            'order' => $order->fresh(),
        ]);
    }

    /**
     * Restock Bahan Baku (INV-07)
     */
    public function processRestock(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'supplier_id' => 'nullable|integer',
            'invoice_no' => 'nullable|string',
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.raw_material_id' => 'required|integer',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|integer|min:0',
        ]);

        $restock = $this->stockService->processRestock(
            supplierId: $validated['supplier_id'] ?? null,
            invoiceNo: $validated['invoice_no'] ?? null,
            date: $validated['date'],
            items: $validated['items']
        );

        return response()->json([
            'message' => 'Restock berhasil diproses dan HPP rata-rata diperbarui.',
            'restock' => $restock,
        ], 201);
    }

    /**
     * Stok Opname (INV-08)
     */
    public function processOpname(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'raw_material_id' => 'required|integer',
            'physical_qty' => 'required|numeric',
            'reason' => 'required|string',
        ]);

        $movement = $this->stockService->stockOpname(
            rawMaterialId: $validated['raw_material_id'],
            physicalQty: $validated['physical_qty'],
            reason: $validated['reason']
        );

        return response()->json([
            'message' => 'Stok opname berhasil dicatat.',
            'movement' => $movement,
        ]);
    }

    /**
     * Catat Buang / Waste (INV-08)
     */
    public function processWaste(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'raw_material_id' => 'required|integer',
            'qty' => 'required|numeric|min:0.01',
            'reason' => 'required|string',
        ]);

        $movement = $this->stockService->recordWaste(
            rawMaterialId: $validated['raw_material_id'],
            qty: $validated['qty'],
            reason: $validated['reason']
        );

        return response()->json([
            'message' => 'Barang buang (waste) berhasil dicatat.',
            'movement' => $movement,
        ]);
    }

    /**
     * Buku Besar Pergerakan Stok (RPT-04)
     */
    public function getStockMovements(): JsonResponse
    {
        $movements = StockMovement::with(['rawMaterial', 'user'])->latest()->limit(100)->get();

        return response()->json($movements);
    }

    /**
     * Simulator HPP (INV-12)
     */
    public function simulateHpp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ingredients' => 'required|array',
            'packaging_cost' => 'nullable|integer|min:0',
            'target_price' => 'nullable|integer|min:0',
        ]);

        $result = $this->pricingService->simulateHpp(
            ingredients: $validated['ingredients'],
            packagingCost: $validated['packaging_cost'] ?? 0,
            targetPrice: $validated['target_price'] ?? 0
        );

        return response()->json($result);
    }

    /**
     * Biaya Operasional (Expenses)
     */
    public function getExpenses(): JsonResponse
    {
        return response()->json(Expense::latest('date')->get());
    }

    public function storeExpense(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'category' => 'required|string',
            'amount' => 'required|integer|min:1',
            'note' => 'nullable|string',
        ]);

        $expense = Expense::create($validated);

        return response()->json(['message' => 'Biaya operasional berhasil dicatat', 'expense' => $expense], 201);
    }

    /**
     * Laporan RPT-01 s/d RPT-06
     */
    public function getReport(Request $request, string $type): JsonResponse
    {
        $startDate = $request->query('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', now()->toDateString());

        switch ($type) {
            case 'revenue': // RPT-01
                $orders = Order::where('status', 'paid')
                    ->whereBetween('paid_at', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
                    ->with('payments')
                    ->get();

                $totalGross = $orders->sum('total');
                $totalNet = $orders->sum('subtotal') - $orders->sum('discount');
                $totalTax = $orders->sum('pb1');
                $totalCost = $orders->sum(fn ($o) => $o->total_cost);
                $grossProfit = $totalNet - $totalCost;

                return response()->json([
                    'total_gross' => $totalGross,
                    'total_net' => $totalNet,
                    'total_tax' => $totalTax,
                    'total_cost' => $totalCost,
                    'gross_profit' => $grossProfit,
                    'order_count' => $orders->count(),
                ]);

            case 'profit-loss': // RPT-03
                $orders = Order::where('status', 'paid')
                    ->whereBetween('paid_at', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
                    ->get();

                $omzet = $orders->sum('subtotal');
                $diskon = $orders->sum('discount');
                $hpp = $orders->sum(fn ($o) => $o->total_cost);
                $komisiOjol = $orders->sum(fn ($o) => $o->commission_amount);
                $biayaOps = Expense::whereBetween('date', [$startDate, $endDate])->sum('amount');

                $labaBersih = $omzet - $diskon - $hpp - $komisiOjol - $biayaOps;

                return response()->json([
                    'omzet' => $omzet,
                    'diskon' => $diskon,
                    'hpp' => $hpp,
                    'komisi_ojol' => $komisiOjol,
                    'biaya_operasional' => $biayaOps,
                    'laba_bersih' => $labaBersih,
                ]);

            case 'top-margin': // RPT-06
                $items = DB::table('order_items')
                    ->join('orders', 'order_items.order_id', '=', 'orders.id')
                    ->where('orders.status', 'paid')
                    ->select(
                        'name_snapshot',
                        DB::raw('SUM(qty) as total_qty'),
                        DB::raw('SUM(qty * unit_price) as total_omzet'),
                        DB::raw('SUM(qty * unit_cost_snapshot) as total_cost')
                    )
                    ->groupBy('name_snapshot')
                    ->orderByDesc('total_qty')
                    ->get()
                    ->map(function ($row) {
                        $margin = $row->total_omzet - $row->total_cost;
                        $marginPct = $row->total_omzet > 0 ? round(($margin / $row->total_omzet) * 100, 1) : 0;

                        return [
                            'name' => $row->name_snapshot,
                            'total_qty' => (int) $row->total_qty,
                            'total_omzet' => (int) $row->total_omzet,
                            'total_cost' => (int) $row->total_cost,
                            'margin' => $margin,
                            'margin_pct' => $marginPct,
                        ];
                    });

                return response()->json($items);

            default:
                return response()->json(['message' => 'Tipe laporan tidak dikenali.'], 400);
        }
    }
}
