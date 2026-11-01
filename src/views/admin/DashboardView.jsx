import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import { usePos } from '../../context/PosContext';
import {
  TrendingUp,
  ShoppingCart,
  Boxes,
  Clock,
  AlertTriangle,
  ArrowRight,
  Store,
  UtensilsCrossed,
  BarChart3,
  Receipt,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function DashboardView() {
  const {
    rawMaterials,
    transactions,
    products,
    setAdminView,
    setIsKioskMode,
    setIsKioskLocked,
    currentShift
  } = usePos();

  const lowStockCount = rawMaterials.filter((m) => m.stock <= m.minStock).length;
  const activeTransactions = transactions.filter((t) => t.status !== 'voided');
  const totalCollected = activeTransactions.reduce((acc, t) => acc + (t.total || 0), 0);

  // Recent 5 transactions
  const recentTransactions = [...activeTransactions].reverse().slice(0, 5);

  const formatRupiah = (num) => {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  };

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Dashboard">
        <div className="hidden sm:flex items-center gap-2 bg-[var(--bg-card-alt)] px-3 py-1.5 rounded-full border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
          <span className={`w-2 h-2 rounded-full ${currentShift.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span>{currentShift.isOpen ? 'Shift Kasir Aktif' : 'Kasir Tutup'}</span>
        </div>
      </AdminHeader>

      {/* 4 Sleek Modern Metric Cards (Non-Blue) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Penjualan Hari Ini */}
        <div className="posa-metric-card group hover:border-emerald-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Penjualan Hari Ini
              </span>
              <div className="text-2xl font-extrabold text-white mt-1.5 tracking-tight">
                {formatRupiah(totalCollected)}
              </div>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border-subtle)] text-xs text-emerald-400 font-medium">
            <Sparkles size={13} />
            <span>Realtime update shift</span>
          </div>
        </div>

        {/* Metric 2: Total Transaksi */}
        <div className="posa-metric-card group hover:border-violet-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Total Transaksi
              </span>
              <div className="text-2xl font-extrabold text-white mt-1.5 tracking-tight">
                {activeTransactions.length}
              </div>
            </div>
            <div className="p-2.5 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20 group-hover:scale-105 transition-transform">
              <ShoppingCart size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border-subtle)] text-xs text-slate-400">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>Order tercatat sukses</span>
          </div>
        </div>

        {/* Metric 3: Bahan Baku Kritis */}
        <div className="posa-metric-card group hover:border-amber-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Bahan Kritis / Habis
              </span>
              <div className={`text-2xl font-extrabold mt-1.5 tracking-tight ${lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {lowStockCount} <span className="text-xs font-normal text-slate-400">item</span>
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border group-hover:scale-105 transition-transform ${lowStockCount > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border-subtle)] text-xs text-slate-400">
            {lowStockCount > 0 ? (
              <span className="text-amber-400 font-medium">Perlu restock segera</span>
            ) : (
              <span className="text-emerald-400 font-medium">Seluruh stok aman</span>
            )}
          </div>
        </div>

        {/* Metric 4: Jam Operasional */}
        <div className="posa-metric-card group hover:border-teal-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Jam Operasional
              </span>
              <div className="text-2xl font-extrabold text-white mt-1.5 tracking-tight">
                08:00 - 22:00
              </div>
            </div>
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 group-hover:scale-105 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border-subtle)] text-xs text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Outlet Buka & Siap Melayani</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards Grid (Futuristic & Non-Blue) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Main Card: Buka POS Kiosk */}
        <div
          className="posa-admin-card cursor-pointer hover:border-emerald-500/50 transition-all group relative overflow-hidden bg-gradient-to-br from-[#0c2018] via-[var(--bg-card)] to-[var(--bg-card-alt)] md:col-span-2 lg:col-span-1"
          onClick={() => {
            setIsKioskMode(true);
            setIsKioskLocked(false);
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Store size={22} />
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${currentShift.isOpen ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
              {currentShift.isOpen ? 'Kasir Aktif' : 'Kasir Tutup'}
            </span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors">
              Buka POS Kiosk Kasir
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Masuk ke mode kasir kasir sentuh untuk input pesanan, manajemen meja, dan cetak struk thermal.
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-emerald-400 gap-1.5 group-hover:translate-x-1 transition-transform">
            <span>Buka Layar Kasir</span>
            <ArrowRight size={15} />
          </div>
        </div>

        {/* Card 2: Manajemen Stok */}
        <div
          className="posa-admin-card cursor-pointer hover:border-emerald-500/40 transition-all group"
          onClick={() => setAdminView('raw-materials')}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Boxes size={20} />
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono">{rawMaterials.length} bahan</span>
          </div>
          <h3 className="text-white font-bold text-base mb-1 group-hover:text-emerald-400 transition-colors">
            Stok & Bahan Baku
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
            Kelola stok mentah, hitung HPP resep otomatis, catat restock, dan opname waste.
          </p>
          <div className="flex items-center text-xs font-semibold text-[var(--text-secondary)] group-hover:text-emerald-400 gap-1 transition-colors">
            <span>Kelola Bahan</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Card 3: Menu & Resep */}
        <div
          className="posa-admin-card cursor-pointer hover:border-emerald-500/40 transition-all group"
          onClick={() => setAdminView('menus')}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20">
              <UtensilsCrossed size={20} />
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono">{products.length} menu</span>
          </div>
          <h3 className="text-white font-bold text-base mb-1 group-hover:text-emerald-400 transition-colors">
            Katalog Menu & Resep
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
            Atur harga jual, varian modifier, komposisi bahan baku, dan margin keuntungan.
          </p>
          <div className="flex items-center text-xs font-semibold text-[var(--text-secondary)] group-hover:text-emerald-400 gap-1 transition-colors">
            <span>Buka Katalog</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Recent Orders Overview (Live Transaction Stream) */}
      <div className="posa-admin-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Receipt size={17} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Transaksi Terkini (Hari Ini)
            </h3>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
            onClick={() => setAdminView('orders-void')}
          >
            <span>Lihat Semua Pesanan</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-8 text-center text-[var(--text-muted)] text-xs">
            Belum ada transaksi hari ini. Buka POS Kiosk Kasir untuk memulai penjualan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[var(--text-muted)] border-b border-[var(--border-subtle)] uppercase tracking-wider font-semibold">
                  <th className="pb-2.5">Invoice</th>
                  <th className="pb-2.5">Waktu</th>
                  <th className="pb-2.5">Kanal</th>
                  <th className="pb-2.5">Metode</th>
                  <th className="pb-2.5 text-right">Total</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-mono font-medium text-white">{tx.invoice || `#${tx.id}`}</td>
                    <td className="py-3 text-[var(--text-secondary)]">{tx.time || tx.date}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--bg-pill)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                        {tx.orderType || 'Makan di sini'}
                      </span>
                    </td>
                    <td className="py-3 text-[var(--text-secondary)] font-medium uppercase text-[11px]">
                      {tx.paymentMethod || 'TUNAI'}
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-400">
                      {formatRupiah(tx.total)}
                    </td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        SUKSES
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
