import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, Plus, PackageCheck } from 'lucide-react';

export default function RestockModal() {
  const {
    showRestockModal,
    setShowRestockModal,
    rawMaterials,
    restockRawMaterial,
    showToast
  } = usePos();

  const [selectedId, setSelectedId] = useState('gula-aren-cair');
  const [amount, setAmount] = useState(500);

  if (!showRestockModal) return null;

  const lowStockItems = rawMaterials.filter((m) => m.stock <= m.minStock);
  const currentItem = rawMaterials.find((m) => m.id === selectedId) || rawMaterials[0];

  const handleRestock = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    restockRawMaterial(selectedId, Number(amount));
    setShowRestockModal(false);
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PackageCheck size={18} color="#60a5fa" />
            <span className="modal-title">Restock Bahan Baku</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setShowRestockModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleRestock}>
          <div className="modal-body">
            {lowStockItems.length > 0 && (
              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  fontSize: '12px',
                  color: '#fbbf24'
                }}
              >
                Terdapat <strong>{lowStockItems.length} bahan</strong> di bawah stok minimum!
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Pilih Bahan
              </label>
              <select
                className="kasir-search-input"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {rawMaterials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Stok: {m.stock} {m.unit}) {m.stock <= m.minStock ? '⚠️' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Jumlah Tambahan ({currentItem?.unit})
              </label>
              <input
                type="number"
                className="kasir-search-input"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                min={1}
              />
            </div>

            {/* Quick buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[10, 50, 100, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  className="preset-pill"
                  style={{ fontSize: '12px', padding: '5px 10px' }}
                  onClick={() => setAmount(val)}
                >
                  +{val} {currentItem?.unit}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="tutup-kasir-btn"
              onClick={() => setShowRestockModal(false)}
            >
              Batal
            </button>
            <button type="submit" className="buat-laporan-btn">
              Simpan Tambah Stok
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
