import React from 'react';
import { usePos } from '../context/PosContext';
import { Maximize2, Minimize2, UserCheck } from 'lucide-react';

export default function AdminHeader({ title, children }) {
  const { language, setLanguage, isFullscreen, toggleFullscreen, currentUser } = usePos();

  return (
    <div className="posa-admin-top-header">
      <div className="posa-header-title-box">
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
