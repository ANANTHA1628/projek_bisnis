import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Boxes,
  UtensilsCrossed,
  Users,
  UserCheck,
  Briefcase,
  FileText,
  Palette,
  Settings,
  HelpCircle,
  Store,
  Crown,
  Shield,
  Coffee,
  LogOut,
  ChevronRight,
  ChevronDown,
  Clock
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    stokSubTab,
    setStokSubTab,
    laporanSubTab,
    setLaporanSubTab,
    setShowRestockModal,
    setShowOpnameModal,
    showToast
  } = usePos();

  const { user, logout, canViewLaporan, canViewAbsensiAll } = useAuth();

  const [stokExpanded, setStokExpanded] = useState(true);
  const [laporanExpanded, setLaporanExpanded] = useState(true);

  const handleLogout = () => {
    if (window.confirm('Yakin ingin keluar (logout)?')) {
      logout();
      showToast('Sesi kasir berhasil diamankan & logout.');
    }
  };

  return (
    <aside className="admin-sidebar">
      <div>
        {/* Sidebar Brand */}
        <div className="sidebar-brand-box">
          <span className="posa-brand">posa</span>
          <span className="posa-brand-sub">
            {user?.role?.toUpperCase() || 'POS'}
          </span>
        </div>

        {/* Main Nav Group */}
        <nav className="sidebar-nav-group">
          {/* Dasbor */}
          <button
            className={`sidebar-nav-item ${activeTab === 'dasbor' ? 'active' : ''}`}
            onClick={() => setActiveTab('dasbor')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LayoutDashboard size={17} />
              <span>Dasbor</span>
            </span>
          </button>

          {/* ABSENSI - New dedicated nav item */}
          <button
            className={`sidebar-nav-item ${activeTab === 'absensi' ? 'active' : ''}`}
            onClick={() => setActiveTab('absensi')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={17} />
              <span>
                {canViewAbsensiAll ? 'Absensi Karyawan' : 'Absensi Saya'}
              </span>
            </span>
            <ChevronRight size={14} />
          </button>

          {/* STOK with Dropdown */}
          <div>
            <button
              className={`sidebar-nav-item ${activeTab === 'stok' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('stok');
                setStokExpanded(!stokExpanded);
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Boxes size={17} />
                <span>STOK & HPP</span>
              </span>
              {stokExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {stokExpanded && (
              <div className="sidebar-subnav-list">
                <button
                  className={`sidebar-subnav-item ${activeTab === 'stok' && stokSubTab === 'bahan' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('stok');
                    setStokSubTab('bahan');
                  }}
                >
                  Bahan Baku
                </button>
                <button
                  className={`sidebar-subnav-item ${activeTab === 'stok' && stokSubTab === 'resep' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('stok');
                    setStokSubTab('resep');
                  }}
                >
                  Resep & HPP Menu
                </button>
                <button
                  className={`sidebar-subnav-item ${activeTab === 'stok' && stokSubTab === 'simulator' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('stok');
                    setStokSubTab('simulator');
                  }}
                >
                  Simulator HPP (R&D)
                </button>
                <button
                  className="sidebar-subnav-item"
                  onClick={() => setShowRestockModal(true)}
                >
                  Restock
                </button>
                <button
                  className="sidebar-subnav-item"
                  onClick={() => setShowOpnameModal(true)}
                >
                  Stok opname & buang
                </button>
                <button
                  className={`sidebar-subnav-item ${activeTab === 'stok' && stokSubTab === 'ledger' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('stok');
                    setStokSubTab('ledger');
                  }}
                >
                  Buku Besar Mutasi
                </button>
              </div>
            )}
          </div>

          {/* MENU */}
          <button
            className="sidebar-nav-item"
            onClick={() => {
              setActiveTab('stok');
              setStokSubTab('resep');
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UtensilsCrossed size={17} />
              <span>MENU & RESEP</span>
            </span>
            <ChevronRight size={14} />
          </button>

          {/* STAF (Owner / Admin only) */}
          {canViewAbsensiAll && (
            <button
              className="sidebar-nav-item"
              onClick={() => setActiveTab('absensi')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={17} />
                <span>STAF & ABSENSI</span>
              </span>
              <ChevronRight size={14} />
            </button>
          )}

          {/* PELANGGAN */}
          <button
            className="sidebar-nav-item"
            onClick={() => showToast('Data Pelanggan & Riwayat Pesanan')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={17} />
              <span>PELANGGAN</span>
            </span>
            <ChevronRight size={14} />
          </button>

          {/* OPERASIONAL (Only Owner / Admin) */}
          {canViewLaporan && (
            <button
              className="sidebar-nav-item"
              onClick={() => {
                setActiveTab('laporan');
                setLaporanSubTab('biaya');
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase size={17} />
                <span>BIAYA OPERASIONAL</span>
              </span>
              <ChevronRight size={14} />
            </button>
          )}

          {/* LAPORAN (Strictly Owner & Admin only!) */}
          {canViewLaporan && (
            <div>
              <button
                className={`sidebar-nav-item ${activeTab === 'laporan' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('laporan');
                  setLaporanExpanded(!laporanExpanded);
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={17} />
                  <span>LAPORAN</span>
                </span>
                {laporanExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {laporanExpanded && (
                <div className="sidebar-subnav-list">
                  <button
                    className={`sidebar-subnav-item ${activeTab === 'laporan' && laporanSubTab === 'pendapatan' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('laporan');
                      setLaporanSubTab('pendapatan');
                    }}
                  >
                    RPT-01 Pendapatan
                  </button>
                  <button
                    className={`sidebar-subnav-item ${activeTab === 'laporan' && laporanSubTab === 'labarugi' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('laporan');
                      setLaporanSubTab('labarugi');
                    }}
                  >
                    RPT-03 Laba Rugi
                  </button>
                  <button
                    className={`sidebar-subnav-item ${activeTab === 'laporan' && laporanSubTab === 'item' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('laporan');
                      setLaporanSubTab('item');
                    }}
                  >
                    RPT-02 & 06 Item & Margin
                  </button>
                  <button
                    className={`sidebar-subnav-item ${activeTab === 'laporan' && laporanSubTab === 'biaya' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('laporan');
                      setLaporanSubTab('biaya');
                    }}
                  >
                    Biaya Operasional
                  </button>
                  <button
                    className={`sidebar-subnav-item ${activeTab === 'laporan' && laporanSubTab === 'riwayat' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('laporan');
                      setLaporanSubTab('riwayat');
                    }}
                  >
                    Riwayat & Void (PIN Admin)
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Secondary Navigation */}
        <div className="sidebar-secondary-links">
          <button
            className="sidebar-link"
            onClick={() => showToast('Tema Dark Mode Elegan (Aktif)')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Palette size={16} />
              <span>Tampilan</span>
            </span>
          </button>
          <button
            className="sidebar-link"
            onClick={() => showToast('Pengaturan Toko, Pajak PB1 (10%), Komisi Ojol (20%)')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings size={16} />
              <span>Pengaturan</span>
            </span>
          </button>
          <button
            className="sidebar-link"
            onClick={() => showToast('PRD posa v3.0 - Panduan Akses Multi-Role')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HelpCircle size={16} />
              <span>Bantuan Role</span>
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sidebar-bottom-actions">
        <button className="buka-kiosk-btn" onClick={() => setActiveTab('kasir')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={16} />
            <span>Buka Kasir POS</span>
          </span>
          <ChevronRight size={16} />
        </button>

        <div className="pro-badge-card">
          {user?.role === 'owner' ? (
            <Crown size={18} color="#fbbf24" />
          ) : user?.role === 'admin' ? (
            <Shield size={18} color="#60a5fa" />
          ) : (
            <Coffee size={18} color="#34d399" />
          )}
          <div>
            <div className="pro-badge-text">{user?.name || 'User POS'}</div>
            <div className="pro-subtext">Role: {user?.role?.toUpperCase()}</div>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={15} />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
