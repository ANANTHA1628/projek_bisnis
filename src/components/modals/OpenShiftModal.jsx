import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, KeyRound, Banknote } from 'lucide-react';

export default function OpenShiftModal() {
  const { showOpenShiftModal, setShowOpenShiftModal, openShift } = usePos();
  const [openingCash, setOpeningCash] = useState(500000);
  const [notes, setNotes] = useState('Shift Pagi - Siang');

  if (!showOpenShiftModal) return null;

  const quickCashOptions = [200000, 300000, 500000, 1000000];

  const handleSubmit = (e) => {
    e.preventDefault();
    openShift(openingCash, notes);
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Banknote size={18} color="#10b981" />
            <span className="modal-title">Buka Sesi Kasir (Start Shift)</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setShowOpenShiftModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div
              style={{
                padding: '12px',
                backgroundColor: '#162033',
                borderRadius: '8px',
                fontSize: '12.5px',
                color: 'var(--text-secondary)'
              }}
            >
              Kasir aktif: <strong>Rina (Owner)</strong>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Masukkan modal awal uang tunai yang berada di dalam laci kasir (Cash Drawer).
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Modal Awal Kasir (Kas Awal)
              </label>
              <input
                type="number"
                className="kasir-search-input"
                style={{ fontSize: '16px', fontWeight: 700 }}
                value={openingCash}
                onChange={(e) => setOpeningCash(Number(e.target.value))}
                required
                min={0}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {quickCashOptions.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className="preset-pill"
                  style={{ fontSize: '11.5px', padding: '5px 10px' }}
                  onClick={() => setOpeningCash(amt)}
                >
                  Rp {amt.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Catatan Shift
              </label>
              <input
                type="text"
                className="kasir-search-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Shift Pagi / Shift Sore"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="tutup-kasir-btn"
              onClick={() => setShowOpenShiftModal(false)}
            >
              Batal
            </button>
            <button type="submit" className="buat-laporan-btn">
              Buka Sesi Kasir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
