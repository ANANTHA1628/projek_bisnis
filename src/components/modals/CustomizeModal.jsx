import React, { useState, useEffect } from 'react';
import { usePos } from '../../context/PosContext';
import { X, Check } from 'lucide-react';

export default function CustomizeModal() {
  const { customizingItem, setCustomizingItem, updateItemCustomization } = usePos();
  
  const [sugar, setSugar] = useState('100%');
  const [ice, setIce] = useState('Normal');
  const [extraShot, setExtraShot] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (customizingItem) {
      setSugar(customizingItem.sugar || '100%');
      setIce(customizingItem.ice || 'Normal');
      setNotes(customizingItem.notes || '');
    }
  }, [customizingItem]);

  if (!customizingItem) return null;

  const handleSave = () => {
    const formattedNotes = [
      ice !== '-' ? `Es: ${ice}` : null,
      sugar !== '-' ? `Gula: ${sugar}` : null,
      extraShot ? '+Extra Shot' : null,
      notes ? notes : null
    ]
      .filter(Boolean)
      .join(', ');

    updateItemCustomization(customizingItem.productId, {
      sugar,
      ice,
      notes: formattedNotes
    });
    setCustomizingItem(null);
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <div className="modal-title">Sesuaikan {customizingItem.name}</div>
          <button
            className="modal-close-btn"
            onClick={() => setCustomizingItem(null)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Sugar Level */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Level Gula / Pemanis
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {['100%', '70%', '50%', '0%'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`category-pill ${sugar === lvl ? 'active' : ''}`}
                  style={{ textAlign: 'center', padding: '8px 4px' }}
                  onClick={() => setSugar(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Level Es Batu
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {['Normal', 'Less Ice', 'No Ice'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`category-pill ${ice === lvl ? 'active' : ''}`}
                  style={{ textAlign: 'center', padding: '8px 4px' }}
                  onClick={() => setIce(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Extra options */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Tambahan (Add-on)
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              <input
                type="checkbox"
                checked={extraShot}
                onChange={(e) => setExtraShot(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
              />
              <span>Extra Espresso Shot (+Rp 5.000)</span>
            </label>
          </div>

          {/* Special Notes */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Catatan Khusus
            </label>
            <input
              type="text"
              className="kasir-search-input"
              placeholder="Contoh: Pisah sedotan, hangatkan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="tutup-kasir-btn"
            onClick={() => setCustomizingItem(null)}
          >
            Batal
          </button>
          <button className="buat-laporan-btn" onClick={handleSave}>
            Simpan Preferensi
          </button>
        </div>
      </div>
    </div>
  );
}
