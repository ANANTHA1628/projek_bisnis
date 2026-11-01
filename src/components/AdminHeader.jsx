import React from 'react';
import { usePos } from '../context/PosContext';
import { Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react';

export default function AdminHeader({ title, children }) {
  const {
    language,
    setLanguage,
    isFullscreen,
    toggleFullscreen,
    currentUser,
    setMobileSidebarOpen,
    sidebarCollapsed,
    toggleSidebar
  } = usePos();

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(true);
    } else {
      toggleSidebar();
    }
  };

  return (
    <div className="posa-admin-top-header">
      <div className="posa-header-title-box">
        <button
          type="button"
          className="posa-sidebar-toggle-btn"
          onClick={handleToggle}
          title={sidebarCollapsed ? 'Buka Sidebar (Slide Buka)' : 'Tutup Sidebar (Slide Tutup)'}
          aria-label="Toggle Sidebar"
        >
          {sidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
        </button>
        <h1 className="posa-header-title">{title}</h1>
        {children}
      </div>

      <div className="posa-header-actions">
        {/* User Badge: Siapa yang sedang aktif login */}
        <div className="posa-active-user-badge">
          <div className="posa-user-avatar">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="text-left">
            <div className="posa-user-name">
              {currentUser?.name || 'Ahmad Rafi Hamdi'}
            </div>
            <div className="posa-user-role-tag">
              <span className="posa-role-dot" />
              <span>{currentUser?.role || 'Owner'}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="posa-header-tool-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <div className="posa-lang-pill">
          <button
            type="button"
            className={`posa-lang-item ${language === 'ID' ? 'active' : ''}`}
            onClick={() => setLanguage('ID')}
          >
            ID
          </button>
          <button
            type="button"
            className={`posa-lang-item ${language === 'EN' ? 'active' : ''}`}
            onClick={() => setLanguage('EN')}
          >
            EN
          </button>
        </div>
      </div>
    </div>
  );
}
