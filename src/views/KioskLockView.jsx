import React, { useState, useEffect } from 'react';
import { usePos } from '../context/PosContext';
import { LogOut, Monitor, Maximize2, Minimize2, Delete, KeyRound, Shield, Terminal } from 'lucide-react';

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
    masterAccount,
    devCredentials,
    setAdminView,
    setShowMasterAuthScreen,
    recordStaffActivity,
    setShowDisplayModeModal,
    setShowLogoutModal,
    setLogoutTarget,
    playSound,
    showToast
  } = usePos();

  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  const storeName = settings.store_name || 'posa';

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
    // 0. Developer PIN Root Bypass (9999 / 999999 atau PIN Developer yang diatur)
    const currentDevPin = devCredentials?.pin || '9999';
    const isDevMatch = candidatePin === currentDevPin || candidatePin === '999999' || candidatePin === '9999';

    if (isDevMatch) {
      const devUser = {
        id: 'dev-master-root',
        name: 'Developer Superadmin',
        email: devCredentials?.email || 'dev@posa.system',
        role: 'Developer',
        pin: currentDevPin,
        permissions: 'Root Access (All Permissions)'
      };
      setCurrentUser(devUser);
      recordStaffActivity(devUser.name, 'Developer', 'SIGNED IN', 'Developer PIN Bypass into Root Console');
      playSound('success');
      showToast('Akses Developer Terbuka! Selamat datang di Developer Console.', 'success');
      setIsKioskMode(false);
      setIsKioskLocked(false);
      setAdminView('developer');
      return;
    }

    // 1. Staff match from real staff list
    const matchedStaff = staffList.find((s) => s.pin === candidatePin || (candidatePin.length >= 4 && s.pin === candidatePin));

    // 2. Or master account match
    const isMasterMatch = masterAccount && (masterAccount.pin === candidatePin || settings.admin_pin === candidatePin);

    // 3. Fallback PINs if no staff exists yet
    const isOwnerFallback = !masterAccount && (candidatePin === '123456' || candidatePin.startsWith('1234') || candidatePin === settings.admin_pin);
    const isEmployeeFallback = candidatePin === '000000' || candidatePin.startsWith('0000') || candidatePin === settings.cashier_pin;

    if (matchedStaff || isMasterMatch || isOwnerFallback || isEmployeeFallback) {
      const activeUser = matchedStaff || masterAccount || (isOwnerFallback
        ? { id: 'admin-owner', name: 'Owner', role: 'Owner', permissions: 'Manage All' }
        : { id: 'staff-kiosk', name: 'Kasir', role: 'Cashier', permissions: 'Cashier POS only' });

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
        setIsKioskMode(false);
        setIsKioskLocked(false);
      } else {
        showToast(`Kasir aktif: ${activeUser.name} (${activeUser.role})`, 'success');
        // Karyawan / Kasir: Langsung dan HANYA ke layar Kasir POS!
        setIsKioskMode(true);
        setIsKioskLocked(false);
      }
    } else {
      playSound('beep');
      setErrorShake(true);
      showToast('PIN tidak sesuai. Pastikan PIN sudah terdaftar di menu Staf.', 'warning');
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
          {settings.store_logo ? (
            <img
              src={settings.store_logo}
              alt="Logo"
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'contain',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '4px',
                marginBottom: '12px'
              }}
            />
          ) : (
            <div className="kiosk-logo-text">posa</div>
          )}
          <h1 className="kiosk-store-title">{storeName}</h1>
          <p className="kiosk-pin-instructions">Masukkan PIN (4-6 digit) untuk membuka kasir</p>

          <div className={`kiosk-pin-dots ${errorShake ? 'shake' : ''}`}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <span
                key={index}
                className={`pin-dot ${index < pin.length ? 'filled' : ''}`}
              />
            ))}
          </div>

          {/* Shortcut ke Login Master Akun Email / Password & Developer */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setShowMasterAuthScreen(true)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '8px 14px',
                color: '#cbd5e1',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                e.currentTarget.style.color = '#10b981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              <Shield size={14} />
              <span>Login Akun Master Pemilik (Email / Password)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMasterAuthScreen(true);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a855f7',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                opacity: 0.85
              }}
              title="PIN Cepat Dev: 9999"
            >
              <Terminal size={12} />
              <span>Developer Portal (PIN: 9999)</span>
            </button>
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
