<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\CashSession;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\Modifier;
use App\Models\Order;
use App\Models\Product;
use App\Models\RawMaterial;
use App\Models\Recipe;
use App\Models\Setting;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        $admin = User::updateOrCreate(
            ['email' => 'owner@posa.local'],
            [
                'name' => 'Rina',
                'role' => 'admin',
                'pin_hash' => Hash::make('1234'), // PIN Admin
                'is_active' => true,
            ]
        );

        $cashier = User::updateOrCreate(
            ['email' => 'kasir@posa.local'],
            [
                'name' => 'Budi Barista',
                'role' => 'cashier',
                'pin_hash' => Hash::make('0000'), // PIN Kasir
                'is_active' => true,
            ]
        );

        // 2. Settings (D1 s/d D8)
        $settings = [
            'tax_pb1_rate' => '10',
            'tax_mode' => 'exclusive', // D1
            'stock_valuation_method' => 'moving_average', // D2
            'stock_deduct_trigger' => 'on_paid', // D3
            'include_packaging_in_hpp' => '1', // D4
            'pos_device_count' => '1', // D5
            'receipt_printer_size' => '58mm', // D6
            'manual_discount_admin_pin' => '1', // D7
            'ojol_commission_percent' => '20', // D8
            'max_food_cost_threshold' => '35',
            'store_name' => 'posa Coffee & Eatery',
            'store_address' => 'Jl. Bisnis No. 16, Jakarta Selatan',
            'store_wifi' => 'posa_guest / posacoffee2026',
        ];

        foreach ($settings as $key => $val) {
            Setting::updateOrCreate(['key' => $key], ['value' => $val]);
        }

        // 3. Categories
        $catKopi = Category::updateOrCreate(['id' => 1], ['name' => 'Kopi', 'sort_order' => 1, 'is_active' => true]);
        $catNonKopi = Category::updateOrCreate(['id' => 2], ['name' => 'Non-Kopi', 'sort_order' => 2, 'is_active' => true]);
        $catMakanan = Category::updateOrCreate(['id' => 3], ['name' => 'Makanan', 'sort_order' => 3, 'is_active' => true]);

        // 4. Modifiers
        $modExtraShot = Modifier::updateOrCreate(
            ['name' => 'Extra Espresso Shot'],
            ['price_delta' => 5000, 'cost_delta' => 1500, 'group' => 'addon', 'is_active' => true]
        );
        $modOatMilk = Modifier::updateOrCreate(
            ['name' => 'Ganti Susu Oat'],
            ['price_delta' => 6000, 'cost_delta' => 2000, 'group' => 'milk', 'is_active' => true]
        );
        $modExtraAren = Modifier::updateOrCreate(
            ['name' => 'Extra Gula Aren'],
            ['price_delta' => 4000, 'cost_delta' => 1000, 'group' => 'syrup', 'is_active' => true]
        );

        // 5. Suppliers
        $supKopi = Supplier::updateOrCreate(
            ['name' => 'CV Kopi Nusantara'],
            ['phone' => '081122334455', 'notes' => 'Biji Kopi Arabika Single Origin & House Blend']
        );
        $supSusu = Supplier::updateOrCreate(
            ['name' => 'PT Sumber Susu Segar'],
            ['phone' => '081233445566', 'notes' => 'Susu Segar Pasteurisasi & Oat Milk']
        );
        $supKemasan = Supplier::updateOrCreate(
            ['name' => 'Toko Kemasan Jaya'],
            ['phone' => '081344556677', 'notes' => 'Cup 16oz, Lid, Paper Straw, Dus Croissant']
        );

        // 6. 15 Raw Materials
        $rawMaterialsData = [
            ['id' => 1, 'name' => 'Biji kopi arabika', 'base_unit' => 'g', 'stock_qty' => 3200, 'min_stock' => 1000, 'avg_cost_per_unit' => 220, 'daily_usage' => 120.9],
            ['id' => 2, 'name' => 'Susu segar', 'base_unit' => 'ml', 'stock_qty' => 7400, 'min_stock' => 3000, 'avg_cost_per_unit' => 22, 'daily_usage' => 1350],
            ['id' => 3, 'name' => 'Gula aren cair', 'base_unit' => 'ml', 'stock_qty' => 420, 'min_stock' => 1000, 'avg_cost_per_unit' => 40, 'daily_usage' => 46.4],
            ['id' => 4, 'name' => 'Bubuk cokelat', 'base_unit' => 'g', 'stock_qty' => 900, 'min_stock' => 300, 'avg_cost_per_unit' => 180, 'daily_usage' => 39.3],
            ['id' => 5, 'name' => 'Bubuk matcha', 'base_unit' => 'g', 'stock_qty' => 310, 'min_stock' => 200, 'avg_cost_per_unit' => 900, 'daily_usage' => 6.9],
            ['id' => 6, 'name' => 'Teh melati', 'base_unit' => 'g', 'stock_qty' => 650, 'min_stock' => 200, 'avg_cost_per_unit' => 120, 'daily_usage' => 10.7],
            ['id' => 7, 'name' => 'Croissant beku', 'base_unit' => 'pcs', 'stock_qty' => 18, 'min_stock' => 10, 'avg_cost_per_unit' => 9000, 'daily_usage' => 1.1],
            ['id' => 8, 'name' => 'Roti tawar', 'base_unit' => 'pcs', 'stock_qty' => 6, 'min_stock' => 20, 'avg_cost_per_unit' => 2500, 'daily_usage' => 2.0],
            ['id' => 9, 'name' => 'Kentang beku', 'base_unit' => 'g', 'stock_qty' => 4500, 'min_stock' => 2000, 'avg_cost_per_unit' => 35, 'daily_usage' => 450],
            ['id' => 10, 'name' => 'Es batu', 'base_unit' => 'g', 'stock_qty' => 18000, 'min_stock' => 5000, 'avg_cost_per_unit' => 1, 'daily_usage' => 600],
            ['id' => 11, 'name' => 'Cup plastik 16oz', 'base_unit' => 'pcs', 'stock_qty' => 260, 'min_stock' => 100, 'avg_cost_per_unit' => 700, 'daily_usage' => 4.0],
            ['id' => 12, 'name' => 'Tutup & sedotan', 'base_unit' => 'pcs', 'stock_qty' => 280, 'min_stock' => 100, 'avg_cost_per_unit' => 300, 'daily_usage' => 4.0],
            ['id' => 13, 'name' => 'Sirup karamel', 'base_unit' => 'ml', 'stock_qty' => 850, 'min_stock' => 300, 'avg_cost_per_unit' => 85, 'daily_usage' => 15.0],
            ['id' => 14, 'name' => 'Susu oat barista', 'base_unit' => 'ml', 'stock_qty' => 1800, 'min_stock' => 1000, 'avg_cost_per_unit' => 45, 'daily_usage' => 200],
            ['id' => 15, 'name' => 'Kantong takeaway', 'base_unit' => 'pcs', 'stock_qty' => 240, 'min_stock' => 100, 'avg_cost_per_unit' => 500, 'daily_usage' => 5.0],
        ];

        foreach ($rawMaterialsData as $mData) {
            RawMaterial::updateOrCreate(['id' => $mData['id']], $mData);
        }

        // 7. 10 Products with Channel Overrides (GoFood/GrabFood markup ~20%)
        $productsData = [
            [
                'id' => 1,
                'name' => 'Kentang Goreng',
                'category_id' => $catMakanan->id,
                'sku' => 'MK-001',
                'base_price' => 20000,
                'icon' => 'fries',
                'gofood_price' => 24000,
                'grabfood_price' => 24000,
                'packaging_cost' => 1000,
                'ingredients' => [
                    ['material_id' => 9, 'qty' => 150], // 150g kentang beku
                ],
            ],
            [
                'id' => 2,
                'name' => 'Roti Bakar',
                'category_id' => $catMakanan->id,
                'sku' => 'MK-002',
                'base_price' => 18000,
                'icon' => 'toast',
                'gofood_price' => 22000,
                'grabfood_price' => 22000,
                'packaging_cost' => 800,
                'ingredients' => [
                    ['material_id' => 8, 'qty' => 2], // 2 pcs roti tawar
                    ['material_id' => 4, 'qty' => 15], // 15g bubuk cokelat
                ],
            ],
            [
                'id' => 3,
                'name' => 'Croissant',
                'category_id' => $catMakanan->id,
                'sku' => 'MK-003',
                'base_price' => 22000,
                'icon' => 'croissant',
                'gofood_price' => 26000,
                'grabfood_price' => 26000,
                'packaging_cost' => 1000,
                'ingredients' => [
                    ['material_id' => 7, 'qty' => 1], // 1 pcs croissant beku
                ],
            ],
            [
                'id' => 4,
                'name' => 'Es Teh Melati',
                'category_id' => $catNonKopi->id,
                'sku' => 'NK-001',
                'base_price' => 10000,
                'icon' => 'tea',
                'gofood_price' => 12000,
                'grabfood_price' => 12000,
                'packaging_cost' => 1000, // cup + tutup sedotan
                'ingredients' => [
                    ['material_id' => 6, 'qty' => 10], // 10g teh melati
                    ['material_id' => 3, 'qty' => 20], // 20ml gula aren
                    ['material_id' => 10, 'qty' => 150], // 150g es batu
                    ['material_id' => 11, 'qty' => 1], // cup 16oz
                    ['material_id' => 12, 'qty' => 1], // tutup sedotan
                ],
            ],
            [
                'id' => 5,
                'name' => 'Cokelat',
                'category_id' => $catNonKopi->id,
                'sku' => 'NK-002',
                'base_price' => 24000,
                'icon' => 'chocolate',
                'gofood_price' => 28000,
                'grabfood_price' => 28000,
                'packaging_cost' => 1000,
                'ingredients' => [
                    ['material_id' => 4, 'qty' => 30], // 30g cokelat
                    ['material_id' => 2, 'qty' => 150], // 150ml susu
                    ['material_id' => 11, 'qty' => 1],
                    ['material_id' => 12, 'qty' => 1],
                ],
            ],
            [
                'id' => 6,
                'name' => 'Matcha Latte',
                'category_id' => $catNonKopi->id,
                'sku' => 'NK-003',
                'base_price' => 28000,
                'icon' => 'matcha',
                'gofood_price' => 33000,
                'grabfood_price' => 33000,
                'packaging_cost' => 1000,
                'ingredients' => [
                    ['material_id' => 5, 'qty' => 10], // 10g bubuk matcha
                    ['material_id' => 2, 'qty' => 150], // 150ml susu
                    ['material_id' => 11, 'qty' => 1],
                    ['material_id' => 12, 'qty' => 1],
                ],
            ],
            [
                'id' => 7,
                'name' => 'Cappuccino',
                'category_id' => $catKopi->id,
                'sku' => 'KP-001',
                'base_price' => 25000,
                'icon' => 'cappuccino',
                'gofood_price' => 30000,
                'grabfood_price' => 30000,
                'packaging_cost' => 1000,
                'ingredients' => [
                    ['material_id' => 1, 'qty' => 18], // 18g biji kopi
                    ['material_id' => 2, 'qty' => 140], // 140ml susu segar
                    ['material_id' => 11, 'qty' => 1],
                    ['material_id' => 12, 'qty' => 1],
                ],
            ],
            [
                'id' => 8,
                'name' => 'Americano',
                'category_id' => $catKopi->id,
                'sku' => 'KP-002',
                'base_price' => 20000,
                'icon' => 'americano',
                'gofood_price' => 24000,
                'grabfood_price' => 24000,
                'packaging_cost' => 1000,
                'ingredients' => [
                    ['material_id' => 1, 'qty' => 18], // 18g biji kopi
                    ['material_id' => 11, 'qty' => 1],
                    ['material_id' => 12, 'qty' => 1],
                ],
            ],
            [
                'id' => 9,
                'name' => 'Caffe Latte',
                'category_id' => $catKopi->id,
                'sku' => 'KP-003',
                'base_price' => 25000,
                'icon' => 'latte',
                'gofood_price' => 30000,
                'grabfood_price' => 30000,
                'packaging_cost' => 1000,
                'ingredients' => [
                    ['material_id' => 1, 'qty' => 18], // 18g kopi
                    ['material_id' => 2, 'qty' => 180], // 180ml susu
                    ['material_id' => 11, 'qty' => 1],
                    ['material_id' => 12, 'qty' => 1],
                ],
            ],
            [
                'id' => 10,
                'name' => 'Kopi Susu Aren',
                'category_id' => $catKopi->id,
                'sku' => 'KP-004',
                'base_price' => 22000,
                'icon' => 'aren',
                'gofood_price' => 26000,
                'grabfood_price' => 26000,
                'packaging_cost' => 1000,
                'ingredients' => [
                    ['material_id' => 1, 'qty' => 18], // 18g biji kopi
                    ['material_id' => 2, 'qty' => 120], // 120ml susu segar
                    ['material_id' => 3, 'qty' => 25], // 25ml gula aren
                    ['material_id' => 10, 'qty' => 150], // 150g es batu
                    ['material_id' => 11, 'qty' => 1],
                    ['material_id' => 12, 'qty' => 1],
                ],
            ],
        ];

        foreach ($productsData as $pData) {
            $product = Product::updateOrCreate(
                ['id' => $pData['id']],
                [
                    'name' => $pData['name'],
                    'category_id' => $pData['category_id'],
                    'sku' => $pData['sku'],
                    'base_price' => $pData['base_price'],
                    'icon' => $pData['icon'],
                    'is_active' => true,
                ]
            );

            // Channel price overrides
            $product->channelPrices()->updateOrCreate(
                ['channel' => 'dine_in'],
                ['price' => $pData['base_price']]
            );
            $product->channelPrices()->updateOrCreate(
                ['channel' => 'takeaway'],
                ['price' => $pData['base_price']]
            );
            $product->channelPrices()->updateOrCreate(
                ['channel' => 'gofood'],
                ['price' => $pData['gofood_price']]
            );
            $product->channelPrices()->updateOrCreate(
                ['channel' => 'grabfood'],
                ['price' => $pData['grabfood_price']]
            );

            // Recipes & Recipe Items
            $recipe = Recipe::updateOrCreate(
                ['product_id' => $product->id, 'version' => 1],
                [
                    'yield_qty' => 1,
                    'packaging_cost' => $pData['packaging_cost'],
                    'is_current' => true,
                ]
            );

            $recipe->items()->delete();
            foreach ($pData['ingredients'] as $ing) {
                $recipe->items()->create([
                    'raw_material_id' => $ing['material_id'],
                    'qty' => $ing['qty'],
                ]);
            }
        }

        // 8. Active Cash Session (Shift Pagi)
        $cashSession = CashSession::create([
            'user_id' => $admin->id,
            'opened_at' => now()->startOfDay()->addHours(7)->addMinutes(30),
            'opening_cash' => 500000,
            'expected_cash' => 500000,
            'actual_cash' => null,
            'difference' => 0,
            'notes' => 'Shift Pagi - Siang',
        ]);

        // 9. Customers
        $custBudi = Customer::create(['name' => 'Budi Santoso', 'phone' => '081299881122']);
        $custSarah = Customer::create(['name' => 'Sarah Wijaya', 'phone' => '081388776655']);
        $custGojek = Customer::create(['name' => 'Driver Gojek #884', 'phone' => '081512345678']);

        // 10. Initial Orders & Payments
        // Order 1: Dine in
        $order1 = Order::create([
            'order_no' => 'TRX-20261001-001',
            'cash_session_id' => $cashSession->id,
            'user_id' => $admin->id,
            'customer_id' => $custBudi->id,
            'channel' => 'dine_in',
            'table_no' => 'Meja 01',
            'status' => 'paid',
            'subtotal' => 43000,
            'discount' => 0,
            'pb1' => 4300,
            'rounding' => 0,
            'total' => 47300,
            'commission_percent' => 0,
            'paid_at' => now()->startOfDay()->addHours(8)->addMinutes(15),
        ]);
        $order1->items()->create([
            'product_id' => 7, // Cappuccino
            'name_snapshot' => 'Cappuccino',
            'qty' => 1,
            'unit_price' => 25000,
            'unit_cost_snapshot' => 8500,
            'recipe_id' => 7,
            'notes' => 'Normal ice',
        ]);
        $order1->items()->create([
            'product_id' => 2, // Roti Bakar
            'name_snapshot' => 'Roti Bakar',
            'qty' => 1,
            'unit_price' => 18000,
            'unit_cost_snapshot' => 6500,
            'recipe_id' => 2,
            'notes' => 'Cokelat lumer',
        ]);
        $order1->payments()->create([
            'method' => 'tunai',
            'amount' => 50000,
            'reference' => 'Cash - Lunas',
        ]);

        // Order 2: Takeaway QRIS
        $order2 = Order::create([
            'order_no' => 'TRX-20261001-002',
            'cash_session_id' => $cashSession->id,
            'user_id' => $admin->id,
            'customer_id' => $custSarah->id,
            'channel' => 'takeaway',
            'table_no' => '-',
            'status' => 'paid',
            'subtotal' => 54000,
            'discount' => 0,
            'pb1' => 5400,
            'rounding' => 0,
            'total' => 59400,
            'commission_percent' => 0,
            'paid_at' => now()->startOfDay()->addHours(8)->addMinutes(45),
        ]);
        $order2->items()->create([
            'product_id' => 10, // Kopi Susu Aren
            'name_snapshot' => 'Kopi Susu Aren',
            'qty' => 2,
            'unit_price' => 22000,
            'unit_cost_snapshot' => 7500,
            'recipe_id' => 10,
            'notes' => 'Less sugar 50%',
        ]);
        $order2->items()->create([
            'product_id' => 4, // Es Teh Melati
            'name_snapshot' => 'Es Teh Melati',
            'qty' => 1,
            'unit_price' => 10000,
            'unit_cost_snapshot' => 2500,
            'recipe_id' => 4,
            'notes' => 'Normal',
        ]);
        $order2->payments()->create([
            'method' => 'qris',
            'amount' => 59400,
            'reference' => 'QRIS-NMID-9921',
        ]);

        // Order 3: GoFood with Ojol Commission
        $order3 = Order::create([
            'order_no' => 'TRX-20261001-003',
            'cash_session_id' => $cashSession->id,
            'user_id' => $admin->id,
            'customer_id' => $custGojek->id,
            'channel' => 'gofood',
            'table_no' => 'GoFood-12',
            'status' => 'paid',
            'subtotal' => 118000, // (33000 x 2) + (26000 x 2)
            'discount' => 0,
            'pb1' => 11800,
            'rounding' => 0,
            'total' => 129800,
            'commission_percent' => 20,
            'paid_at' => now()->startOfDay()->addHours(9)->addMinutes(12),
        ]);
        $order3->items()->create([
            'product_id' => 6, // Matcha Latte GoFood
            'name_snapshot' => 'Matcha Latte',
            'qty' => 2,
            'unit_price' => 33000,
            'unit_cost_snapshot' => 11000,
            'recipe_id' => 6,
        ]);
        $order3->items()->create([
            'product_id' => 3, // Croissant GoFood
            'name_snapshot' => 'Croissant',
            'qty' => 2,
            'unit_price' => 26000,
            'unit_cost_snapshot' => 9000,
            'recipe_id' => 3,
        ]);
        $order3->payments()->create([
            'method' => 'qris',
            'amount' => 129800,
            'reference' => 'GOFOOD-PAY-4412',
        ]);

        // Tagihan Terbuka (Open Bill)
        $orderOpen = Order::create([
            'order_no' => 'BILL-101',
            'cash_session_id' => $cashSession->id,
            'user_id' => $admin->id,
            'channel' => 'dine_in',
            'table_no' => 'Meja 02',
            'status' => 'open',
            'subtotal' => 60000,
            'discount' => 0,
            'pb1' => 6000,
            'rounding' => 0,
            'total' => 66000,
            'commission_percent' => 0,
        ]);
        $orderOpen->items()->create([
            'product_id' => 8,
            'name_snapshot' => 'Americano',
            'qty' => 2,
            'unit_price' => 20000,
            'unit_cost_snapshot' => 5000,
            'recipe_id' => 8,
        ]);
        $orderOpen->items()->create([
            'product_id' => 1,
            'name_snapshot' => 'Kentang Goreng',
            'qty' => 1,
            'unit_price' => 20000,
            'unit_cost_snapshot' => 8000,
            'recipe_id' => 1,
        ]);

        // 11. Initial Expenses (Biaya Operasional untuk Laba Rugi)
        Expense::create([
            'date' => now()->toDateString(),
            'category' => 'Listrik & Air',
            'amount' => 75000,
            'note' => 'Token listrik harian toko',
        ]);
        Expense::create([
            'date' => now()->toDateString(),
            'category' => 'Bahan Habis Pakai',
            'amount' => 35000,
            'note' => 'Gas elpiji & tissue bar',
        ]);
        Expense::create([
            'date' => now()->toDateString(),
            'category' => 'Gaji / Upah Shift',
            'amount' => 150000,
            'note' => 'Uang makan & transport tim shift pagi',
        ]);

        // 12. Audit Logs (Log contoh)
        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'setup_initial_db',
            'entity' => 'system',
            'entity_id' => 'v3.0',
            'reason' => 'Inisialisasi sistem posa v3.0 sesuai PRD',
        ]);
    }
}
