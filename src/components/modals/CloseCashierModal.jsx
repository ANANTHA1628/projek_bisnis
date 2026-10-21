import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, Lock, CheckCircle2, Printer } from 'lucide-react';

export default function CloseCashierModal() {
  const {
    showCloseCashierModal,
    setShowCloseCashierModal,
    showToast
  } = usePos();

  const [closingNotes, setClosingNotes] = useState('');

  if (!showCloseCashierModal) return null;

  const handleCloseShift = () => {
    showToast('Shift berhasil ditutup. Laporan rekap kasir telah dicetak.');
    setShowCloseCashierModal(false);
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color="#f59e0b" />
            <span className="modal-title">Tutup Kasir (End of Shift)</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setShowCloseCashierModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#162033',
              borderRadius: '8px',
              fontSize: '12.5px',
              color: 'var(--text-secondary)'
            }}
          >
            <div>Kasir: <strong>Rina (Owner)</strong></div>
            <div>Shift: Pagi - Siang (07:30 - Sekarang)</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="summary-row">
              <span>Modal Awal Kas</span>
              <span>Rp 500.000</span>
            </div>
            <div className="summary-row">
              <span>Total Penerimaan Tunai</span>
              <span>Rp 676.500</span>
            </div>
            <div className="summary-row">
              <span>Total Non-Tunai (QRIS & Kartu)</span>
              <span>Rp 744.700</span>
            </div>
            <div className="receipt-divider" />
            <div className="summary-row" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              <span>Total Uang Kas Fisik</span>
              <span style={{ color: '#60a5fa' }}>Rp 1.176.500</span>
            </div>
            <div className="summary-row" style={{ color: '#10b981', fontWeight: 600 }}>
              <span>Status Rekap</span>
              <span>Cocok / Seimbang (0 Selisih)</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Catatan Penutupan Shift
            </label>
            <textarea
              className="kasir-search-input"
              rows={2}
              placeholder="Catatan kasir bila ada (opsional)..."
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="tutup-kasir-btn"
            onClick={() => setShowCloseCashierModal(false)}
          >
            Batal
          </button>
          <button className="buat-laporan-btn" onClick={handleCloseShift}>
            <Printer size={15} style={{ marginRight: '6px' }} />
            Tutup Shift & Cetak
          </button>
        </div>
      </div>
    </div>
  );
}
