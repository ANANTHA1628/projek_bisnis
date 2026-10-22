import React, { useState, useEffect } from 'react';
import { usePos } from '../../context/PosContext';
import { X, Check } from 'lucide-react';

export default function CustomizeModal() {
  const { customizingItem, setCustomizingItem, updateItemCustomization, modifiers } = usePos();

  const [sugar, setSugar] = useState('100%');
  const [ice, setIce] = useState('Normal');
  const [selectedMods, setSelectedMods] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (customizingItem) {
      setSugar(customizingItem.sugar || '100%');
      setIce(customizingItem.ice || 'Normal');
      setNotes(customizingItem.notes || '');
      setSelectedMods(customizingItem.modifiers || []);
    }
  }, [customizingItem]);

  if (!customizingItem) return null;

  const toggleModifier = (mod) => {
    setSelectedMods((prev) => {
      const exists = prev.find((m) => m.id === mod.id);
      if (exists) {
        return prev.filter((m) => m.id !== mod.id);
      } else {
        return [...prev, mod];
      }
    });
  };

  const handleSave = () => {
    const modNames = selectedMods.map((m) => `+${m.name}`);
    const formattedNotes = [
      ice !== '-' ? `Es: ${ice}` : null,
      sugar !== '-' ? `Gula: ${sugar}` : null,
      ...modNames,
      notes ? notes : null
    ]
      .filter(Boolean)
      .join(', ');

    updateItemCustomization(customizingItem.productId, {
      sugar,
      ice,
      modifiers: selectedMods,
      notes: formattedNotes
    });
    setCustomizingItem(null);
  };

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '440px' }}>
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

          {/* Modifiers berharga yang mempengaruhi HPP (POS-04) */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Tambahan / Modifier Berharga (Ikut Hitung HPP)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {modifiers.map((mod) => {
                const isSelected = selectedMods.some((m) => m.id === mod.id);
                return (
                  <label
                    key={mod.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.15)' : '#162033',
                      border: `1px solid ${isSelected ? '#3b82f6' : 'var(--border-subtle)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleModifier(mod)}
                        style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 400, color: 'var(--text-primary)' }}>
                        {mod.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#60a5fa' }}>
                      +{formatRupiah(mod.priceDelta)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Catatan Bebas Barista
            </label>
            <input
              type="text"
              className="kasir-search-input"
              placeholder="Contoh: Pisah sedotan, hangatkan..."
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
