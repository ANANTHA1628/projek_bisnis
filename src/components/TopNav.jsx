import React from 'react';
import { usePos } from '../context/PosContext';
import { useAuth } from '../context/AuthContext';
import { Maximize2, Minimize2, LogOut, Crown, Shield, Coffee } from 'lucide-react';

export default function TopNav() {
  const { activeTab, setActiveTab, isFullscreen, toggleFullscreen, showToast } = usePos();
  const { user, logout, canViewLaporan } = useAuth();

  const handleLogout = () => {
    if (window.confirm(`Yakin ingin keluar dari akun ${user?.name}?`)) {
      logout();
      showToast('Berhasil logout dari sistem');
    }
  };

  const getRoleIcon = () => {
    if (user?.role === 'owner') return <Crown size={14} color="#fbbf24" />;
    if (user?.role === 'admin') return <Shield size={14} color="#60a5fa" />;
    return <Coffee size={14} color="#34d399" />;
  };

  return (
    <header className="top-header-bar">
      {/* Window Controls (macOS style dots) */}
      <div className="window-dots">
        <span className="window-dot close" title="Tutup" />
        <span className="window-dot min" title="Minimize" />
        <span className="window-dot max" title="Maximize" />
      </div>

      {/* Center Navigation Pills - Strictly Role Based */}
      <nav className="nav-pill-container">
        {/* Kasir: can be viewed by all roles */}
        <button
          className={`nav-pill-btn ${activeTab === 'kasir' ? 'active' : ''}`}
          onClick={() => setActiveTab('kasir')}
        >
          Kasir
        </button>

        {/* Absensi: can be viewed by all roles (karyawan: own; owner/admin: all) */}
        <button
          className={`nav-pill-btn ${activeTab === 'absensi' ? 'active' : ''}`}
          onClick={() => setActiveTab('absensi')}
        >
          Absensi
        </button>

        {/* Stok: can be viewed by all roles */}
        <button
          className={`nav-pill-btn ${activeTab === 'stok' ? 'active' : ''}`}
          onClick={() => setActiveTab('stok')}
        >
          Stok
        </button>

        {/* Dasbor: can be viewed by all roles */}
        <button
          className={`nav-pill-btn ${activeTab === 'dasbor' ? 'active' : ''}`}
          onClick={() => setActiveTab('dasbor')}
        >
          Dasbor
        </button>
        {/* Pelanggan: can be viewed by all roles */}
        <button
          className={`nav-pill-btn ${activeTab === 'pelanggan' ? 'active' : ''}`}
          onClick={() => setActiveTab('pelanggan')}
        >
          Pelanggan
        </button>

        {/* Staf: Only Owner & Admin */}
        {canViewLaporan && (
          <button
            className={`nav-pill-btn ${activeTab === 'staf' ? 'active' : ''}`}
            onClick={() => setActiveTab('staf')}
          >
            Staf
          </button>
        )}

        {/* Laporan: Only Owner & Admin! Hidden from Karyawan */}
        {canViewLaporan && (
          <button
            className={`nav-pill-btn ${activeTab === 'laporan' ? 'active' : ''}`}
            onClick={() => setActiveTab('laporan')}
          >
            Laporan
          </button>
        )}
      </nav>

      {/* Right Tools: User Profile & Quick Actions */}
      <div className="top-right-quick-tools">
        {/* User Role Tag */}
        {user && (
          <div className="top-user-pill">
            <span className="top-user-icon">{getRoleIcon()}</span>
            <span className="top-user-name">{user.name}</span>
            <span className={`top-user-role-badge ${user.role}`}>
              {user.role}
            </span>
          </div>
        )}

        <button
          className="tool-icon-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Logout Button */}
        <button
          className="tool-icon-btn logout"
          onClick={handleLogout}
          title="Keluar (Logout)"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
