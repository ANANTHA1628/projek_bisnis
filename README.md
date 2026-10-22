# posa - POS & F&B Inventory System (v3.0)

Sistem operasional Point of Sale (POS) & Manajemen Inventori Bahan Baku terintegrasi penuh untuk coffee shop / resto modern sesuai spesifikasi **PRD posa v3.0**.

Dibangun dengan arsitektur **Laravel 11 / 13 (PHP 8.3+) + SQLite (Mode WAL & Foreign Keys)** untuk backend, serta **React + Vite** untuk frontend dark mode responsif berkinerja tinggi.

---

## 🎯 Ringkasan Penyelarasan dengan PRD posa v3.0

| # | Persyaratan PRD v3.0 | Status Implementasi | Catatan Teknis |
|---|---|:---:|---|
| **1** | **20 Tabel Database Lengkap** | ✅ Selesai | `users`, `categories`, `products`, `product_channel_prices`, `modifiers`, `raw_materials`, `suppliers`, `recipes`, `recipe_items`, `stock_movements`, `restocks`, `restock_items`, `cash_sessions`, `orders`, `order_items`, `order_item_modifiers`, `payments`, `expenses`, `audit_logs`, `settings`. |
| **2** | **Uang Disimpan sebagai Integer Rupiah** | ✅ Selesai | Menghindari galat pembulatan desimal di semua kolom uang & kalkulasi. |
| **3** | **Aturan Pajak PB1 10% & Diskon** | ✅ Selesai | PB1 10% dihitung dari subtotal setelah diskon: `round(subtotal_setelah_diskon * 0.10)`. Mode default eksklusif, opsi pembulatan tunai ke Rp100. |
| **4** | **Harga per Kanal (GoFood/GrabFood)** | ✅ Selesai | Harga override otomatis per kanal (`dine_in`, `takeaway`, `gofood`, `grabfood`) + pencatatan komisi platform ojol 20%. |
| **5** | **Buku Besar Stok (`stock_movements`)** | ✅ Selesai | *Single source of truth* via `StockService`. Setiap perubahan stok (restock, sale, waste, opname, production, void_return) dicatat kekal dan diaudit. |
| **6** | **HPP & Moving Average Restock** | ✅ Selesai | Valuasi stok rata-rata bergerak terhitung otomatis saat restock. Peringatan Food Cost % jika melewati batas 35%. |
| **7** | **Simulator HPP (INV-12)** | ✅ Selesai | Alat uji R&D live untuk mencoba takaran gramasi kopi/susu/sirup tanpa merusak resep aktif. |
| **8** | **Sesi Kasir / Shift (PRD 5.2)** | ✅ Selesai | Alur Buka Kasir (modal awal), Tutup Kasir (hitung fisik, selisih kas, dan blokir jika ada tagihan terbuka / open bills). |
| **9** | **Keamanan & Otorisasi PIN Admin** | ✅ Selesai | Void, refund, dan diskon manual wajib otorisasi PIN Admin (Default: `1234`) dan mencatat alasan ke `audit_logs`. |
| **10** | **Laporan Lengkap (RPT-01 s/d RPT-06)** | ✅ Selesai | Pendapatan, Laba Rugi, Penjualan Item, Pergerakan Stok, Rekap Shift, dan Peringkat Menu Margin Tertinggi. |
| **11** | **Struk Thermal 58mm / 80mm** | ✅ Selesai | Pilihan format cetak thermal 58mm atau 80mm (D6). |
| **12** | **Uji Otomatis PHPUnit** | ✅ 100% Passed | 7 Feature/Unit Tests dengan 42 assertions memvalidasi 10 skenario PB1, HPP, pemotongan stok, void, dan shift closing. |

---

## 🛠️ Keputusan Terbuka (D1 - D8) yang Diterapkan

- **D1 (PB1)**: Eksklusif (ditambahkan di atas harga menu, dapat dikonfigurasi inklusif).
- **D2 (Valuasi HPP)**: Rata-rata bergerak (*Moving Average*), diperbarui otomatis setiap restock.
- **D3 (Pengurangan Stok)**: Saat pesanan berstatus **Lunas** (*paid*).
- **D4 (Biaya Kemasan)**: Masuk ke dalam HPP menu (cup, lid, straw).
- **D5 (Perangkat Kasir)**: 1 perangkat utama (SQLite WAL mode sangat cepat & efisien).
- **D6 (Printer Struk)**: Opsi fleksibel 58mm & 80mm.
- **D7 (Diskon Awal)**: Diskon manual terlindungi dengan PIN Admin & audit log.
- **D8 (Komisi Ojol)**: Global 20% di pengaturan, tersimpan per transaksi untuk akurasi laba rugi.

---

## 💻 Panduan Menjalankan Sistem

### 1. Jalankan Backend Laravel (API, SQLite, Ekspor Excel & PDF)
Buka terminal dan jalankan:
```bash
npm run backend
```
Atau manual dari folder `backend`:
```bash
cd backend
php artisan migrate --seed
php -S 0.0.0.0:8000 -t public
```
*API berjalan di `http://localhost:8000` dengan database SQLite di `backend/database/database.sqlite`.*

### 2. Jalankan Automated Tests (PHPUnit)
Untuk memverifikasi semua aturan bisnis dan skenario uji:
```bash
cd backend
php artisan test
```

### 3. Jalankan Frontend React (Web & Tablet POS)
Buka terminal kedua dan jalankan:
```bash
npm run dev
```
Akses di browser:
- **Komputer/Tablet:** [http://localhost:5173/](http://localhost:5173/)
- **Smartphone (Wi-Fi Lokal):** `http://[IP-Komputer]:5173` (bisa di-*Add to Home Screen*).

---

## 🔑 Kredensial & PIN Akses Default

- **Owner / Admin**: Rina (`owner@posa.local`) — PIN: **`1234`**
- **Kasir / Barista**: Budi (`kasir@posa.local`) — PIN: **`0000`**
