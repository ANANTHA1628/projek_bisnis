import React, { useState, useEffect } from 'react';
import { usePos } from '../context/PosContext';
import { LogOut, Monitor, Maximize2, Minimize2, Delete } from 'lucide-react';

export default function KioskLockView() {
  const {
    settings,
    language,
    setLanguage,
    isFullscreen,
    toggleFullscreen,
    setIsKioskMode,
    setIsKioskLocked,
    setCurrentUser,
    staffList,
    recordStaffActivity,
    setShowDisplayModeModal,
    setShowLogoutModal,
    setLogoutTarget,
    playSound,
    showToast
  } = usePos();

  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  const storeName = settings.store_name || 'Staycy_2026';

  const handleKeyPress = (num) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      playSound('beep');

      if (nextPin.length === 6) {
        verifyPin(nextPin);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    playSound('click');
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    playSound('click');
  };

  const verifyPin = (candidatePin) => {
    // Check against real staff list
    // 1. Staff match (e.g. Budi Barista pin: '0000', Aryaputra: '5678', Ahmad Rafi: '1234')
    const matchedStaff = staffList.find((s) => s.pin === candidatePin || candidatePin.startsWith(s.pin));

    // 2. Or fallback PINs
    const isOwnerOrAdmin =
      candidatePin === '123456' ||
      candidatePin.startsWith('1234') ||
      candidatePin === settings.admin_pin ||
      (matchedStaff && (matchedStaff.role === 'Owner' || matchedStaff.role === 'Supervisor'));

    const isEmployee =
      candidatePin === '000000' ||
      candidatePin.startsWith('0000') ||
      candidatePin === settings.cashier_pin ||
      (matchedStaff && matchedStaff.role !== 'Owner' && matchedStaff.role !== 'Supervisor');

    if (matchedStaff || isOwnerOrAdmin || isEmployee) {
      const activeUser = matchedStaff || (isOwnerOrAdmin
        ? { id: 'admin-temp', name: 'Ahmad Rafi Hamdi', role: 'Owner', permissions: 'Manage All' }
        : { id: 'staff-temp', name: 'Budi Barista', role: 'Cashier', permissions: 'Cashier POS only' });

      setCurrentUser(activeUser);
      recordStaffActivity(
        activeUser.name,
        activeUser.role,
        'SIGNED IN',
        activeUser.role === 'Owner'
          ? 'Signed into Backoffice / Kiosk'
          : `Signed into POS Kiosk (${activeUser.shift || 'Shift Aktif'})`
      );
      playSound('success');

      if (activeUser.role === 'Owner') {
        showToast(`Selamat datang ${activeUser.name} (Owner/Admin)`, 'success');
      } else {
        showToast(`Kasir aktif: ${activeUser.name} (${activeUser.role})`, 'success');
      }

      setIsKioskLocked(false);
    } else {
      playSound('beep');
      setErrorShake(true);
      showToast('PIN tidak sesuai (Coba: 123456 untuk Owner, atau 000000 untuk Kasir)', 'warning');
      setTimeout(() => {
        setPin('');
        setErrorShake(false);
      }, 700);
    }
  };

  // Keyboard listener for physical keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      } else if (e.key === 'Enter') {
        if (pin.length > 0) {
          verifyPin(pin.padEnd(6, '0'));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  const handleDisconnect = () => {
    setLogoutTarget('kiosk');
    setShowLogoutModal(true);
  };

  return (
    <div className="kiosk-lock-overlay">
      {/* Top Header Bar */}
      <header className="kiosk-top-bar">
        <button
          className="kiosk-header-btn"
          onClick={handleDisconnect}
          title="Disconnect Device / Logout"
        >
          <LogOut size={16} />
          <span>Disconnect Device</span>
        </button>

        <div className="kiosk-top-tools">
          <button
            className="kiosk-header-btn"
            onClick={() => setShowDisplayModeModal(true)}
          >
            <Monitor size={15} />
            <span>Display mode</span>
          </button>

          <button
            className="kiosk-header-icon-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <div className="kiosk-lang-toggle">
            <button
              className={`kiosk-lang-btn ${language === 'ID' ? 'active' : ''}`}
              onClick={() => setLanguage('ID')}
            >
              ID
            </button>
            <button
              className={`kiosk-lang-btn ${language === 'EN' ? 'active' : ''}`}
              onClick={() => setLanguage('EN')}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Lock Screen Layout */}
      <main className="kiosk-lock-body">
        {/* Left Side: Store & PIN status */}
        <div className="kiosk-lock-info">
          <div className="kiosk-logo-text">posa</div>
          <h1 className="kiosk-store-title">{storeName}</h1>
          <p className="kiosk-pin-instructions">Enter your PIN (6 digits) to sign in</p>

          <div className={`kiosk-pin-dots ${errorShake ? 'shake' : ''}`}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <span
                key={index}
                className={`pin-dot ${index < pin.length ? 'filled' : ''}`}
              />
            ))}
          </div>

          <div className="kiosk-quick-hint">
            <div>Owner/Admin: <code>123456</code> (atau <code>1234</code>)</div>
            <div className="mt-1">Karyawan/Kasir: <code>000000</code> (atau <code>0000</code>)</div>
          </div>
        </div>

        {/* Right Side: Keypad */}
        <div className="kiosk-keypad-container">
          <div className="kiosk-keypad-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                className="kiosk-key-btn"
                onClick={() => handleKeyPress(String(num))}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              className="kiosk-key-btn text-action"
              onClick={handleClear}
            >
              Clear
            </button>

            <button
              type="button"
              className="kiosk-key-btn"
              onClick={() => handleKeyPress('0')}
            >
              0
            </button>

            <button
              type="button"
              className="kiosk-key-btn icon-action"
              onClick={handleBackspace}
            >
              <Delete size={22} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
