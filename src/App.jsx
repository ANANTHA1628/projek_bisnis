import React from 'react';
import { PosProvider, usePos } from './context/PosContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import TopNav from './components/TopNav';
import KasirView from './views/KasirView';
import DasborView from './views/DasborView';
import StokView from './views/StokView';
import LaporanView from './views/LaporanView';
import AbsensiView from './views/AbsensiView';
import AuthView from './views/AuthView';

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

function PosAppContent() {
  const { activeTab, toast } = usePos();
  const { isAuthenticated, loading, canViewLaporan } = useAuth();

  // Show loading spinner while checking token
  if (loading) {
    return (
      <div className="auth-view-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#f9fafb' }}>
          <div className="auth-logo-badge" style={{ marginBottom: '12px' }}>
            <span className="auth-logo-text" style={{ fontSize: '28px' }}>posa</span>
          </div>
          <p style={{ color: '#9ca3af' }}>Memuat sesi autentikasi...</p>
        </div>
      </div>
    );
  }

  // Show Login / Register if not authenticated
  if (!isAuthenticated) {
    return <AuthView />;
  }

  // Guard: jika karyawan berhasil menavigasi ke 'laporan', redirect ke kasir
  const resolvedTab = (!canViewLaporan && activeTab === 'laporan') ? 'kasir' : activeTab;

  return (
    <div className="pos-app-window">
      {/* Top Application Bar with Navigation Pills */}
      <TopNav />

      {/* Active Tab View - Role Gated */}
      {resolvedTab === 'kasir' && <KasirView />}
      {resolvedTab === 'dasbor' && <DasborView />}
      {resolvedTab === 'stok' && <StokView />}
      {resolvedTab === 'absensi' && <AbsensiView />}
      {resolvedTab === 'laporan' && canViewLaporan && <LaporanView />}

      {/* Modals & Overlays per PRD posa v3.0 */}
      <CustomizeModal />
      <PaymentModal />
      <ReceiptModal />
      <OpenBillsModal />
      <CloseCashierModal />
      <OpenShiftModal />
      <AdminPinModal />
      <MaterialModal />
      <RestockModal />
      <OpnameWasteModal />
      <WhatsAppModal />

      {/* Global Toast Notification */}
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
    <AuthProvider>
      <PosProvider>
        <PosAppContent />
      </PosProvider>
    </AuthProvider>
  );
}
