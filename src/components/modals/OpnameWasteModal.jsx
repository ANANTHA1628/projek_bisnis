import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, ClipboardCheck, Trash2 } from 'lucide-react';

export default function OpnameWasteModal() {
  const {
    showOpnameModal,
    setShowOpnameModal,
    showWasteModal,
    setShowWasteModal,
    rawMaterials,
    recordOpname,
    recordWaste
  } = usePos();

  const isOpen = showOpnameModal || showWasteModal;
  const isWasteMode = Boolean(showWasteModal);

  const [selectedId, setSelectedId] = useState(rawMaterials[0]?.id || 'biji-kopi-arabika');
  const [physicalCount, setPhysicalCount] = useState(0);
  const [wasteAmount, setWasteAmount] = useState(1);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const currentItem = rawMaterials.find((m) => m.id === selectedId) || rawMaterials[0];
  const diff = physicalCount - (currentItem?.stock || 0);

  const handleClose = () => {
    setShowOpnameModal(false);
    setShowWasteModal(false);
    setReason('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    if (isWasteMode) {
      recordWaste(selectedId, wasteAmount, reason);
    } else {
      recordOpname(selectedId, physicalCount, reason);
    }
    handleClose();
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isWasteMode ? <Trash2 size={18} color="#ef4444" /> : <ClipboardCheck size={18} color="#3b82f6" />}
            <span className="modal-title">
              {isWasteMode ? 'Catat Buang Bahan (Waste)' : 'Stok Opname (Hitung Fisik)'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Pilih Bahan Baku
              </label>
              <select
                className="kasir-search-input"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  const found = rawMaterials.find((m) => m.id === e.target.value);
                  if (found) setPhysicalCount(found.stock);
                }}
              >
                {rawMaterials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Stok Sistem: {m.stock} {m.unit})
                  </option>
                ))}
              </select>
            </div>

            {!isWasteMode ? (
              <>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Hasil Hitungan Fisik Riil ({currentItem?.unit})
                  </label>
                  <input
                    type="number"
                    className="kasir-search-input"
                    value={physicalCount}
                    onChange={(e) => setPhysicalCount(Number(e.target.value))}
                    required
                    step="any"
                  />
                </div>

                <div
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#162033',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12.5px'
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Selisih Fisik vs Sistem:</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: diff === 0 ? '#10b981' : diff > 0 ? '#60a5fa' : '#ef4444'
                    }}
                  >
                    {diff > 0 ? `+${diff}` : diff} {currentItem?.unit}
                  </span>
                </div>
              </>
            ) : (
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Jumlah Bahan Dibuang ({currentItem?.unit})
                </label>
                <input
                  type="number"
                  className="kasir-search-input"
                  value={wasteAmount}
                  onChange={(e) => setWasteAmount(Number(e.target.value))}
                  required
                  min={0.1}
                  step="any"
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Alasan Wajib (Audit Log)
              </label>
              <textarea
                className="kasir-search-input"
                rows={2}
                placeholder={isWasteMode ? 'Contoh: Susu basi / tumpah saat kalibrasi' : 'Contoh: Kalibrasi timbangan mingguan'}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="tutup-kasir-btn" onClick={handleClose}>
              Batal
            </button>
            <button
              type="submit"
              className="buat-laporan-btn"
              style={{ backgroundColor: isWasteMode ? '#ef4444' : undefined }}
            >
              {isWasteMode ? 'Catat Waste' : 'Simpan Opname'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
