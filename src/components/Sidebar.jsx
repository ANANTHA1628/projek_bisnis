import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
import {
  ChevronDown,
  ChevronRight,
  Store,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const {
    adminView,
    setAdminView,
    setIsKioskMode,
    setIsKioskLocked,
    currentUser,
    setShowLogoutModal,
    setLogoutTarget,
    showToast
  } = usePos();

  // Accordion state
  const [stockOpen, setStockOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [operationsOpen, setOperationsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const handleOpenKiosk = () => {
    setIsKioskMode(true);
    setIsKioskLocked(true);
    showToast('Beralih ke mode POS Kiosk');
  };

  const handleLogout = () => {
    setLogoutTarget('admin');
    setShowLogoutModal(true);
  };

  return (
    <aside className="posa-admin-sidebar">
      {/* Brand Header */}
      <div className="posa-sidebar-brand">
        <span className="posa-brand-title">posa</span>
        <span className="posa-brand-badge">ADMIN</span>
      </div>

      {/* Navigation Scrollable Area */}
      <nav className="posa-sidebar-nav">
        {/* Dashboard */}
        <div className="posa-nav-section">
          <button
            type="button"
            className={`posa-nav-single ${adminView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setAdminView('dashboard')}
          >
            Dashboard
          </button>
        </div>

        {/* STOCK */}
        <div className="posa-nav-section">
          <button
            type="button"
            className="posa-nav-group-header"
            onClick={() => setStockOpen(!stockOpen)}
          >
            <span>STOCK</span>
            {stockOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {stockOpen && (
            <div className="posa-subnav-tree">
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'raw-materials' ? 'active' : ''}`}
                onClick={() => setAdminView('raw-materials')}
              >
                Raw Materials
              </button>
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'semi-finished' ? 'active' : ''}`}
                onClick={() => setAdminView('semi-finished')}
              >
                Semi-Finished Goods
              </button>
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'restock' ? 'active' : ''}`}
                onClick={() => setAdminView('restock')}
              >
                Restock
              </button>
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'stock-take' ? 'active' : ''}`}
                onClick={() => setAdminView('stock-take')}
              >
                Stock take & waste
              </button>
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'suppliers' ? 'active' : ''}`}
                onClick={() => setAdminView('suppliers')}
              >
                Suppliers
              </button>
            </div>
          )}
        </div>

        {/* MENU */}
        <div className="posa-nav-section">
          <button
            type="button"
            className="posa-nav-group-header"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>MENU</span>
            {menuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {menuOpen && (
            <div className="posa-subnav-tree">
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'menus' ? 'active' : ''}`}
                onClick={() => setAdminView('menus')}
              >
                Menus
              </button>
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'packages' ? 'active' : ''}`}
                onClick={() => setAdminView('packages')}
              >
                Packages
              </button>
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'promos' ? 'active' : ''}`}
                onClick={() => setAdminView('promos')}
              >
                Promos
              </button>
            </div>
          )}
        </div>

        {/* STAFF */}
        <div className="posa-nav-section">
          <button
            type="button"
            className="posa-nav-group-header"
            onClick={() => setStaffOpen(!staffOpen)}
          >
            <span>STAFF</span>
            {staffOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {staffOpen && (
            <div className="posa-subnav-tree">
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'staff' ? 'active' : ''}`}
                onClick={() => setAdminView('staff')}
              >
                Staff
              </button>
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'staff-activity' ? 'active' : ''}`}
                onClick={() => setAdminView('staff-activity')}
              >
                Staff Activity
              </button>
            </div>
          )}
        </div>

        {/* OPERATIONS */}
        <div className="posa-nav-section">
          <button
            type="button"
            className="posa-nav-group-header"
            onClick={() => setOperationsOpen(!operationsOpen)}
          >
            <span>OPERATIONS</span>
            {operationsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {operationsOpen && (
            <div className="posa-subnav-tree">
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'orders-void' ? 'active' : ''}`}
                onClick={() => setAdminView('orders-void')}
              >
                Orders & Void
              </button>
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'tables' ? 'active' : ''}`}
                onClick={() => setAdminView('tables')}
              >
                Tables
              </button>
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'tax-service' ? 'active' : ''}`}
                onClick={() => setAdminView('tax-service')}
              >
                Tax & Service Charge
              </button>
            </div>
          )}
        </div>

        {/* REPORTS */}
        <div className="posa-nav-section">
          <button
            type="button"
            className="posa-nav-group-header"
            onClick={() => setReportsOpen(!reportsOpen)}
          >
            <span>REPORTS</span>
            {reportsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {reportsOpen && (
            <div className="posa-subnav-tree">
              <button
                type="button"
                className={`posa-subnav-item ${adminView === 'revenue-report' ? 'active' : ''}`}
                onClick={() => setAdminView('revenue-report')}
              >
                Revenue Report
              </button>
            </div>
          )}
        </div>

        {/* Single Standalone Links */}
        <div className="posa-nav-divider" />

        <button
          type="button"
          className={`posa-nav-single ${adminView === 'appearance' ? 'active' : ''}`}
          onClick={() => setAdminView('appearance')}
        >
          Appearance
        </button>

        <button
          type="button"
          className={`posa-nav-single ${adminView === 'settings' ? 'active' : ''}`}
          onClick={() => setAdminView('settings')}
        >
          Settings
        </button>

        <button
          type="button"
          className={`posa-nav-single ${adminView === 'help' ? 'active' : ''}`}
          onClick={() => setAdminView('help')}
        >
          Help
        </button>
      </nav>

      {/* Bottom Actions (Free trial removed as instructed!) */}
      <div className="posa-sidebar-footer">
        {/* User Card: Menampilkan siapa yang aktif login di Admin */}
        <div className="posa-sidebar-user-card">
          <div className="posa-sidebar-avatar">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="posa-sidebar-user-info">
            <div className="posa-sidebar-user-name">
              {currentUser?.name || 'Ahmad Rafi Hamdi'}
            </div>
            <div className="posa-sidebar-user-role">
              {currentUser?.role || 'Owner'}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="posa-kiosk-trigger-btn"
          onClick={handleOpenKiosk}
        >
          <div className="kiosk-btn-content">
            <Store size={17} />
            <span>Open POS Kiosk</span>
          </div>
          <ChevronRight size={17} />
        </button>

        <button
          type="button"
          className="posa-logout-outline-btn"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span>Logout ({currentUser?.name?.split(' ')[0] || 'Admin'})</span>
        </button>
      </div>
    </aside>
  );
}
