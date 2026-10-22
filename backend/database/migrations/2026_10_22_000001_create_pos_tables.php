<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * PRD posa v3.0 - Section 7 Data Model
     */
    public function up(): void
    {
        // 1. Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Products (Master Menu)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('sku')->nullable()->unique();
            $table->integer('base_price')->default(0); // integer rupiah
            $table->boolean('is_active')->default(true);
            $table->string('image')->nullable();
            $table->string('icon')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 3. Product Channel Prices (Override Harga Ojol GoFood/GrabFood)
        Schema::create('product_channel_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('channel', 30); // 'dine_in', 'takeaway', 'gofood', 'grabfood'
            $table->integer('price')->default(0); // integer rupiah
            $table->timestamps();

            $table->unique(['product_id', 'channel']);
        });

        // 4. Modifiers (Extra shot, susu oat, dll.)
        Schema::create('modifiers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('price_delta')->default(0); // Tambahan harga jual
            $table->integer('cost_delta')->default(0); // Tambahan HPP
            $table->string('group', 50)->default('addon'); // addon, sugar, ice, etc.
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 5. Raw Materials (Bahan Baku)
        Schema::create('raw_materials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('base_unit', 20); // 'g', 'ml', 'pcs'
            $table->decimal('stock_qty', 14, 2)->default(0); // boleh negatif jika anomali
            $table->decimal('min_stock', 14, 2)->default(0);
            $table->integer('avg_cost_per_unit')->default(0); // Moving average cost per unit dasar (rupiah)
            $table->decimal('daily_usage', 10, 2)->default(0);
            $table->boolean('is_semi_finished')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        // 6. Suppliers (Pemasok)
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 7. Recipes (Resep per menu atau semi-finished)
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable()->constrained('products')->cascadeOnDelete();
            $table->foreignId('semi_finished_material_id')->nullable()->constrained('raw_materials')->nullOnDelete();
            $table->integer('version')->default(1);
            $table->decimal('yield_qty', 10, 2)->default(1);
            $table->integer('packaging_cost')->default(0); // cup, tutup, sedotan
            $table->boolean('is_current')->default(true);
            $table->timestamps();
        });

        // 8. Recipe Items (Daftar bahan + takaran per porsi)
        Schema::create('recipe_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained('recipes')->cascadeOnDelete();
            $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();
            $table->decimal('qty', 12, 2)->default(0); // Takaran per porsi dalam satuan dasar
            $table->timestamps();
        });

        // 9. Stock Movements (Buku Besar Stok - Single Source of Truth)
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();
            $table->string('type', 30); // restock, sale, waste, opname, production, void_return
            $table->decimal('qty', 12, 2); // Perubahan jumlah (+ / -)
            $table->integer('unit_cost')->default(0); // HPP per satuan saat mutasi
            $table->string('reference_type', 50)->nullable(); // Order, Restock, Opname
            $table->string('reference_id', 50)->nullable();
            $table->text('note')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 10. Restocks (Header Pembelian Stok)
        Schema::create('restocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->string('invoice_no')->nullable();
            $table->date('date');
            $table->integer('total')->default(0); // Total biaya pembelian (rupiah)
            $table->timestamps();
        });

        // 11. Restock Items (Detail Pembelian Stok)
        Schema::create('restock_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restock_id')->constrained('restocks')->cascadeOnDelete();
            $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();
            $table->decimal('qty', 12, 2);
            $table->integer('unit_price'); // Harga beli per satuan dasar
            $table->timestamps();
        });

        // 12. Cash Sessions (Sesi Kasir / Shift)
        Schema::create('cash_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->integer('opening_cash')->default(0); // Modal awal kas
            $table->integer('expected_cash')->default(0); // Kas awal + tunai masuk - kas keluar
            $table->integer('actual_cash')->nullable(); // Uang fisik saat tutup
            $table->integer('difference')->default(0); // Selisih kas
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 13. Customers (Pelanggan)
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->timestamps();
        });

        // 14. Orders (Pesanan & Transaksi)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_no', 50)->unique();
            $table->foreignId('cash_session_id')->nullable()->constrained('cash_sessions')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->string('channel', 30)->default('dine_in'); // dine_in, takeaway, gofood, grabfood
            $table->string('table_no', 30)->nullable();
            $table->string('status', 30)->default('draft'); // draft, open, paid, void, refunded
            $table->integer('subtotal')->default(0);
            $table->integer('discount')->default(0);
            $table->integer('pb1')->default(0); // PB1 10%
            $table->integer('rounding')->default(0); // Pembulatan tunai
            $table->integer('total')->default(0);
            $table->integer('commission_percent')->default(0); // Potongan platform ojol
            $table->timestamp('paid_at')->nullable();
            $table->text('void_reason')->nullable();
            $table->foreignId('void_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 15. Order Items (Snapshot Wajib)
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('name_snapshot');
            $table->integer('qty')->default(1);
            $table->integer('unit_price')->default(0); // Harga saat transaksi
            $table->integer('unit_cost_snapshot')->default(0); // HPP saat transaksi
            $table->foreignId('recipe_id')->nullable()->constrained('recipes')->nullOnDelete();
            $table->string('notes')->nullable();
            $table->timestamps();
        });

        // 16. Order Item Modifiers
        Schema::create('order_item_modifiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->constrained('order_items')->cascadeOnDelete();
            $table->foreignId('modifier_id')->nullable()->constrained('modifiers')->nullOnDelete();
            $table->string('name_snapshot');
            $table->integer('price')->default(0);
            $table->integer('cost_snapshot')->default(0);
            $table->timestamps();
        });

        // 17. Payments (Mendukung Split Payment)
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('method', 30)->default('tunai'); // tunai, qris, debit, bayar_nanti
            $table->integer('amount')->default(0);
            $table->string('reference')->nullable();
            $table->timestamps();
        });

        // 18. Expenses (Biaya Operasional untuk Laba Rugi)
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('category', 50); // sewa, listrik, gaji, dll.
            $table->integer('amount')->default(0);
            $table->text('note')->nullable();
            $table->timestamps();
        });

        // 19. Audit Logs (Void, refund, ubah harga, diskon manual)
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 50); // void, refund, discount, update_recipe, etc.
            $table->string('entity', 50);
            $table->string('entity_id', 50)->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->text('reason')->nullable();
            $table->timestamps();
        });

        // 20. Settings (Pajak, tema, struk, komisi)
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_item_modifiers');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('cash_sessions');
        Schema::dropIfExists('restock_items');
        Schema::dropIfExists('restocks');
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('recipe_items');
        Schema::dropIfExists('recipes');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('raw_materials');
        Schema::dropIfExists('modifiers');
        Schema::dropIfExists('product_channel_prices');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
