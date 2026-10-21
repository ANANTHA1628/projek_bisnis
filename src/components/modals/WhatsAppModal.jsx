import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, Send, Copy, Check } from 'lucide-react';

export default function WhatsAppModal() {
  const {
    showWhatsAppModal,
    setShowWhatsAppModal,
    showToast
  } = usePos();

  const [copied, setCopied] = useState(false);

  if (!showWhatsAppModal) return null;

  const reportText = `📊 *LAPORAN HARIAN POSA COFFEE*
📅 Tanggal: 01 Okt 2026
🏪 Outlet: posa Coffee Central
👤 Kasir: Rina (Owner)

💰 *Ringkasan Keuangan:*
• Total Diterima: Rp 1.421.200
• Penjualan Bersih: Rp 1.292.000
• Laba Kotor: Rp 871.850 (Margin 67%)
• Biaya Bahan: Rp 420.150
• Total Transaksi: 36 pesanan (Rata-rata Rp 39.478)

💳 *Metode Pembayaran:*
• Tunai: 45% (Rp 639.540)
• QRIS: 40% (Rp 568.480)
• Kartu Debit: 10% (Rp 142.120)
• Bayar Nanti: 5% (Rp 71.060)

⚠️ *Peringatan Stok Bahan Baku Rendah:*
• Roti tawar: sisa 6 pcs (Perkiraan habis 3 hari)
• Gula aren cair: sisa 420 ml (Perkiraan habis 9 hari)
• Susu segar: sisa 7.400 ml (Perkiraan habis 5 hari)

_Dihasilkan otomatis oleh posa Cloud POS_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    showToast('Teks laporan berhasil disalin ke clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWA = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setShowWhatsAppModal(false);
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} color="#10b981" />
            <span className="modal-title">Laporan Harian ke WhatsApp</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setShowWhatsAppModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            Berikut adalah format pesan ringkasan harian yang siap dikirim ke grup WhatsApp
            manajemen atau owner:
          </p>

          <pre
            style={{
              backgroundColor: '#0a0e17',
              border: '1px solid var(--border-card)',
              padding: '14px',
              borderRadius: '8px',
              color: '#a7f3d0',
              fontFamily: 'var(--font-mono)',
              fontSize: '11.5px',
              whiteSpace: 'pre-wrap',
              maxHeight: '260px',
              overflowY: 'auto',
              lineHeight: 1.5
            }}
          >
            {reportText}
          </pre>
        </div>

        <div className="modal-footer">
          <button className="tutup-kasir-btn" onClick={handleCopy}>
            {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
            <span style={{ marginLeft: '6px' }}>{copied ? 'Tersalin' : 'Salin Teks'}</span>
          </button>

          <button
            className="wa-submit-btn green"
            style={{ width: 'auto', padding: '10px 18px' }}
            onClick={handleOpenWA}
          >
            <Send size={15} />
            <span>Kirim via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
