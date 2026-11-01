// Data awal sistem posa v3.0 (Kosongan Bersih - Siap Input Baru)

export const INITIAL_SETTINGS = {
  tax_pb1_rate: 10,
  tax_mode: 'exclusive', // 'exclusive' | 'inclusive'
  ojol_commission_percent: 20, // 20% komisi platform ojol
  max_food_cost_threshold: 35, // threshold peringatan food cost 35%
  receipt_printer_size: '58mm',
  admin_pin: '1234',
  cashier_pin: '0000',
  store_name: 'Posa Store',
  store_tagline: 'Modern Cafe & POS System',
  store_address: 'Alamat Toko Anda',
  store_phone: '081234567890',
  store_email: 'store@posa.local',
  business_code: 'POSA-2026',
  store_wifi: 'Posa_Guest / posa2026',
  footer_receipt_message: 'Terima Kasih atas Kunjungan Anda!',
  auto_print_receipt: true,
  round_cash_hundred: true,
  queue_numbers: false,
  order_type_dinein: true,
  order_type_takeaway: true,
  delivery_gofood: false,
  delivery_grabfood: false,
  delivery_shopeefood: false,
  supervisor_approval: true
};

export const INITIAL_MODIFIERS = [];

// Produk / Menu Kosongan (Siap Tambah Baru)
export const INITIAL_PRODUCTS = [];

// Bahan Baku Kosongan (Siap Tambah Baru)
export const INITIAL_RAW_MATERIALS = [];

// Keranjang Kasir Kosongan
export const INITIAL_CART = [];

// Open Bills Kosongan
export const INITIAL_OPEN_BILLS = [];

// Transaksi Kosongan (Grafik & Laporan Nol Bersih)
export const INITIAL_TRANSACTIONS = [];

// Sesi Shift Awal (Kasir Status Tutup - Wajib Buka Kasir Terlebih Dahulu)
export const INITIAL_SHIFT = {
  isOpen: false,
  openedAt: null,
  closedAt: null,
  cashierName: 'Ahmad Rafi (Owner)',
  openingCash: 0,
  expectedCash: 0,
  actualCash: null,
  difference: 0
};

// Pengeluaran Operasional Kosongan
export const INITIAL_EXPENSES = [];

// Riwayat Mutasi Stok Kosongan
export const INITIAL_STOCK_MOVEMENTS = [];

// Akun Staf Utama (Owner) untuk Login
export const INITIAL_STAFF = [
  {
    id: 'staff-owner',
    name: 'Ahmad Rafi Hamdi',
    email: 'hamdirafi310@gmail.com',
    role: 'Owner',
    pin: '1234',
    phone: '6283871983300',
    status: 'Aktif',
    active: 'Yes',
    permissions: 'Manage All',
    shift: 'Semua Shift',
    joinedDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  }
];

// Log Aktivitas Kosongan
export const INITIAL_STAFF_ACTIVITY = [];

// Data Pelanggan Kosongan
export const INITIAL_CUSTOMERS = [];
