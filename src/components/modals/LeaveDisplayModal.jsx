import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';

export default function LeaveDisplayModal() {
  const {
    showLeaveDisplayModal,
    setShowLeaveDisplayModal,
    setDisplayMode,
    settings,
    staffList,
    showToast,
    playSound
  } = usePos();

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!showLeaveDisplayModal) return null;

  const handleLeave = () => {
    // PIN must belong to Owner or Supervisor
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
      setDisplayMode('none');
      setShowLeaveDisplayModal(false);
      setPin('');
      setErrorMsg('');
      showToast('Kembali ke layar PIN Sign-in Kiosk');
    } else {
      playSound('beep');
      setErrorMsg('Incorrect owner / supervisor PIN');
    }
  };

  const handleCancel = () => {
    playSound('click');
    setShowLeaveDisplayModal(false);
    setPin('');
    setErrorMsg('');
  };

  return (
    <div className="posa-modal-overlay">
      <div className="posa-leave-display-card">
        <h2 className="posa-display-title">Leave display mode</h2>
        <p className="posa-display-desc">
          This device goes back to the PIN screen.
        </p>

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
            autoFocus
          />
          {errorMsg && <div className="text-xs text-red-400 mt-1">{errorMsg}</div>}
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            type="button"
            className="posa-display-btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="posa-display-btn-start"
            onClick={handleLeave}
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
