import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
import {
  Store,
  ShieldCheck,
  User,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function AuthMasterView({ defaultMode = 'register', onSwitchToPin }) {
  const {
    registerMasterAccount,
    loginMasterAccount,
    masterAccount,
    settings,
    playSound
  } = usePos();

  const [mode, setMode] = useState(masterAccount ? 'login' : 'register');

  // Register form state
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState(masterAccount?.email || '');
  const [loginPassword, setLoginPassword] = useState('');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama pemilik / admin wajib diisi.');
      return;
    }
    if (!storeName.trim()) {
      setErrorMsg('Nama toko / brand usaha wajib diisi.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Email master tidak valid.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Kata sandi master minimal 6 karakter.');
      return;
    }
    if (pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
      setErrorMsg('PIN Kiosk harus 4 sampai 6 angka (contoh: 1234 atau 123456).');
      return;
    }

    playSound('success');
    registerMasterAccount({
      name: name.trim(),
      storeName: storeName.trim(),
      email: email.trim(),
      password,
      pin
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = loginMasterAccount(loginEmail, loginPassword);
    if (!res.success) {
      playSound('beep');
      setErrorMsg(res.message);
    } else {
      playSound('success');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app, #080c14)',
        backgroundImage: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.12), transparent 70%)',
        padding: '24px 16px',
        color: '#ffffff'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--bg-card, #0f1523)',
          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Brand Banner Header */}
        <div
          style={{
            padding: '28px 24px 20px',
            textAlign: 'center',
            borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Store size={28} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px', margin: '0 0 4px', color: '#ffffff' }}>
            {settings?.store_name || 'POSA Point of Sale'}
          </h1>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary, #94a3b8)', margin: 0 }}>
            {mode === 'register'
              ? 'Daftarkan akun Owner pertama untuk mulai mengelola bisnis & kasir'
              : 'Masuk dengan Akun Master Pemilik (Owner / Admin)'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            padding: '12px 24px 0',
            gap: '8px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: mode === 'register' ? '1px solid #10b981' : '1px solid transparent',
              backgroundColor: mode === 'register' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: mode === 'register' ? '#10b981' : 'var(--text-secondary, #94a3b8)',
              transition: 'all 0.2s ease'
            }}
          >
            Daftar Akun Baru
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: mode === 'login' ? '1px solid #10b981' : '1px solid transparent',
              backgroundColor: mode === 'login' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: mode === 'login' ? '#10b981' : 'var(--text-secondary, #94a3b8)',
              transition: 'all 0.2s ease'
            }}
          >
            Masuk Akun Master
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '20px 24px 28px' }}>
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '12px',
                marginBottom: '16px'
              }}
            >
              {errorMsg}
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Nama Owner */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Nama Lengkap Pemilik (Owner / Admin) *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                  <input
                    type="text"
                    className="posa-input w-full"
                    style={{ paddingLeft: '38px' }}
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Nama Usaha / Toko */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Nama Usaha / Brand Toko *
                </label>
                <div style={{ position: 'relative' }}>
                  <Store size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                  <input
                    type="text"
                    className="posa-input w-full"
                    style={{ paddingLeft: '38px' }}
                    placeholder="Contoh: Kopi Nusantara, Resto Berkah"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Master */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Email Master (Pemilik) *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                  <input
                    type="email"
                    className="posa-input w-full"
                    style={{ paddingLeft: '38px' }}
                    placeholder="email@bisnisanda.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Master */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
                    Kata Sandi Master (Min. 6 Karakter) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ fontSize: '11px', color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                    <span>{showPassword ? 'Tutup' : 'Lihat'}</span>
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="posa-input w-full font-mono"
                    style={{ paddingLeft: '38px' }}
                    placeholder="Kata sandi master rahasia"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* PIN Kiosk Kasir */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  PIN Kiosk Cepat (4 - 6 Digit Angka) *
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                  <input
                    type="password"
                    maxLength={6}
                    className="posa-input w-full font-mono font-bold"
                    style={{ paddingLeft: '38px', letterSpacing: '4px' }}
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', marginTop: '4px', display: 'block' }}>
                  PIN angka ini dipakai saat ganti shift & login cepat di meja kasir.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="buat-laporan-btn"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Daftar & Masuk ke Sistem</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Email Master (Pemilik)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                  <input
                    type="email"
                    className="posa-input w-full"
                    style={{ paddingLeft: '38px' }}
                    placeholder="email@bisnisanda.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
                    Kata Sandi Master
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ fontSize: '11px', color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                    <span>{showPassword ? 'Tutup' : 'Lihat'}</span>
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="posa-input w-full font-mono"
                    style={{ paddingLeft: '38px' }}
                    placeholder="Masukkan kata sandi master"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="buat-laporan-btn"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Masuk sebagai Admin / Owner</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Switch to PIN Keypad button if already has staff/account registered */}
          {masterAccount && onSwitchToPin && (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))', textAlign: 'center' }}>
              <button
                type="button"
                onClick={onSwitchToPin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#10b981',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <KeyRound size={14} />
                <span>Masuk dengan PIN Cepat Kasir (Shift Karyawan) ➔</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
