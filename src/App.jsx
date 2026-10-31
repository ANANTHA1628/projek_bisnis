import React from 'react';
import { PosProvider, usePos } from './context/PosContext';

// Admin Sidebar
import Sidebar from './components/Sidebar';

// POS Kiosk views
import KioskLockView from './views/KioskLockView';
import KasirView from './views/KasirView';

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
    toast
  } = usePos();

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

  // 3. Admin Dashboard Mode (Exact layout from example screenshots)
  return (
    <div className="posa-app-root posa-admin-layout">
      {/* Sidebar with Navigation (Free trial removed!) */}
      <Sidebar />

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
    <PosProvider>
      <PosAppContent />
    </PosProvider>
  );
}
