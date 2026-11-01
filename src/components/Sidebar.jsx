import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
import {
  ChevronDown,
  ChevronRight,
  Store,
  LogOut,
  X
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
    showToast,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = usePos();

  // Accordion state
  const [stockOpen, setStockOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [operationsOpen, setOperationsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const navigateTo = (view) => {
    setAdminView(view);
    setMobileSidebarOpen(false);
  };

  const handleOpenKiosk = () => {
    setMobileSidebarOpen(false);
    setIsKioskMode(true);
    setIsKioskLocked(false);
    showToast('Beralih ke mode POS Kiosk');
  };

  const handleLogout = () => {
    setMobileSidebarOpen(false);
    setLogoutTarget('admin');
    setShowLogoutModal(true);
  };

  return (
    <>
      {mobileSidebarOpen && (
        <div
          className="posa-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside className={`posa-admin-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="posa-sidebar-brand">
          <div className="posa-sidebar-brand-left">
            <span className="posa-brand-title">posa</span>
            <span className="posa-brand-badge">ADMIN</span>
          </div>
          <button
            type="button"
            className="posa-sidebar-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Tutup Menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Scrollable Area */}
        <nav className="posa-sidebar-nav">
          {/* Dashboard */}
          <div className="posa-nav-section">
            <button
              type="button"
              className={`posa-nav-single ${adminView === 'dashboard' ? 'active' : ''}`}
              onClick={() => navigateTo('dashboard')}
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
                  onClick={() => navigateTo('raw-materials')}
                >
                  Raw Materials
                </button>
                <button
                  type="button"
                  className={`posa-subnav-item ${adminView === 'semi-finished' ? 'active' : ''}`}
                  onClick={() => navigateTo('semi-finished')}
                >
                  Semi-Finished Goods
                </button>
                <button
                  type="button"
                  className={`posa-subnav-item ${adminView === 'restock' ? 'active' : ''}`}
                  onClick={() => navigateTo('restock')}
                >
                  Restock
                </button>
                <button
                  type="button"
                  className={`posa-subnav-item ${adminView === 'stock-take' ? 'active' : ''}`}
                  onClick={() => navigateTo('stock-take')}
                >
                  Stock take & waste
                </button>
                <button
                  type="button"
                  className={`posa-subnav-item ${adminView === 'suppliers' ? 'active' : ''}`}
                  onClick={() => navigateTo('suppliers')}
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
                  onClick={() => navigateTo('menus')}
                >
                  Menus
                </button>
                <button
                  type="button"
                  className={`posa-subnav-item ${adminView === 'packages' ? 'active' : ''}`}
                  onClick={() => navigateTo('packages')}
                >
                  Packages
                </button>
                <button
                  type="button"
                  className={`posa-subnav-item ${adminView === 'promos' ? 'active' : ''}`}
                  onClick={() => navigateTo('promos')}
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
                  onClick={() => navigateTo('staff')}
                >
                  Staff
                </button>
                <button
                  type="button"
                  className={`posa-subnav-item ${adminView === 'staff-activity' ? 'active' : ''}`}
                  onClick={() => navigateTo('staff-activity')}
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
                  onClick={() => navigateTo('orders-void')}
                >
                  Orders & Void
                </button>
                <button
                  type="button"
                  className={`posa-subnav-item ${adminView === 'tables' ? 'active' : ''}`}
                  onClick={() => navigateTo('tables')}
                >
                  Tables
                </button>
                <button
                  type="button"
                  className={`posa-subnav-item ${adminView === 'tax-service' ? 'active' : ''}`}
                  onClick={() => navigateTo('tax-service')}
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
                  onClick={() => navigateTo('revenue-report')}
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
            onClick={() => navigateTo('appearance')}
          >
            Appearance
          </button>

          <button
            type="button"
            className={`posa-nav-single ${adminView === 'settings' ? 'active' : ''}`}
            onClick={() => navigateTo('settings')}
          >
            Settings
          </button>

          <button
            type="button"
            className={`posa-nav-single ${adminView === 'help' ? 'active' : ''}`}
            onClick={() => navigateTo('help')}
          >
            Help
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="posa-sidebar-footer">
          {/* User Card */}
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
    </>
  );
}
