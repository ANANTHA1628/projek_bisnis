import React, { useState, useEffect } from 'react';
import { usePos } from '../../context/PosContext';
import { X } from 'lucide-react';

export default function MaterialModal() {
  const { materialModalData, setMaterialModalData, saveRawMaterial } = usePos();

  const [name, setName] = useState('');
  const [stock, setStock] = useState(0);
  const [unit, setUnit] = useState('gram');
  const [avgPrice, setAvgPrice] = useState(0);
  const [minStock, setMinStock] = useState(100);

  useEffect(() => {
    if (materialModalData) {
      setName(materialModalData.name || '');
      setStock(materialModalData.stock || 0);
      setUnit(materialModalData.unit || 'gram');
      setAvgPrice(materialModalData.avgPrice || 0);
      setMinStock(materialModalData.minStock || 100);
    }
  }, [materialModalData]);

  if (!materialModalData) return null;

  const isEditing = Boolean(materialModalData.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveRawMaterial({
      ...(isEditing ? { id: materialModalData.id } : {}),
      name: name.trim(),
      stock: Number(stock),
      unit,
      avgPrice: Number(avgPrice),
      minStock: Number(minStock)
    });
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div className="modal-title">
            {isEditing ? `Edit Bahan: ${materialModalData.name}` : 'Tambah Bahan Baku Baru'}
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setMaterialModalData(null)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Nama Bahan Baku
              </label>
              <input
                type="text"
                className="kasir-search-input"
                placeholder="Contoh: Sirup Karamel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Jumlah Stok Saat Ini
                </label>
                <input
                  type="number"
                  className="kasir-search-input"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Satuan
                </label>
                <select
                  className="kasir-search-input"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="gram">gram</option>
                  <option value="ml">ml</option>
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                  <option value="liter">liter</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Harga Rata-rata (Rp)
                </label>
                <input
                  type="number"
                  className="kasir-search-input"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Stok Minimum
                </label>
                <input
                  type="number"
                  className="kasir-search-input"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="tutup-kasir-btn"
              onClick={() => setMaterialModalData(null)}
            >
              Batal
            </button>
            <button type="submit" className="buat-laporan-btn">
              {isEditing ? 'Simpan Perubahan' : 'Tambah Bahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
