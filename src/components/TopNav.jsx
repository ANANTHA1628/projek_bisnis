import React from 'react';
import { usePos } from '../context/PosContext';
import { Maximize2, Minimize2, Palette, Settings, HelpCircle } from 'lucide-react';

export default function TopNav() {
  const {
    activeTab,
    setActiveTab,
    isFullscreen,
    toggleFullscreen,
    setShowTampilanModal,
    setShowPengaturanModal,
    setShowBantuanModal
  } = usePos();

  return (
    <header className="top-header-bar">
      {/* Window Controls (macOS style dots) */}
      <div className="window-dots">
        <span className="window-dot close" title="Tutup" />
        <span className="window-dot min" title="Minimize" />
        <span className="window-dot max" title="Maximize" />
      </div>

      {/* Center Navigation Pills */}
      <nav className="nav-pill-container">
        <button
          className={`nav-pill-btn ${activeTab === 'kasir' ? 'active' : ''}`}
          onClick={() => setActiveTab('kasir')}
        >
          Kasir
        </button>
        <button
          className={`nav-pill-btn ${activeTab === 'dasbor' ? 'active' : ''}`}
          onClick={() => setActiveTab('dasbor')}
        >
          Dasbor
        </button>
        <button
          className={`nav-pill-btn ${activeTab === 'stok' ? 'active' : ''}`}
          onClick={() => setActiveTab('stok')}
        >
          Stok
        </button>
        <button
          className={`nav-pill-btn ${activeTab === 'laporan' ? 'active' : ''}`}
          onClick={() => setActiveTab('laporan')}
        >
          Laporan
        </button>
        <button
          className={`nav-pill-btn ${activeTab === 'staf' ? 'active' : ''}`}
          onClick={() => setActiveTab('staf')}
        >
          Staf
        </button>
        <button
          className={`nav-pill-btn ${activeTab === 'pelanggan' ? 'active' : ''}`}
          onClick={() => setActiveTab('pelanggan')}
        >
          Pelanggan
        </button>
      </nav>

      {/* Right Tools */}
      <div className="top-right-quick-tools" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="tool-icon-btn"
          onClick={() => setShowTampilanModal(true)}
          title="Tampilan & Tema Warna"
        >
          <Palette size={16} />
        </button>
        <button
          className="tool-icon-btn"
          onClick={() => setShowPengaturanModal(true)}
          title="Pengaturan Toko & POS"
        >
          <Settings size={16} />
        </button>
        <button
          className="tool-icon-btn"
          onClick={() => setShowBantuanModal(true)}
          title="Bantuan PRD v3.0 & SOP"
        >
          <HelpCircle size={16} />
        </button>
        <button
          className="tool-icon-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </header>
  );
}
