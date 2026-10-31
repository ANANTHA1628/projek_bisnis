import React from 'react';
import { usePos } from '../../context/PosContext';
import { LogOut } from 'lucide-react';

export default function LogoutModal() {
  const {
    showLogoutModal,
    setShowLogoutModal,
    logoutTarget,
    currentUser,
    setCurrentUser,
    recordStaffActivity,
    setIsKioskMode,
    setIsKioskLocked,
    showToast,
    playSound
  } = usePos();

  if (!showLogoutModal) return null;

  const handleConfirmLogout = () => {
    playSound('click');
    setShowLogoutModal(false);

    if (logoutTarget === 'kiosk') {
      // Employee / Cashier log out of POS Kiosk -> goes back to PIN lock screen
      recordStaffActivity(
        currentUser?.name || 'Cashier',
        currentUser?.role || 'Cashier',
        'SIGNED OUT',
        'Logged out of cashier terminal & closed session'
      );
      setCurrentUser(null);
      setIsKioskLocked(true);
      showToast('Karyawan berhasil keluar dari sesi kasir', 'info');
    } else {
      // Admin Backoffice logout -> switches to locked state or disconnects
      recordStaffActivity(
        currentUser?.name || 'Ahmad Rafi Hamdi',
        currentUser?.role || 'Owner',
        'SIGNED OUT',
        'Logged out of Admin Backoffice'
      );
      setCurrentUser(null);
      setIsKioskMode(true);
      setIsKioskLocked(true);
      showToast('Berhasil keluar dari akun Admin', 'info');
    }
  };

  const handleCancel = () => {
    playSound('click');
    setShowLogoutModal(false);
  };

  return (
    <div className="posa-modal-overlay">
      <div className="posa-logout-dialog-card">
        <h2 className="posa-logout-title">Logout</h2>
        <p className="posa-logout-subtitle">
          {logoutTarget === 'kiosk'
            ? `Are you sure you want to log out ${currentUser?.name || 'cashier'}?`
            : 'Are you sure you want to log out?'}
        </p>

        <button
          type="button"
          className="posa-confirm-logout-btn"
          onClick={handleConfirmLogout}
        >
          <LogOut size={16} />
          <span>Confirm Logout</span>
        </button>

        <button
          type="button"
          className="posa-cancel-logout-btn"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
