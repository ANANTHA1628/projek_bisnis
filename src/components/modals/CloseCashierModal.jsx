import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, Lock, Printer, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CloseCashierModal() {
  const {
    showCloseCashierModal,
    setShowCloseCashierModal,
    currentShift,
    closeShift,
    openBills,
    transactions,
    showToast
  } = usePos();

  const [actualCash, setActualCash] = useState(currentShift.expectedCash || 500000);
  const [closingNotes, setClosingNotes] = useState('');

  if (!showCloseCashierModal) return null;

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  // Hitung penerimaan tunai shift saat ini
  const cashSales = transactions
    .filter((t) => t.status === 'paid' && t.method === 'TUNAI')
    .reduce((acc, t) => acc + t.total, 0);

  // Hitung penerimaan non-tunai
  const nonCashSales = transactions
    .filter((t) => t.status === 'paid' && t.method !== 'TUNAI')
    .reduce((acc, t) => acc + t.total, 0);

  const expectedCash = currentShift.openingCash + cashSales;
  const difference = Number(actualCash) - expectedCash;

  const handleClose = (e) => {
    e.preventDefault();
    if (openBills.length > 0) {
      showToast(
        `Pembatas PRD 5.2: Terdapat ${openBills.length} Tagihan Terbuka! Selesaikan atau batalkan sebelum tutup kasir.`,
        'warning'
      );
      return;
    }

    const ok = closeShift(actualCash, closingNotes);
    if (ok) {
      // Print closing summary
      window.print();
    }
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color="#f59e0b" />
            <span className="modal-title">Tutup Kasir (Shift Closing)</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setShowCloseCashierModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleClose}>
          <div className="modal-body">
            {/* Warning if open bills exist */}
            {openBills.length > 0 && (
              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#f87171',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertTriangle size={18} />
                <span>
                  <strong>Pembatas Sistem:</strong> Terdapat <strong>{openBills.length} tagihan terbuka</strong>! Selesaikan atau batalkan pesanan meja sebelum kasir dapat ditutup.
                </span>
              </div>
            )}

            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#162033',
                borderRadius: '8px',
                fontSize: '12.5px',
                color: 'var(--text-secondary)'
              }}
            >
              <div>Kasir: <strong>{currentShift.cashierName}</strong></div>
              <div>Waktu Buka: {currentShift.openedAt}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="summary-row">
                <span>Modal Awal Kas</span>
                <span>{formatRupiah(currentShift.openingCash)}</span>
              </div>
              <div className="summary-row">
                <span>Total Penjualan Tunai</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>+{formatRupiah(cashSales)}</span>
              </div>
              <div className="summary-row">
                <span>Total Non-Tunai (QRIS & Kartu)</span>
                <span>{formatRupiah(nonCashSales)}</span>
              </div>
              <div className="receipt-divider" />
              <div className="summary-row" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>Ekspektasi Uang Kas Sistem</span>
                <span style={{ color: '#60a5fa' }}>{formatRupiah(expectedCash)}</span>
              </div>
            </div>

            {/* Input uang fisik */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Hitungan Fisik Uang Kasir (Uang di Laci)
              </label>
              <input
                type="number"
                className="kasir-search-input"
                style={{ fontSize: '16px', fontWeight: 700 }}
                value={actualCash}
                onChange={(e) => setActualCash(Number(e.target.value))}
                required
                min={0}
              />
            </div>

            {/* Selisih */}
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: '#0e1624',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Selisih Kas:
              </span>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: difference === 0 ? '#10b981' : difference > 0 ? '#60a5fa' : '#ef4444'
                }}
              >
                {difference === 0 ? 'Cocok / Seimbang (Rp 0)' : (difference > 0 ? `Surplus (+${formatRupiah(difference)})` : `Kurang (${formatRupiah(difference)})`)}
              </span>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Catatan Penutupan Shift
              </label>
              <textarea
                className="kasir-search-input"
                rows={2}
                placeholder="Catatan kasir bila ada selisih atau serah terima..."
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="tutup-kasir-btn"
              onClick={() => setShowCloseCashierModal(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="buat-laporan-btn"
              disabled={openBills.length > 0}
              style={{ opacity: openBills.length > 0 ? 0.5 : 1 }}
            >
              <Printer size={15} style={{ marginRight: '6px' }} />
              Tutup Kasir & Cetak Rekap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
