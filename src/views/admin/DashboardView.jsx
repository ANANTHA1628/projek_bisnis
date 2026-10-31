import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import { usePos } from '../../context/PosContext';
import {
  TrendingUp,
  ShoppingCart,
  Boxes,
  Clock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function DashboardView() {
  const { rawMaterials, transactions, setAdminView, setIsKioskMode, setIsKioskLocked } = usePos();

  const lowStockCount = rawMaterials.filter((m) => m.stock <= m.minStock).length;
  const totalCollected = transactions
    .filter((t) => t.status !== 'voided')
    .reduce((acc, t) => acc + (t.total || 0), 0);

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Dashboard" />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="posa-metric-card">
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted">Penjualan Hari Ini</span>
            <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            Rp {totalCollected.toLocaleString('id-ID')}
          </div>
          <span className="text-xs text-emerald-400 mt-1 inline-block">Realtime shift aktif</span>
        </div>

        <div className="posa-metric-card">
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted">Total Transaksi</span>
            <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <ShoppingCart size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {transactions.length}
          </div>
          <span className="text-xs text-slate-400 mt-1 inline-block">Order tercatat</span>
        </div>

        <div className="posa-metric-card">
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted">Bahan Baku Habis / Kritis</span>
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">
            {lowStockCount}
          </div>
          <span className="text-xs text-slate-400 mt-1 inline-block">Perlu restock segera</span>
        </div>

        <div className="posa-metric-card">
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted">Waktu Operasional</span>
            <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            08:00 - 22:00
          </div>
          <span className="text-xs text-emerald-400 mt-1 inline-block">Status: Outlet Buka</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="posa-admin-card cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => setAdminView('raw-materials')}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold text-base mb-1">Manajemen Stok & Bahan Baku</h3>
              <p className="text-xs text-muted">Kelola bahan baku, takaran resep, restock, dan catat waste.</p>
            </div>
            <ArrowRight size={20} className="text-blue-400" />
          </div>
        </div>

        <div
          className="posa-admin-card cursor-pointer hover:border-blue-500/50 transition-colors bg-gradient-to-r from-blue-950/30 to-[#121622]"
          onClick={() => {
            setIsKioskMode(true);
            setIsKioskLocked(true);
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold text-base mb-1">Buka POS Kiosk Kasir</h3>
              <p className="text-xs text-blue-300">Masuk ke mode kasir untuk input pesanan dan cetak struk.</p>
            </div>
            <ArrowRight size={20} className="text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
