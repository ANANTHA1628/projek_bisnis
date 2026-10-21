import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
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
  LogOut,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export default function Sidebar({ currentSubmenu = '' }) {
  const { activeTab, setActiveTab, showToast } = usePos();
  const [stokExpanded, setStokExpanded] = useState(activeTab === 'stok' || activeTab === 'laporan');
  const [laporanExpanded, setLaporanExpanded] = useState(activeTab === 'laporan');

  return (
    <aside className="admin-sidebar">
      <div>
        {/* Sidebar Brand */}
        <div className="sidebar-brand-box">
          <span className="posa-brand">posa</span>
          <span className="posa-brand-sub">ADMIN</span>
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
                <span>STOK</span>
              </span>
              {stokExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {stokExpanded && (
              <div className="sidebar-subnav-list">
                <button
                  className={`sidebar-subnav-item ${activeTab === 'stok' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stok')}
                >
                  Bahan Baku
                </button>
                <button
                  className="sidebar-subnav-item"
                  onClick={() => showToast('Modul Bahan Setengah Jadi')}
                >
                  Bahan Setengah Jadi
                </button>
                <button
                  className="sidebar-subnav-item"
                  onClick={() => showToast('Membuka formulir Restock')}
                >
                  Restock
                </button>
                <button
                  className="sidebar-subnav-item"
                  onClick={() => showToast('Modul Stok Opname & Buang')}
                >
                  Stok opname & buang
                </button>
                <button
                  className="sidebar-subnav-item"
                  onClick={() => showToast('Daftar Pemasok Bahan')}
                >
                  Pemasok
                </button>
              </div>
            )}
          </div>

          {/* MENU */}
          <button
            className="sidebar-nav-item"
            onClick={() => showToast('Pengaturan Menu & Resep')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UtensilsCrossed size={17} />
              <span>MENU</span>
            </span>
            <ChevronRight size={14} />
          </button>

          {/* STAF */}
          <button
            className="sidebar-nav-item"
            onClick={() => showToast('Manajemen Staf & Hak Akses')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={17} />
              <span>STAF</span>
            </span>
            <ChevronRight size={14} />
          </button>

          {/* PELANGGAN */}
          <button
            className="sidebar-nav-item"
            onClick={() => showToast('Data Pelanggan & Loyalty')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={17} />
              <span>PELANGGAN</span>
            </span>
            <ChevronRight size={14} />
          </button>

          {/* OPERASIONAL */}
          <button
            className="sidebar-nav-item"
            onClick={() => showToast('Operasional & Meja')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={17} />
              <span>OPERASIONAL</span>
            </span>
            <ChevronRight size={14} />
          </button>

          {/* LAPORAN */}
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
                  className={`sidebar-subnav-item ${activeTab === 'laporan' ? 'active' : ''}`}
                  onClick={() => setActiveTab('laporan')}
                >
                  Laporan Pendapatan
                </button>
                <button
                  className="sidebar-subnav-item"
                  onClick={() => showToast('Laporan Penjualan Item')}
                >
                  Penjualan per Item
                </button>
                <button
                  className="sidebar-subnav-item"
                  onClick={() => showToast('Laporan Laba Rugi')}
                >
                  Laba Rugi
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Secondary Navigation */}
        <div className="sidebar-secondary-links">
          <button
            className="sidebar-link"
            onClick={() => showToast('Pengaturan Tema & Tampilan')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Palette size={16} />
              <span>Tampilan</span>
            </span>
          </button>
          <button
            className="sidebar-link"
            onClick={() => showToast('Pengaturan Toko & Outlet')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings size={16} />
              <span>Pengaturan</span>
            </span>
          </button>
          <button
            className="sidebar-link"
            onClick={() => showToast('Pusat Bantuan & Panduan')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HelpCircle size={16} />
              <span>Bantuan</span>
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sidebar-bottom-actions">
        <button className="buka-kiosk-btn" onClick={() => setActiveTab('kasir')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={16} />
            <span>Buka POS Kiosk</span>
          </span>
          <ChevronRight size={16} />
        </button>

        <div className="pro-badge-card">
          <Crown size={18} color="#fbbf24" />
          <div>
            <div className="pro-badge-text">Pro</div>
            <div className="pro-subtext">sisa 26 hari</div>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            if (window.confirm('Yakin ingin keluar (logout)?')) {
              showToast('Sesi telah ditutup');
            }
          }}
        >
          <LogOut size={15} />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
