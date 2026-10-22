import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, ShieldAlert, KeyRound } from 'lucide-react';

export default function AdminPinModal() {
  const {
    showAdminPinModal,
    setShowAdminPinModal,
    adminPinConfig,
    setAdminPinConfig,
    settings,
    showToast
  } = usePos();

  const [pin, setPin] = useState('');
  const [reason, setReason] = useState('');
  const [isWaste, setIsWaste] = useState(false);

  if (!showAdminPinModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin !== settings.admin_pin) {
      showToast('PIN Admin salah! (Default: 1234)', 'warning');
      return;
    }

    if (adminPinConfig?.requireReason && !reason.trim()) {
      showToast('Alasan wajib diisi untuk audit log keamanan', 'warning');
      return;
    }

    if (adminPinConfig?.onSuccess) {
      adminPinConfig.onSuccess({ reason, isWaste });
    }

    setShowAdminPinModal(false);
    setPin('');
    setReason('');
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
            <ShieldAlert size={18} />
            <span className="modal-title">{adminPinConfig?.title || 'Otorisasi PIN Admin'}</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setShowAdminPinModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#fbbf24'
              }}
            >
              Aksi sensitif kasir memerlukan PIN Admin & pencatatan audit log keamanan.
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Masukkan 4 Digit PIN Admin (Default: 1234)
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  maxLength={6}
                  className="kasir-search-input"
                  style={{ paddingLeft: '38px', letterSpacing: '4px', fontSize: '18px', textAlign: 'center' }}
                  placeholder="••••"
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>
            </div>

            {adminPinConfig?.requireReason && (
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Alasan Wajib
                </label>
                <textarea
                  className="kasir-search-input"
                  rows={2}
                  placeholder="Contoh: Pelanggan salah pesan / minta batalkan"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
            )}

            {adminPinConfig?.isVoid && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                <input
                  type="checkbox"
                  checked={isWaste}
                  onChange={(e) => setIsWaste(e.target.checked)}
                  style={{ accentColor: '#ef4444' }}
                />
                <span>Tandai sebagai <strong>Waste</strong> (minuman/makanan sudah dibuat lalu dibuang)</span>
              </label>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="tutup-kasir-btn"
              onClick={() => setShowAdminPinModal(false)}
            >
              Batal
            </button>
            <button type="submit" className="buat-laporan-btn">
              Konfirmasi Otorisasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
