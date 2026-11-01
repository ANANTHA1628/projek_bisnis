import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import { HelpCircle, ExternalLink, MessageCircle } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function HelpView() {
  const { showToast } = usePos();

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Help & Documentation" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="posa-admin-card">
          <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
            <HelpCircle size={18} />
            <span>Panduan Cepat Sistem posa</span>
          </div>
          <p className="text-xs text-muted mb-4 leading-relaxed">
            Fitur utama meliputi POS Kiosk Kasir dengan otentikasi PIN 6 digit, manajemen stok bahan baku moving average, resep & HPP otomatis, kalkulasi pajak PB1 10%, dan multi-role staf.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 bg-[#0d111a] rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">Mode Kasir (POS Kiosk):</strong>
              Admin/Owner dapat langsung mengakses POS Kiosk tanpa lock, sedangkan staf kasir dapat login mandiri melalui PIN terdaftar.
            </div>
            <div className="p-3.5 bg-[#0d111a] rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">Manajemen Stok:</strong>
              Setiap transaksi yang lunas otomatis mengurangi stok bahan baku sesuai resep menu.
            </div>
          </div>
        </div>

        <div className="posa-admin-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
              <MessageCircle size={18} />
              <span>Kontak Dukungan</span>
            </div>
            <p className="text-xs text-muted mb-4 leading-relaxed">
              Butuh bantuan teknis atau konfigurasi printer thermal? Tim posa siap membantu Anda.
            </p>
          </div>

          <button
            type="button"
            className="posa-btn-primary w-full justify-center py-2.5 mt-4"
            onClick={() => showToast('Membuka WhatsApp Bantuan...')}
          >
            <span>Hubungi via WhatsApp</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
