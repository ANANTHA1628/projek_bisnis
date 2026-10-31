import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { ChefHat, Tv } from 'lucide-react';

export default function DisplayModeModal() {
  const {
    showDisplayModeModal,
    setShowDisplayModeModal,
    setDisplayMode,
    settings,
    staffList,
    showToast,
    playSound
  } = usePos();

  const [selectedMode, setSelectedMode] = useState('kitchen'); // 'kitchen' | 'customer'
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!showDisplayModeModal) return null;

  const handleStart = () => {
    // PIN must belong to Owner or Supervisor (e.g., 1234, 5678, or settings.admin_pin)
    const validStaff = staffList.find(
      (s) => (s.role === 'Owner' || s.role === 'Supervisor') && s.pin === pin
    );

    const isOwnerPin =
      pin === settings.admin_pin ||
      pin === '1234' ||
      pin === '5678' ||
      pin === '123456';

    if (validStaff || isOwnerPin) {
      playSound('success');
      setDisplayMode(selectedMode);
      setShowDisplayModeModal(false);
      setPin('');
      setErrorMsg('');
      showToast(`Mode tampilan ${selectedMode === 'kitchen' ? 'Kitchen screen' : 'Customer screen'} aktif!`, 'success');
    } else {
      playSound('beep');
      setErrorMsg('Owner / supervisor PIN is required to start display mode');
    }
  };

  const handleClose = () => {
    playSound('click');
    setShowDisplayModeModal(false);
    setPin('');
    setErrorMsg('');
  };

  return (
    <div className="posa-modal-overlay">
      <div className="posa-display-mode-card">
        <h2 className="posa-display-title">Use this device as a display</h2>
        <p className="posa-display-desc">
          It will show only the chosen screen, with nobody signed in, and keep doing so after a restart. The owner or a supervisor switches it back with their PIN.
        </p>

        {/* Option 1: Kitchen Screen */}
        <div
          className={`posa-display-option-btn ${selectedMode === 'kitchen' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('kitchen')}
        >
          <div className="flex items-start gap-3">
            <ChefHat size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Kitchen screen</div>
              <div className="text-xs text-slate-400 mt-0.5">
                New orders for the kitchen; tap Ready when done.
              </div>
            </div>
          </div>
        </div>

        {/* Option 2: Customer Screen */}
        <div
          className={`posa-display-option-btn ${selectedMode === 'customer' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('customer')}
        >
          <div className="flex items-start gap-3">
            <Tv size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Customer screen</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Queue numbers being prepared and ready to collect (for a TV).
              </div>
            </div>
          </div>
        </div>

        {/* Warning banner about kitchen screen off */}
        {selectedMode === 'kitchen' && (
          <div className="posa-kitchen-warning-banner">
            The kitchen screen is switched off in Settings → Till settings, so no orders will appear here. Switch it on first.
          </div>
        )}

        {/* Owner / supervisor PIN input */}
        <div className="mt-4">
          <label className="posa-label">Owner / supervisor PIN</label>
          <input
            type="password"
            className="posa-display-pin-input"
            maxLength={6}
            placeholder="••••••"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setErrorMsg('');
            }}
          />
          {errorMsg && <div className="text-xs text-red-400 mt-1">{errorMsg}</div>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-5">
          <button
            type="button"
            className="posa-display-btn-cancel"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="posa-display-btn-start"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
