import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

export default function AuthView() {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('owner@posa.local');
  const [password, setPassword] = useState('owner123');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState('owner'); // 'admin', 'owner', 'karyawan'
  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'pin'
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const quickSwitchAccount = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('admin@posa.local');
      setPassword('admin123');
      setPin('9999');
    } else if (selectedRole === 'owner') {
      setEmail('owner@posa.local');
      setPassword('owner123');
      setPin('1234');
    } else {
      setEmail('kasir@posa.local');
      setPassword('karyawan123');
      setPin('0000');
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (isLoginMode) {
        if (authMethod === 'password') {
          await login(email, password, '');
        } else {
          await login(email, '', pin);
        }
      } else {
        await register(name, email, password, role, pin);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal memproses autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view-overlay">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand-area">
          <div className="auth-logo-badge">
            <span className="auth-logo-text">posa</span>
            <span className="auth-logo-pill">v3.0</span>
          </div>
          <h2 className="auth-title">
            {isLoginMode ? 'Masuk ke Sistem POS' : 'Daftar Akun Baru'}
          </h2>
          <p className="auth-subtitle">
            Point of Sale, Inventory HPP & Manajemen Multi-Role Kafe
          </p>
        </div>

        {/* Quick Role Switcher (Pre-filled for fast testing) */}
        {isLoginMode && (
          <div className="auth-quick-roles">
            <div className="auth-quick-roles-title">Cepat Masuk Sebagai:</div>
            <div className="auth-role-buttons">
              <button
                type="button"
                className={`auth-role-btn ${role === 'owner' ? 'active' : ''}`}
                onClick={() => quickSwitchAccount('owner')}
              >
                👑 Owner
              </button>
              <button
                type="button"
                className={`auth-role-btn ${role === 'karyawan' ? 'active' : ''}`}
                onClick={() => quickSwitchAccount('karyawan')}
              >
                ☕ Karyawan
              </button>
              <button
                type="button"
                className={`auth-role-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => quickSwitchAccount('admin')}
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="auth-alert-error">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Register: Name */}
          {!isLoginMode && (
            <div className="auth-form-group">
              <label>Nama Lengkap</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="Contoh: Rina / Budi Barista"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="auth-form-group">
            <label>Email Pengguna</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                placeholder="nama@posa.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Login Auth Method Toggle: Password vs Quick PIN */}
          {isLoginMode && (
            <div className="auth-method-tabs">
              <button
                type="button"
                className={`auth-method-tab ${authMethod === 'password' ? 'active' : ''}`}
                onClick={() => setAuthMethod('password')}
              >
                <Lock size={14} /> Password
              </button>
              <button
                type="button"
                className={`auth-method-tab ${authMethod === 'pin' ? 'active' : ''}`}
                onClick={() => setAuthMethod('pin')}
              >
                <KeyRound size={14} /> PIN Cepat
              </button>
            </div>
          )}

          {/* Password field */}
          {(!isLoginMode || authMethod === 'password') && (
            <div className="auth-form-group">
              <label>Kata Sandi (Password)</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* PIN field */}
          {(authMethod === 'pin' || !isLoginMode) && (
            <div className="auth-form-group">
              <label>{isLoginMode ? 'PIN Kasir / POS (4-6 Angka)' : 'PIN Cepat (Opsional 4 Digit)'}</label>
              <div className="auth-input-wrapper">
                <KeyRound size={18} className="auth-input-icon" />
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Contoh: 1234 atau 0000"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required={isLoginMode && authMethod === 'pin'}
                />
              </div>
            </div>
          )}

          {/* Register: Role Selector */}
          {!isLoginMode && (
            <div className="auth-form-group">
              <label>Pilih Role Akun</label>
              <div className="auth-role-select-grid">
                <label className={`role-card-radio ${role === 'owner' ? 'checked' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="owner"
                    checked={role === 'owner'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div className="role-card-title">👑 Owner</div>
                  <div className="role-card-desc">Absensi staf, stok, laporan lengkap, laba rugi</div>
                </label>

                <label className={`role-card-radio ${role === 'karyawan' ? 'checked' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="karyawan"
                    checked={role === 'karyawan'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div className="role-card-title">☕ Karyawan</div>
                  <div className="role-card-desc">Kasir, absen mandiri, stok, dasbor (tanpa laporan)</div>
                </label>

                <label className={`role-card-radio ${role === 'admin' ? 'checked' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div className="role-card-title">🛡️ Admin</div>
                  <div className="role-card-desc">Akses penuh sistem, manajemen staf & pengaturan</div>
                </label>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              'Memproses...'
            ) : (
              <>
                <span>{isLoginMode ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="auth-footer-toggle">
          {isLoginMode ? (
            <p>
              Belum punya akun?{' '}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setIsLoginMode(false);
                  setErrorMessage('');
                }}
              >
                Daftar Akun Baru
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{' '}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setIsLoginMode(true);
                  setErrorMessage('');
                }}
              >
                Kembali ke Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
