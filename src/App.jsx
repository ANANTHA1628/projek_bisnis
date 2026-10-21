import React from 'react';
import { PosProvider, usePos } from './context/PosContext';
import TopNav from './components/TopNav';
import KasirView from './views/KasirView';
import DasborView from './views/DasborView';
import StokView from './views/StokView';
import LaporanView from './views/LaporanView';

// Modals
import CustomizeModal from './components/modals/CustomizeModal';
import PaymentModal from './components/modals/PaymentModal';
import ReceiptModal from './components/modals/ReceiptModal';
import OpenBillsModal from './components/modals/OpenBillsModal';
import CloseCashierModal from './components/modals/CloseCashierModal';
import MaterialModal from './components/modals/MaterialModal';
import RestockModal from './components/modals/RestockModal';
import WhatsAppModal from './components/modals/WhatsAppModal';

function PosAppContent() {
  const { activeTab, toast } = usePos();

  return (
    <div className="pos-app-window">
      {/* Top Application Bar with macOS Window Dots & Centered Navigation Pills */}
      <TopNav />

      {/* Active Tab View */}
      {activeTab === 'kasir' && <KasirView />}
      {activeTab === 'dasbor' && <DasborView />}
      {activeTab === 'stok' && <StokView />}
      {activeTab === 'laporan' && <LaporanView />}

      {/* Modals & Overlays */}
      <CustomizeModal />
      <PaymentModal />
      <ReceiptModal />
      <OpenBillsModal />
      <CloseCashierModal />
      <MaterialModal />
      <RestockModal />
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
    <PosProvider>
      <PosAppContent />
    </PosProvider>
  );
}
