import React, { useState, useRef, useEffect } from 'react';
import { usePos } from '../context/PosContext';
import {
  LayoutDashboard,
  Boxes,
  UtensilsCrossed,
  Users,
  SlidersHorizontal,
  FileBarChart,
  Palette,
  Settings,
  HelpCircle,
  Store,
  LogOut,
  ChevronDown,
  Maximize2,
  Minimize2,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function TopNavbar() {
  const {
    adminView,
    setAdminView,
    setIsKioskMode,
    setIsKioskLocked,
    currentUser,
    setShowLogoutModal,
    setLogoutTarget,
    showToast,
    isFullscreen,
    toggleFullscreen,
    language,
    setLanguage,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    currentShift,
    themeSettings
  } = usePos();

  const [activeDropdown, setActiveDropdown] = useState(null); // 'stock' | 'menu' | 'staff' | 'ops' | 'reports' | 'user' | null
  const navRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = (view) => {
    setAdminView(view);
    setActiveDropdown(null);
    setMobileSidebarOpen(false);
  };

  const handleOpenKiosk = () => {
    setActiveDropdown(null);
    setMobileSidebarOpen(false);
    setIsKioskMode(true);
    setIsKioskLocked(false);
    showToast('Beralih ke mode POS Kiosk');
  };

  const handleLogout = () => {
    setActiveDropdown(null);
    setMobileSidebarOpen(false);
    setLogoutTarget('admin');
    setShowLogoutModal(true);
  };

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Check which group is active
  const isStockActive = ['raw-materials', 'semi-finished', 'restock', 'stock-take', 'suppliers'].includes(adminView);
  const isMenuActive = ['menus', 'packages', 'promos'].includes(adminView);
  const isStaffActive = ['staff', 'staff-activity'].includes(adminView);
  const isOpsActive = ['orders-void', 'tables', 'tax-service'].includes(adminView);
  const isReportsActive = ['revenue-report'].includes(adminView);

  return (
    <header className="posa-top-navbar" ref={navRef}>
      <div className="posa-top-navbar-container">
        {/* Left: Brand Logo & Kiosk Shortcut */}
        <div className="posa-navbar-left">
          <button
            type="button"
            className="posa-mobile-menu-btn"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="posa-navbar-brand" onClick={() => navigateTo('dashboard')} role="button">
            <span className="posa-brand-title">posa</span>
          </div>

          <button
            type="button"
            className="posa-kiosk-pill-btn"
            onClick={handleOpenKiosk}
            title="Masuk ke Layar Kasir Kiosk"
          >
            <Store size={14} />
            <span>POS Kiosk</span>
          </button>
        </div>

        {/* Center: Desktop Navigation Bar with Modern Floating Tabs & Dropdowns */}
        <nav className="posa-navbar-nav">
          {/* 1. Dashboard */}
          <button
            type="button"
            className={`posa-nav-tab ${adminView === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigateTo('dashboard')}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          {/* 2. Stock Dropdown */}
          <div className="posa-nav-dropdown-wrapper">
            <button
              type="button"
              className={`posa-nav-tab ${isStockActive ? 'active' : ''} ${activeDropdown === 'stock' ? 'open' : ''}`}
              onClick={() => toggleDropdown('stock')}
            >
              <Boxes size={15} />
              <span>Stok & Bahan</span>
              <ChevronDown size={13} className={`chevron-indicator ${activeDropdown === 'stock' ? 'rotate' : ''}`} />
            </button>

            {activeDropdown === 'stock' && (
              <div className="posa-nav-dropdown-menu">
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'raw-materials' ? 'active' : ''}`}
                  onClick={() => navigateTo('raw-materials')}
                >
                  <span className="item-title">Raw Materials</span>
                  <span className="item-sub">Bahan mentah & master stok</span>
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'semi-finished' ? 'active' : ''}`}
                  onClick={() => navigateTo('semi-finished')}
                >
                  <span className="item-title">Semi-Finished Goods</span>
                  <span className="item-sub">Bahan setengah jadi & batch</span>
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'restock' ? 'active' : ''}`}
                  onClick={() => navigateTo('restock')}
                >
                  <span className="item-title">Restock</span>
                  <span className="item-sub">Input faktur & belanja bahan</span>
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'stock-take' ? 'active' : ''}`}
                  onClick={() => navigateTo('stock-take')}
                >
                  <span className="item-title">Stock Take & Waste</span>
                  <span className="item-sub">Hitung fisik opname & buang bahan</span>
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'suppliers' ? 'active' : ''}`}
                  onClick={() => navigateTo('suppliers')}
                >
                  <span className="item-title">Suppliers</span>
                  <span className="item-sub">Vendor & kontak pemasok</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Menu Dropdown */}
          <div className="posa-nav-dropdown-wrapper">
            <button
              type="button"
              className={`posa-nav-tab ${isMenuActive ? 'active' : ''} ${activeDropdown === 'menu' ? 'open' : ''}`}
              onClick={() => toggleDropdown('menu')}
            >
              <UtensilsCrossed size={15} />
              <span>Menu & Resep</span>
              <ChevronDown size={13} className={`chevron-indicator ${activeDropdown === 'menu' ? 'rotate' : ''}`} />
            </button>

            {activeDropdown === 'menu' && (
              <div className="posa-nav-dropdown-menu">
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'menus' ? 'active' : ''}`}
                  onClick={() => navigateTo('menus')}
                >
                  <span className="item-title">Menus</span>
                  <span className="item-sub">Daftar produk, harga & takaran</span>
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'packages' ? 'active' : ''}`}
                  onClick={() => navigateTo('packages')}
                >
                  <span className="item-title">Packages</span>
                  <span className="item-sub">Paket bundling hemat</span>
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'promos' ? 'active' : ''}`}
                  onClick={() => navigateTo('promos')}
                >
                  <span className="item-title">Promos</span>
                  <span className="item-sub">Diskon & voucher pelanggan</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Staff Dropdown */}
          <div className="posa-nav-dropdown-wrapper">
            <button
              type="button"
              className={`posa-nav-tab ${isStaffActive ? 'active' : ''} ${activeDropdown === 'staff' ? 'open' : ''}`}
              onClick={() => toggleDropdown('staff')}
            >
              <Users size={15} />
              <span>Staff</span>
              <ChevronDown size={13} className={`chevron-indicator ${activeDropdown === 'staff' ? 'rotate' : ''}`} />
            </button>

            {activeDropdown === 'staff' && (
              <div className="posa-nav-dropdown-menu">
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'staff' ? 'active' : ''}`}
                  onClick={() => navigateTo('staff')}
                >
                  <span className="item-title">Staff Management</span>
                  <span className="item-sub">Kelola pegawai, role & PIN</span>
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'staff-activity' ? 'active' : ''}`}
                  onClick={() => navigateTo('staff-activity')}
                >
                  <span className="item-title">Staff Activity Logs</span>
                  <span className="item-sub">Catatan log aktivitas kasir</span>
                </button>
              </div>
            )}
          </div>

          {/* 5. Operations Dropdown */}
          <div className="posa-nav-dropdown-wrapper">
            <button
              type="button"
              className={`posa-nav-tab ${isOpsActive ? 'active' : ''} ${activeDropdown === 'ops' ? 'open' : ''}`}
              onClick={() => toggleDropdown('ops')}
            >
              <SlidersHorizontal size={15} />
              <span>Operasional</span>
              <ChevronDown size={13} className={`chevron-indicator ${activeDropdown === 'ops' ? 'rotate' : ''}`} />
            </button>

            {activeDropdown === 'ops' && (
              <div className="posa-nav-dropdown-menu">
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'orders-void' ? 'active' : ''}`}
                  onClick={() => navigateTo('orders-void')}
                >
                  <span className="item-title">Orders & Void</span>
                  <span className="item-sub">Riwayat transaksi & pembatalan</span>
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'tables' ? 'active' : ''}`}
                  onClick={() => navigateTo('tables')}
                >
                  <span className="item-title">Tables Management</span>
                  <span className="item-sub">Denah meja & status pesanan</span>
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'tax-service' ? 'active' : ''}`}
                  onClick={() => navigateTo('tax-service')}
                >
                  <span className="item-title">Tax & Service Charge</span>
                  <span className="item-sub">Tarif PB1 10% & biaya servis</span>
                </button>
              </div>
            )}
          </div>

          {/* 6. Reports */}
          <button
            type="button"
            className={`posa-nav-tab ${adminView === 'revenue-report' ? 'active' : ''}`}
            onClick={() => navigateTo('revenue-report')}
          >
            <FileBarChart size={15} />
            <span>Laporan</span>
          </button>
        </nav>

        {/* Right: Quick Tools & User Profile Dropdown */}
        <div className="posa-navbar-right">
          {/* Fullscreen Button */}
          <button
            type="button"
            className="posa-navbar-icon-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Language Switcher */}
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

          {/* User Profile Pill & Dropdown */}
          <div className="posa-nav-dropdown-wrapper">
            <button
              type="button"
              className={`posa-user-profile-pill badge-style-${themeSettings?.cashierBadgeStyle || 'pill-avatar'}`}
              onClick={() => toggleDropdown('user')}
            >
              <div className="posa-user-avatar">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="posa-user-info-text">
                <span className="posa-user-name">{currentUser?.name || 'Ahmad Rafi'}</span>
                <span className="posa-user-role-tag">
                  <span className="posa-role-dot" />
                  <span>{currentUser?.role || 'Owner'}</span>
                </span>
              </div>
              <ChevronDown size={13} className={`chevron-indicator ${activeDropdown === 'user' ? 'rotate' : ''}`} />
            </button>

            {activeDropdown === 'user' && (
              <div className="posa-nav-dropdown-menu posa-user-dropdown-menu">
                <div className="user-dropdown-header">
                  <div className="name">{currentUser?.name || 'Ahmad Rafi Hamdi'}</div>
                  <div className="role">{currentUser?.role || 'Owner'} • {currentShift.isOpen ? 'Shift Aktif' : 'Shift Tutup'}</div>
                </div>

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'appearance' ? 'active' : ''}`}
                  onClick={() => navigateTo('appearance')}
                >
                  <Palette size={15} />
                  <span>Appearance & Tema</span>
                </button>

                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'settings' ? 'active' : ''}`}
                  onClick={() => navigateTo('settings')}
                >
                  <Settings size={15} />
                  <span>Company Settings</span>
                </button>

                <button
                  type="button"
                  className={`dropdown-item ${adminView === 'help' ? 'active' : ''}`}
                  onClick={() => navigateTo('help')}
                >
                  <HelpCircle size={15} />
                  <span>Help & Documentation</span>
                </button>

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Keluar / Disconnect</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (When hamburger clicked on mobile) */}
      {mobileSidebarOpen && (
        <div className="posa-mobile-nav-drawer">
          <div className="mobile-drawer-content">
            <div className="mobile-drawer-section">
              <span className="section-label">MAIN</span>
              <button
                type="button"
                className={`drawer-link ${adminView === 'dashboard' ? 'active' : ''}`}
                onClick={() => navigateTo('dashboard')}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>
              <button
                type="button"
                className="drawer-link kiosk-highlight"
                onClick={handleOpenKiosk}
              >
                <Store size={16} />
                <span>Buka POS Kiosk Kasir</span>
              </button>
            </div>

            <div className="mobile-drawer-section">
              <span className="section-label">STOK & BAHAN</span>
              <button
                type="button"
                className={`drawer-link ${adminView === 'raw-materials' ? 'active' : ''}`}
                onClick={() => navigateTo('raw-materials')}
              >
                Raw Materials
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'semi-finished' ? 'active' : ''}`}
                onClick={() => navigateTo('semi-finished')}
              >
                Semi-Finished Goods
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'restock' ? 'active' : ''}`}
                onClick={() => navigateTo('restock')}
              >
                Restock
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'stock-take' ? 'active' : ''}`}
                onClick={() => navigateTo('stock-take')}
              >
                Stock Take & Waste
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'suppliers' ? 'active' : ''}`}
                onClick={() => navigateTo('suppliers')}
              >
                Suppliers
              </button>
            </div>

            <div className="mobile-drawer-section">
              <span className="section-label">MENU & RESEP</span>
              <button
                type="button"
                className={`drawer-link ${adminView === 'menus' ? 'active' : ''}`}
                onClick={() => navigateTo('menus')}
              >
                Menus
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'packages' ? 'active' : ''}`}
                onClick={() => navigateTo('packages')}
              >
                Packages
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'promos' ? 'active' : ''}`}
                onClick={() => navigateTo('promos')}
              >
                Promos
              </button>
            </div>

            <div className="mobile-drawer-section">
              <span className="section-label">OPERASIONAL & LAPORAN</span>
              <button
                type="button"
                className={`drawer-link ${adminView === 'orders-void' ? 'active' : ''}`}
                onClick={() => navigateTo('orders-void')}
              >
                Orders & Void
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'tables' ? 'active' : ''}`}
                onClick={() => navigateTo('tables')}
              >
                Tables
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'tax-service' ? 'active' : ''}`}
                onClick={() => navigateTo('tax-service')}
              >
                Tax & Service
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'revenue-report' ? 'active' : ''}`}
                onClick={() => navigateTo('revenue-report')}
              >
                Revenue Report
              </button>
            </div>

            <div className="mobile-drawer-section">
              <span className="section-label">SISTEM & AKUN</span>
              <button
                type="button"
                className={`drawer-link ${adminView === 'staff' ? 'active' : ''}`}
                onClick={() => navigateTo('staff')}
              >
                Staff Management
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'appearance' ? 'active' : ''}`}
                onClick={() => navigateTo('appearance')}
              >
                Appearance & Tema
              </button>
              <button
                type="button"
                className={`drawer-link ${adminView === 'settings' ? 'active' : ''}`}
                onClick={() => navigateTo('settings')}
              >
                Settings
              </button>
              <button
                type="button"
                className="drawer-link text-danger"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
