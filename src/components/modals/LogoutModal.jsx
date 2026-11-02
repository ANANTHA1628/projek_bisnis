import React from 'react';
import { usePos } from '../../context/PosContext';
import { LogOut, KeyRound, ShieldAlert } from 'lucide-react';

export default function LogoutModal() {
  const {
    showLogoutModal,
    setShowLogoutModal,
    logoutTarget,
    currentUser,
    lockKioskToPin,
    logoutMasterAccount,
    recordStaffActivity,
    playSound
  } = usePos();

  if (!showLogoutModal) return null;

  // 1. Kunci Sesi Kasir / Kembali ke Keypad PIN (Untuk pergantian shift kasir/karyawan)
  const handleLockShift = () => {
    playSound('click');
    setShowLogoutModal(false);

    recordStaffActivity(
      currentUser?.name || 'Staff',
      currentUser?.role || 'Cashier',
      'SIGNED OUT',
      'Selesai shift & mengunci kasir kembali ke Layar PIN'
    );

    lockKioskToPin();
  };

  // 2. Logout Total Master Account (Keluar dari perangkat ke form login email & password master)
  const handleSignOutMaster = () => {
    playSound('click');
    setShowLogoutModal(false);

    recordStaffActivity(
      currentUser?.name || 'Owner',
      currentUser?.role || 'Owner',
      'SIGNED OUT',
      'Keluar dari akun Master Pemilik (Owner Logout)'
    );

    logoutMasterAccount();
  };

  const handleCancel = () => {
    playSound('click');
    setShowLogoutModal(false);
  };

  const isOwner = currentUser?.role === 'Owner' || currentUser?.role === 'Developer' || logoutTarget === 'admin';

  return (
    <div className="posa-modal-overlay">
      <div className="posa-logout-dialog-card" style={{ maxWidth: '420px', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}
          >
            <LogOut size={24} />
          </div>
          <h2 className="posa-logout-title" style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px' }}>
            Konfirmasi Keluar (Logout)
          </h2>
          <p className="posa-logout-subtitle" style={{ fontSize: '12.5px', color: 'var(--text-secondary, #94a3b8)', margin: 0 }}>
            {currentUser ? `Sesi aktif: ${currentUser.name} (${currentUser.role})` : 'Pilih metode keluar sesi'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {/* Pilihan 1: Kunci Shift (Kembali ke Keypad PIN Karyawan) */}
          <button
            type="button"
            onClick={handleLockShift}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              color: '#10b981',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <KeyRound size={22} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                Kunci Kasir / Ganti Shift (Kembali ke PIN)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary, #94a3b8)', marginTop: '2px' }}>
                Kembali ke layar keypad PIN agar kasir atau karyawan lain bisa langsung masuk.
              </div>
            </div>
          </button>

          {/* Pilihan 2: Keluar Akun Master Pemilik (Hanya jika login sebagai Owner atau ingin sign out perangkat) */}
          {isOwner && (
            <button
              type="button"
              onClick={handleSignOutMaster}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.35)',
                color: '#ef4444',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldAlert size={22} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f87171' }}>
                  Keluar Akun Master (Sign Out Email)
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary, #94a3b8)', marginTop: '2px' }}>
                  Keluar total dari akun Owner perangkat ini (memerlukan email & password untuk masuk kembali).
                </div>
              </div>
            </button>
          )}
        </div>

        <button
          type="button"
          className="posa-cancel-logout-btn"
          onClick={handleCancel}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
        >
          Batal
        </button>
      </div>
    </div>
  );
}
