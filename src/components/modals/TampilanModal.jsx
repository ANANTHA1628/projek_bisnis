import React from 'react';
import { usePos } from '../../context/PosContext';
import {
  X,
  Palette,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Type,
  RotateCcw,
  CheckCircle2,
  Smartphone,
  Layers
} from 'lucide-react';

const PRESET_THEMES = [
  {
    id: 'dark',
    name: 'Dark Slate (Default)',
    desc: 'Nuansa modern high-tech POS dengan kontras seimbang',
    bg: '#0c1017',
    card: '#131a29',
    accent: '#2563eb',
    text: '#f8fafc'
  },
  {
    id: 'oled',
    name: 'OLED Pure Black',
    desc: 'Hitam pekat hemat daya baterai layar tablet & kontras maksimal',
    bg: '#000000',
    card: '#0d0d0f',
    accent: '#3b82f6',
    text: '#ffffff'
  },
  {
    id: 'coffee',
    name: 'Espresso Roast (Coffee)',
    desc: 'Gradasi hangat biji kopi & karamel untuk coffee shop autentik',
    bg: '#140e0b',
    card: '#201712',
    accent: '#d97706',
    text: '#fef3c7'
  },
  {
    id: 'forest',
    name: 'Emerald Forest (Barista)',
    desc: 'Hijau botani alami yang menyejukkan mata kasir seharian',
    bg: '#08130f',
    card: '#10241d',
    accent: '#10b981',
    text: '#ecfdf5'
  },
  {
    id: 'violet',
    name: 'Royal Violet (Bistro)',
    desc: 'Sentuhan warna ungu elegan khas lounge & kafe malam',
    bg: '#0d0a14',
    card: '#181226',
    accent: '#8b5cf6',
    text: '#f5f3ff'
  },
  {
    id: 'light',
    name: 'Clean Light (Siang Hari)',
    desc: 'Mode terang bersih cocok untuk area kasir outdoor terkena matahari',
    bg: '#f4f6fa',
    card: '#ffffff',
    accent: '#2563eb',
    text: '#0f172a'
  }
];

const ACCENT_COLORS = [
  { id: '#2563eb', name: 'Royal Blue', color: '#2563eb' },
  { id: '#10b981', name: 'Emerald', color: '#10b981' },
  { id: '#f59e0b', name: 'Amber Gold', color: '#f59e0b' },
  { id: '#8b5cf6', name: 'Violet', color: '#8b5cf6' },
  { id: '#f43f5e', name: 'Rose Red', color: '#f43f5e' },
  { id: '#06b6d4', name: 'Cyan Neon', color: '#06b6d4' }
];

export default function TampilanModal() {
  const {
    showTampilanModal,
    setShowTampilanModal,
    themeSettings,
    updateThemeSettings,
    playSound,
    showToast
  } = usePos();

  if (!showTampilanModal) return null;

  const handleSelectTheme = (themeId) => {
    updateThemeSettings({ theme: themeId });
    playSound('beep');
    showToast(`Tema diganti ke: ${PRESET_THEMES.find((t) => t.id === themeId)?.name}`);
  };

  const handleSelectAccent = (colorHex) => {
    updateThemeSettings({ accentColor: colorHex });
    playSound('beep');
    showToast('Warna aksen POS diperbarui');
  };

  const handleReset = () => {
    updateThemeSettings({
      theme: 'dark',
      accentColor: '#2563eb',
      fontScale: 'normal',
      soundEnabled: true,
      animationsEnabled: true,
      cardDensity: 'standard'
    });
    playSound('beep');
    showToast('Tampilan dikembalikan ke konfigurasi bawaan');
  };

  return (
    <div className="modal-backdrop-overlay" style={{ zIndex: 1100 }}>
      <div
        className="modal-dialog-box"
        style={{
          maxWidth: '680px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-blue-subtle, rgba(37,99,235,0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue, #3b82f6)'
              }}
            >
              <Palette size={20} />
            </div>
            <div>
              <div className="modal-title" style={{ fontSize: '16px', fontWeight: 700 }}>
                Pengaturan Tampilan & Tema
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Kustomisasi warna antarmuka, skala teks, dan efek suara operasional kasir
              </div>
            </div>
          </div>

          <button
            className="modal-close-btn"
            onClick={() => setShowTampilanModal(false)}
            title="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body" style={{ overflowY: 'auto', padding: '20px', gap: '20px', display: 'flex', flexDirection: 'column' }}>
          {/* Section 1: Preset Themes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Layers size={16} color="var(--accent-blue, #3b82f6)" />
              <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Preset Tema Warna
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                gap: '10px'
              }}
            >
              {PRESET_THEMES.map((th) => {
                const isActive = themeSettings.theme === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => handleSelectTheme(th.id)}
                    style={{
                      border: isActive
                        ? '2px solid var(--accent-blue, #2563eb)'
                        : '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
                      borderRadius: '10px',
                      padding: '12px',
                      cursor: 'pointer',
                      backgroundColor: 'var(--bg-card)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      boxShadow: isActive ? 'var(--shadow-glow)' : 'none'
                    }}
                  >
                    {/* Visual Color Palette Preview */}
                    <div
                      style={{
                        height: '42px',
                        borderRadius: '6px',
                        backgroundColor: th.bg,
                        border: '1px solid rgba(128,128,128,0.2)',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 8px'
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          backgroundColor: th.card,
                          border: '1px solid rgba(128,128,128,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '2px',
                            backgroundColor: th.accent
                          }}
                        />
                      </div>

                      {isActive && (
                        <div
                          style={{
                            backgroundColor: 'var(--accent-blue, #2563eb)',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff'
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      {th.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                      {th.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Accent Color */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Palette size={16} color="var(--accent-blue, #3b82f6)" />
              <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Warna Aksen Tombol & Sorotan
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {ACCENT_COLORS.map((ac) => {
                const isSelected = themeSettings.accentColor === ac.color;
                return (
                  <button
                    key={ac.id}
                    onClick={() => handleSelectAccent(ac.color)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: isSelected
                        ? `2px solid ${ac.color}`
                        : '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
                      backgroundColor: isSelected
                        ? 'var(--bg-pill-hover, #222f48)'
                        : 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    <span
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: ac.color,
                        boxShadow: isSelected ? `0 0 8px ${ac.color}` : 'none'
                      }}
                    />
                    <span>{ac.name}</span>
                    {isSelected && <Check size={13} color={ac.color} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Skala Teks & Kepadatan */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Font Scaling */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Type size={16} color="var(--accent-blue, #3b82f6)" />
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Skala Ukuran Teks</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'compact', label: 'Ringkas (94%)' },
                  { id: 'normal', label: 'Standar (100%)' },
                  { id: 'large', label: 'Besar (108%)' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      updateThemeSettings({ fontScale: s.id });
                      playSound('click');
                    }}
                    style={{
                      flex: 1,
                      padding: '7px 4px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor:
                        themeSettings.fontScale === s.id
                          ? 'var(--accent-blue, #2563eb)'
                          : 'var(--bg-pill, #192236)',
                      color: themeSettings.fontScale === s.id ? '#ffffff' : 'var(--text-secondary)'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Suara & Audio Chime */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {themeSettings.soundEnabled ? (
                    <Volume2 size={16} color="var(--accent-green, #10b981)" />
                  ) : (
                    <VolumeX size={16} color="var(--text-muted)" />
                  )}
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>Efek Suara Kasir</span>
                </div>
                <button
                  onClick={() => {
                    const next = !themeSettings.soundEnabled;
                    updateThemeSettings({ soundEnabled: next });
                    if (next) playSound('beep');
                  }}
                  style={{
                    backgroundColor: themeSettings.soundEnabled ? 'var(--accent-green, #10b981)' : '#4b5563',
                    border: 'none',
                    borderRadius: '12px',
                    width: '38px',
                    height: '20px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: themeSettings.soundEnabled ? '20px' : '2px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      transition: 'all 0.2s'
                    }}
                  />
                </button>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Chime audio saat scan/tambah item & transaksi</span>
                <button
                  onClick={() => playSound('success')}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '10px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Tes Chime
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Live Preview Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-app)',
              padding: '14px',
              borderRadius: '10px',
              border: '1px dashed var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
              LIVE PREVIEW TAMPILAN KASIR
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-card)',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-card)'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                  Caffe Latte (Contoh Menu)
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Kopi • Takaran Double Shot • 16oz
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                  Rp 26.000
                </span>
                <button
                  style={{
                    backgroundColor: 'var(--accent-blue, #2563eb)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'default'
                  }}
                >
                  + Tambah
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="modal-footer"
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Default</span>
          </button>

          <button
            className="action-btn-primary"
            onClick={() => {
              setShowTampilanModal(false);
              showToast('Tampilan berhasil diterapkan!');
            }}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px'
            }}
          >
            Terapkan & Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
