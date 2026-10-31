import React from 'react';
import { usePos } from '../../context/PosContext';
import { Lock, ChefHat, Volume2, Monitor } from 'lucide-react';

export default function KitchenScreenView() {
  const { setShowLeaveDisplayModal, setDisplayMode, showToast } = usePos();

  return (
    <div className="posa-display-screen-root">
      {/* Top Header */}
      <header className="posa-display-screen-header">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="posa-display-icon-btn"
            onClick={() => setShowLeaveDisplayModal(true)}
            title="Leave display mode (Requires PIN)"
          >
            <Lock size={16} />
          </button>
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <ChefHat size={18} className="text-blue-400" />
            <span>Kitchen screen</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="posa-display-icon-btn"
            onClick={() => showToast('Suara notifikasi dapur diuji')}
            title="Test notification sound"
          >
            <Volume2 size={16} />
          </button>

          <button
            type="button"
            className="posa-display-pill-btn"
            onClick={() => setDisplayMode('customer')}
          >
            <Monitor size={15} />
            <span>Customer screen</span>
          </button>
        </div>
      </header>

      {/* Banner */}
      <div className="posa-display-warning-strip">
        The kitchen screen is off. The owner can switch it on in Settings → Till settings.
      </div>

      {/* Split Columns: BEING MADE & READY */}
      <div className="posa-display-split-columns">
        <div className="posa-display-col">
          <h3 className="posa-display-col-title">BEING MADE (0)</h3>
          <div className="posa-display-empty-text">
            No orders waiting. New ones appear here by themselves.
          </div>
        </div>

        <div className="posa-display-col">
          <h3 className="posa-display-col-title">READY (0)</h3>
          <div className="posa-display-empty-text">
            Nothing waiting to be picked up.
          </div>
        </div>
      </div>
    </div>
  );
}
