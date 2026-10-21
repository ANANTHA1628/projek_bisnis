# posa - Sistem Kasir (POS) & Manajemen Bisnis Kafe / Resto

Projek sistem Point of Sale (POS), Manajemen Inventori Stok Bahan Baku, Dashboard Analitik Bisnis, dan Laporan Keuangan berbasis web modern dengan tampilan dark mode elegan sesuai referensi desain.

---

## 🚀 Fitur Utama

### 1. ☕ Kasir (POS)
- **Katalog Menu Interaktif**: Filter kategori (*Semua*, *Makanan*, *Non-Kopi*, *Kopi*) & pencarian menu instan.
- **Badge Indikator Keranjang**: Menampilkan jumlah item yang sudah masuk keranjang di pojok kartu produk.
- **Panel Pesanan Saat Ini**:
  - Tipe pesanan: *Makan di sini*, *Bawa pulang*, *GoFood*, *GrabFood*.
  - Pengaturan jumlah (+ / -) dan tombol **"Sesuaikan"** untuk preferensi es, gula, extra shot espresso, dan catatan khusus.
  - Dropdown **Pilih Meja** (Meja 01, Meja 02, Meja 03, Meja 04, VIP 1, Outdoor 01) & input **No. HP** pelanggan.
  - Perhitungan otomatis: Subtotal, PB1 (10%), dan Total tagihan.
  - Pilihan metode bayar: *Tunai*, *QRIS*, *Kartu debit*, *Bayar nanti*.
  - Tombol aksi bayar cepat dengan kalkulator kembalian uang tunai.
- **Tagihan Terbuka (Open Bills)**: Simpan pesanan meja yang belum selesai dan buka kembali kapan saja.
- **Tutup Kasir (Shift Closing)**: Rekapitulasi modal awal, penjualan tunai, non-tunai, dan cetak laporan tutup kasir.
- **Struk Thermal Pembayaran**: Cetak struk printer thermal langsung ke printer atau PDF.

### 2. 📊 Dashboard Admin (Dasbor)
- **Kartu Metrik KPI Bisnis**:
  - Penjualan Hari Ini: `Rp 676.500` (16 pesanan · laba Rp 409.220)
  - Total Penjualan Bulan Ini: `Rp 676.500`
  - Barang Stok Rendah: `2` (Gula aren cair, Roti tawar)
  - Habis dalam 14 Hari: `3` (Roti tawar: 3 hari)
- **Tabel Kecepatan Pemakaian Stok (*Velocity Table*)**:
  - Kolom: Item, Stok, Terpakai per hari, Sisa hari dengan indikator warna urgensi (merah, kuning/oranye).
- **Peringatan Stok Rendah**: Indikator rasio sisa stok terhadap batas minimum + tombol aksi cepat *Buka Restock*.
- **Laporan Harian ke WhatsApp**: Format pesan otomatis siap kirim atau salin ke WhatsApp manajemen.

### 3. 📦 Pengaturan Bahan Baku (Stok)
- **Tabel Bahan Baku Lengkap**:
  - Biji kopi arabika, Bubuk cokelat, Bubuk matcha, Croissant beku, Cup plastik 16oz, Es batu, Gula aren cair, Roti tawar, Susu segar, Teh melati.
  - Satuan terkalibrasi: gram, ml, pcs.
  - Harga rata-rata & kalkulasi otomatis total nilai aset stok (`Nilai stok: Rp 1.779.600`).
- **Filter Cepat**: *Semua (10)* dan *Hampir habis (2)*.
- **Manajemen CRUD**: Tambah Bahan Baku Baru, Edit data bahan, dan Hapus bahan.
- **Integrasi Resep**: Transaksi penjualan di Kasir otomatis memotong stok bahan baku terkait!

### 4. 📈 Laporan Pendapatan (Laporan)
- **Filter Periode Laporan**:
  - Pilihan tanggal kustom (*Dari* & *Sampai*) + Tombol *Buat Laporan*.
  - Preset cepat: *Hari Ini*, *Kemarin*, *Minggu Ini*, *Bulan Ini*, *Bulan lalu*.
- **Ekspor Data Real**:
  - *Excel (Laporan lengkap)*
  - *CSV (Satu baris per transaksi)*
  - *CSV (Satu baris per item terjual)*
- **Ringkasan Pendapatan**:
  - Total diterima: `Rp 1.421.200`
  - Penjualan bersih: `Rp 1.292.000`
  - Laba kotor: `Rp 871.850` (Margin 67%)
  - Transaksi: `36` pesanan
- **Visualisasi Grafik**:
  - **Tren Pendapatan**: Grafik batang interaktif per hari/jam tersibuk.
  - **Metode Pembayaran**: Distribusi pembayaran (*Tunai 45%*, *QRIS 40%*, *Kartu Debit 10%*, *Bayar Nanti 5%*).

---

## 💻 Cara Menjalankan Aplikasi

1. **Pastikan Node.js terinstall**:
   ```bash
   node -v
   npm -v
   ```

2. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

3. **Buka di Browser**:
   Buka browser Anda di:
   [http://localhost:5173/](http://localhost:5173/)

4. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

---

## 🎨 Palet Warna & Desain
- Tema: Dark Mode Minimalis & Modern (Sesuai referensi gambar UI)
- Font: *Plus Jakarta Sans* & *JetBrains Mono*
- Navigasi: Navigasi Pill Bar di bagian atas (`Kasir`, `Dasbor`, `Stok`, `Laporan`) untuk berpindah antar halaman secara mulus dan responsif.
