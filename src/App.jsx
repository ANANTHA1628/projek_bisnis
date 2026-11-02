import React, { useEffect } from 'react';
import { PosProvider, usePos } from './context/PosContext';
import ErrorBoundary from './components/ErrorBoundary';

// Admin Top Navbar
import TopNavbar from './components/TopNavbar';

// POS Kiosk views
import KioskLockView from './views/KioskLockView';
import KasirView from './views/KasirView';
import AuthMasterView from './views/AuthMasterView';

// Display mode screens (From example/ screenshots)
import KitchenScreenView from './views/display/KitchenScreenView';
import CustomerScreenView from './views/display/CustomerScreenView';

// Admin views
import DashboardView from './views/admin/DashboardView';
import RawMaterialsView from './views/admin/RawMaterialsView';
import SemiFinishedView from './views/admin/SemiFinishedView';
import RestockView from './views/admin/RestockView';
import StockTakeWasteView from './views/admin/StockTakeWasteView';
import SuppliersView from './views/admin/SuppliersView';
import MenusView from './views/admin/MenusView';
import PackagesView from './views/admin/PackagesView';
import PromosView from './views/admin/PromosView';
import StaffView from './views/admin/StaffView';
import StaffActivityView from './views/admin/StaffActivityView';
import OrdersVoidView from './views/admin/OrdersVoidView';
import TablesView from './views/admin/TablesView';
import TaxServiceView from './views/admin/TaxServiceView';
import RevenueReportView from './views/admin/RevenueReportView';
import AppearanceView from './views/admin/AppearanceView';
import CompanySettingsView from './views/admin/CompanySettingsView';
import HelpView from './views/admin/HelpView';
import DeveloperView from './views/admin/DeveloperView';

// Modals
import CustomizeModal from './components/modals/CustomizeModal';
import PaymentModal from './components/modals/PaymentModal';
import ReceiptModal from './components/modals/ReceiptModal';
import OpenBillsModal from './components/modals/OpenBillsModal';
import CloseCashierModal from './components/modals/CloseCashierModal';
import OpenShiftModal from './components/modals/OpenShiftModal';
import AdminPinModal from './components/modals/AdminPinModal';
import MaterialModal from './components/modals/MaterialModal';
import RestockModal from './components/modals/RestockModal';
import OpnameWasteModal from './components/modals/OpnameWasteModal';
import WhatsAppModal from './components/modals/WhatsAppModal';
import LogoutModal from './components/modals/LogoutModal';
import DisplayModeModal from './components/modals/DisplayModeModal';
import LeaveDisplayModal from './components/modals/LeaveDisplayModal';

function PosAppContent() {
  const {
    isKioskMode,
    isKioskLocked,
    displayMode,
    adminView,
    setAdminView,
    currentUser,
    masterAccount,
    showMasterAuthScreen,
    setShowMasterAuthScreen,
    isImpersonatingByDev,
    exitImpersonation,
    showToast,
    toast
  } = usePos();

  // Proteksi Akses Developer Console: Tolak jika bukan Developer Root
  useEffect(() => {
    if (adminView === 'developer' && currentUser?.role !== 'Developer' && !isImpersonatingByDev) {
      setAdminView('dashboard');
      showToast('Akses ditolak: Menu Developer hanya dapat diakses oleh Developer Superadmin.', 'warning');
    }
  }, [adminView, currentUser, isImpersonatingByDev, setAdminView, showToast]);

  // 0. If Master Account is not yet created or user explicitly opened Master Auth screen (kecuali Developer)
  if ((showMasterAuthScreen || !masterAccount) && currentUser?.role !== 'Developer') {
    return (
      <div className="posa-app-root">
        <AuthMasterView
          defaultMode={masterAccount ? 'login' : 'register'}
          onSwitchToPin={masterAccount ? () => setShowMasterAuthScreen(false) : undefined}
        />
        {toast && <div className="toast-floating-container">{toast.message}</div>}
      </div>
    );
  }

  // 1. If in Dedicated Display Mode (Kitchen Screen / Customer Screen TV)
  if (displayMode === 'kitchen') {
    return (
      <div className="posa-app-root">
        <KitchenScreenView />
        <LeaveDisplayModal />
        {toast && <div className="toast-floating-container">{toast.message}</div>}
      </div>
    );
  }

  if (displayMode === 'customer') {
    return (
      <div className="posa-app-root">
        <CustomerScreenView />
        <LeaveDisplayModal />
        {toast && <div className="toast-floating-container">{toast.message}</div>}
      </div>
    );
  }

  // 2. If in POS Kiosk Mode:
  if (isKioskMode) {
    return (
      <div className="posa-app-root">
        {/* Ribbon Impersonasi Developer jika sedang menyamar sebagai staf/kasir */}
        {isImpersonatingByDev && (
          <div
            style={{
              backgroundColor: '#854d0e',
              color: '#fef08a',
              borderBottom: '1px solid #eab308',
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 9999
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span>
              <span>
                Mode Impersonasi Developer: Masuk sebagai <strong>{currentUser?.name}</strong> ({currentUser?.role})
              </span>
            </div>
            <button
              type="button"
              onClick={exitImpersonation}
              style={{
                backgroundColor: '#eab308',
                color: '#000000',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Kembali ke Developer Console ➔
            </button>
          </div>
        )}

        {isKioskLocked ? <KioskLockView /> : <KasirView />}

        {/* Cashier Modals */}
        <CustomizeModal />
        <PaymentModal />
        <ReceiptModal />
        <OpenBillsModal />
        <CloseCashierModal />
        <OpenShiftModal />
        <AdminPinModal />
        <LogoutModal />
        <DisplayModeModal />

        {/* Global Toast */}
        {toast && (
          <div className="toast-floating-container">
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  // 3. Admin Dashboard Mode (Modern Top Navigation Bar Layout)
  return (
    <div className="posa-app-root posa-admin-top-layout">
      {/* Ribbon Impersonasi Developer jika sedang menyamar sebagai Owner */}
      {isImpersonatingByDev && (
        <div
          style={{
            backgroundColor: '#854d0e',
            color: '#fef08a',
            borderBottom: '1px solid #eab308',
            padding: '8px 24px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99999
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👑</span>
            <span>
              Mode Impersonasi Developer: Sedang mengelola toko sebagai Owner <strong>{currentUser?.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={exitImpersonation}
            style={{
              backgroundColor: '#eab308',
              color: '#000000',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 14px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Kembali ke Developer Console ➔
          </button>
        </div>
      )}

      {/* Modern Top Navbar */}
      <TopNavbar />

      {/* Main Content Area */}
      <main className="posa-admin-main-content">
        {adminView === 'dashboard' && <DashboardView />}
        {adminView === 'raw-materials' && <RawMaterialsView />}
        {adminView === 'semi-finished' && <SemiFinishedView />}
        {adminView === 'restock' && <RestockView />}
        {adminView === 'stock-take' && <StockTakeWasteView />}
        {adminView === 'suppliers' && <SuppliersView />}
        {adminView === 'menus' && <MenusView />}
        {adminView === 'packages' && <PackagesView />}
        {adminView === 'promos' && <PromosView />}
        {adminView === 'staff' && <StaffView />}
        {adminView === 'staff-activity' && <StaffActivityView />}
        {adminView === 'orders-void' && <OrdersVoidView />}
        {adminView === 'tables' && <TablesView />}
        {adminView === 'tax-service' && <TaxServiceView />}
        {adminView === 'revenue-report' && <RevenueReportView />}
        {adminView === 'appearance' && <AppearanceView />}
        {adminView === 'settings' && <CompanySettingsView />}
        {adminView === 'help' && <HelpView />}
        {adminView === 'developer' && (currentUser?.role === 'Developer' || isImpersonatingByDev) && <DeveloperView />}
      </main>

      {/* Global Modals */}
      <MaterialModal />
      <RestockModal />
      <OpnameWasteModal />
      <WhatsAppModal />
      <LogoutModal />
      <DisplayModeModal />

      {/* Toast Notification */}
      {toast && (
        <div className="toast-floating-container">
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PosProvider>
        <PosAppContent />
      </PosProvider>
    </ErrorBoundary>
  );
}
