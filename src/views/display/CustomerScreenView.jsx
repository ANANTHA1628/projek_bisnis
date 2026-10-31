import React from 'react';
import { usePos } from '../../context/PosContext';
import { Lock, Maximize2, Minimize2 } from 'lucide-react';

export default function CustomerScreenView() {
  const {
    settings,
    setShowLeaveDisplayModal,
    isFullscreen,
    toggleFullscreen
  } = usePos();

  const storeName = settings.store_name || 'Staycy_2026';

  return (
    <div className="posa-display-screen-root customer-view">
      {/* Header bar */}
      <header className="posa-customer-header">
        <h1 className="posa-customer-store-title">{storeName}</h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="posa-display-icon-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            type="button"
            className="posa-display-icon-btn"
            onClick={() => setShowLeaveDisplayModal(true)}
            title="Leave display mode (Requires PIN)"
          >
            <Lock size={16} />
          </button>
        </div>
      </header>

      {/* Main split content: Being prepared & Ready — please collect */}
      <div className="posa-customer-split">
        {/* Left Column: Being prepared */}
        <div className="posa-customer-col being-prepared">
          <h2 className="posa-customer-col-title gray">Being prepared</h2>
          <div className="posa-customer-numbers-grid">
            {/* When orders are cooking, queue numbers show here */}
          </div>
        </div>

        {/* Right Column: Ready — please collect */}
        <div className="posa-customer-col ready-collect">
          <h2 className="posa-customer-col-title blue">Ready — please collect</h2>
          <div className="posa-customer-empty-msg">
            Your number appears here when your order is ready.
          </div>
        </div>
      </div>
    </div>
  );
}
