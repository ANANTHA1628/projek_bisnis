import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Check, Palette, Volume2, Sparkles, RefreshCw, UserCheck } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function AppearanceView() {
  const { themeSettings, updateThemeSettings, showToast, playSound } = usePos();

  const themes = [
    {
      id: 'dark',
      name: 'Titanium Emerald (Default)',
      desc: 'High-tech modern POS dengan aksen emerald mint segar, mewah dan nyaman di mata',
      bg: '#080c14',
      card: '#0f1523',
      border: '#10b981'
    },
    {
      id: 'forest',
      name: 'Emerald Forest',
      desc: 'Hijau botani segar menyejukkan mata kasir seharian',
      bg: '#061510',
      card: '#0d251d',
      border: '#10b981'
    },
    {
      id: 'coffee',
      name: 'Artisan Coffee',
      desc: 'Nuansa hangat biji kopi & karamel khas café barista',
      bg: '#140d09',
      card: '#201610',
      border: '#d97706'
    },
    {
      id: 'cyber',
      name: 'Cyberpunk Neon',
      desc: 'Nuansa neon cyan futuristik khas arcade & coffee bar modern',
      bg: '#060913',
      card: '#0b1326',
      border: '#06b6d4'
    },
    {
      id: 'violet',
      name: 'Royal Violet',
      desc: 'Warna ungu elegan khas lounge & kafe malam',
      bg: '#0d0918',
      card: '#17112b',
      border: '#8b5cf6'
    },
    {
      id: 'oled',
      name: 'Pitch Black OLED',
      desc: 'Hitam pekat hemat baterai tablet & kontras maksimal',
      bg: '#000000',
      card: '#0c0c10',
      border: '#10b981'
    },
    {
      id: 'light',
      name: 'Clean Light',
      desc: 'Tema terang bersih cocok untuk area outdoor siang hari',
      bg: '#f1f5f9',
      card: '#ffffff',
      border: '#10b981'
    }
  ];

  const accentColors = [
    { id: '#10b981', name: 'Emerald Mint (Default)', hex: '#10b981' },
    { id: '#f59e0b', name: 'Amber Gold', hex: '#f59e0b' },
    { id: '#8b5cf6', name: 'Royal Purple', hex: '#8b5cf6' },
    { id: '#06b6d4', name: 'Cyan Neon', hex: '#06b6d4' },
    { id: '#14b8a6', name: 'Teal Jade', hex: '#14b8a6' },
    { id: '#ec4899', name: 'Rose Pink', hex: '#ec4899' },
    { id: '#ef4444', name: 'Crimson Red', hex: '#ef4444' },
    { id: '#3b82f6', name: 'Sky Sapphire', hex: '#3b82f6' }
  ];

  const cashierNameColors = [
    { id: 'white', name: 'Putih Bersih', hex: '#ffffff' },
    { id: 'emerald', name: 'Emerald Mint', hex: '#10b981' },
    { id: 'amber', name: 'Amber Gold', hex: '#f59e0b' },
    { id: 'cyan', name: 'Cyan Neon', hex: '#06b6d4' },
    { id: 'purple', name: 'Purple Lilac', hex: '#c084fc' },
    { id: 'pink', name: 'Rose Candy', hex: '#f472b6' },
    { id: 'lime', name: 'Lime Zest', hex: '#84cc16' },
    { id: 'orange', name: 'Tangerine Sun', hex: '#fb923c' }
  ];

  const handleSelectTheme = (t) => {
    updateThemeSettings({
      theme: t.id,
      accentColor: t.border
    });
    playSound?.('beep');
    showToast(`Tema ${t.name} berhasil diterapkan secara instan!`, 'success');
  };

  const handleSelectAccent = (colorHex) => {
    updateThemeSettings({ accentColor: colorHex });
    playSound?.('beep');
    showToast('Warna aksen tombol & fokus diperbarui!', 'success');
  };

  const handleSelectCashierNameColor = (colorHex) => {
    updateThemeSettings({ userNameColor: colorHex });
    playSound?.('beep');
    showToast('Warna nama kasir berhasil diperbarui!', 'success');
  };

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Appearance & Themes" />

      {/* 1. Theme Palette Selector */}
      <div className="posa-admin-card">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="posa-card-title">Color Theme & Display</h2>
            <p className="posa-card-subtitle">
              Pilih tema warna utama aplikasi. Perubahan langsung aktif ke seluruh halaman backoffice & kasir.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-medium">
            Tema Aktif: <strong className="text-white capitalize">{themeSettings.theme || 'dark'}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((t) => {
            const isActive = themeSettings.theme === t.id;
            return (
              <div
                key={t.id}
                className="p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between"
                style={{
                  borderColor: isActive ? 'var(--accent-blue, #10b981)' : 'var(--border-subtle, rgba(255,255,255,0.08))',
                  backgroundColor: isActive ? 'var(--bg-card-alt, rgba(16,185,129,0.12))' : 'var(--bg-card, #111522)',
                  boxShadow: isActive ? '0 0 16px rgba(16, 185, 129, 0.25)' : 'none'
                }}
                onClick={() => handleSelectTheme(t)}
              >
                <div>
                  {/* Theme Preview Card Graphic */}
                  <div
                    className="w-full h-24 rounded-lg mb-3 border border-slate-700/60 p-2.5 flex flex-col justify-between relative overflow-hidden"
                    style={{ backgroundColor: t.bg }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-2.5 rounded bg-white/20" />
                      {isActive && (
                        <span
                          className="w-5 h-5 rounded-full text-white flex items-center justify-center shadow"
                          style={{ backgroundColor: 'var(--accent-blue, #10b981)' }}
                        >
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 rounded border border-white/10" style={{ backgroundColor: t.card }} />
                      <div className="w-8 h-10 rounded" style={{ backgroundColor: t.border }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{t.name}</span>
                    {isActive && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: 'var(--accent-blue, #60a5fa)' }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Accent Color Palette */}
      <div className="posa-admin-card">
        <h2 className="posa-card-title mb-1">Accent Color</h2>
        <p className="posa-card-subtitle mb-4">
          Warna sorotan untuk tombol utama, indikator aktif, dan border fokus kasir.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {accentColors.map((ac) => {
            const isSelected = (themeSettings.accentColor || '#10b981') === ac.hex;
            return (
              <div
                key={ac.id}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'border-white/40 bg-white/5 ring-1 ring-white/20'
                    : 'border-slate-800 bg-[#0f1422] hover:border-slate-700'
                }`}
                onClick={() => handleSelectAccent(ac.hex)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105"
                  style={{ backgroundColor: ac.hex }}
                >
                  {isSelected && <Check size={18} className="text-white drop-shadow" />}
                </div>
                <span className="text-xs font-semibold text-white text-center">
                  {ac.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Desain Warna Nama Kasir (Pilihan Bulat-Bulat) */}
      <div className="posa-admin-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-emerald-400" />
            <h2 className="posa-card-title">Desain Warna Nama Kasir</h2>
          </div>

          {/* Live Preview Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b0f19] border border-white/10">
            <span className="text-xs text-slate-400">Pratinjau Nama Kasir:</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{
                color: themeSettings.userNameColor || themeSettings.accentColor || '#10b981',
                backgroundColor: 'rgba(255,255,255,0.06)'
              }}
            >
              Ahmad Rafi (Kasir)
            </span>
          </div>
        </div>

        <p className="posa-card-subtitle mb-4">
          Pilih warna teks khusus untuk identitas kasir yang tampil di pojok atas layar POS Kiosk dan Top Navbar Backoffice.
        </p>

        {/* Lingkaran / Bulat-Bulat Pilihan Warna */}
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-[#0a0e1a]/60 border border-slate-800">
          {cashierNameColors.map((cnc) => {
            const isSelected = (themeSettings.userNameColor || '#ffffff') === cnc.hex;
            return (
              <button
                key={cnc.id}
                type="button"
                onClick={() => handleSelectCashierNameColor(cnc.hex)}
                className="group relative flex flex-col items-center gap-1.5 focus:outline-none"
                title={`${cnc.name} (${cnc.hex})`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 transform group-hover:scale-110 shadow-lg cursor-pointer ${
                    isSelected
                      ? 'ring-4 ring-offset-2 ring-offset-[#0b0e17] ring-white scale-105'
                      : 'hover:ring-2 hover:ring-white/40'
                  }`}
                  style={{
                    backgroundColor: cnc.hex,
                    boxShadow: isSelected ? `0 0 16px ${cnc.hex}80` : 'none'
                  }}
                >
                  {isSelected && (
                    <Check
                      size={18}
                      className={cnc.hex === '#ffffff' ? 'text-black font-bold' : 'text-white font-bold drop-shadow'}
                    />
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    isSelected ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {cnc.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Audio & Feedback Settings */}
      <div className="posa-admin-card">
        <h2 className="posa-card-title mb-1">Audio & Feedback Kasir</h2>
        <p className="posa-card-subtitle mb-4">
          Pengaturan umpan balik suara saat menekan tombol keypad PIN dan memproses transaksi.
        </p>

        <div className="flex items-center justify-between py-2 border-t border-slate-800">
          <div>
            <div className="text-sm font-semibold text-white">Efek Suara Tombol (Keypad Audio)</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Memainkan bunyi klik lembut saat memasukkan PIN atau menambah pesanan.
            </div>
          </div>
          <label className="posa-switch">
            <input
              type="checkbox"
              checked={themeSettings.soundEnabled !== false}
              onChange={(e) => {
                updateThemeSettings({ soundEnabled: e.target.checked });
                showToast(e.target.checked ? 'Suara tombol diaktifkan' : 'Suara tombol dibisukan');
              }}
            />
            <span className="posa-slider" />
          </label>
        </div>
      </div>
    </div>
  );
}
