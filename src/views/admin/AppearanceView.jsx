import React, { useRef } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Check, Palette, Volume2, Sparkles, RefreshCw, UserCheck, Layout, Shield, Zap, Image, Upload, Trash2 } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function AppearanceView() {
  const { themeSettings, updateThemeSettings, settings, updateSettings, showToast, playSound } = usePos();
  const fileInputRef = useRef(null);

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
      id: 'sapphire',
      name: 'Midnight Sapphire',
      desc: 'Biru laut dalam mewah & elegan dengan aksen royal blue bercahaya',
      bg: '#060e1d',
      card: '#0d1e3a',
      border: '#3b82f6'
    },
    {
      id: 'sunset',
      name: 'Sunset Amber & Coral',
      desc: 'Gradasi hangat jingga senja dan koral yang ceria dan berenergi',
      bg: '#140b0f',
      card: '#221219',
      border: '#f97316'
    },
    {
      id: 'matcha',
      name: 'Nordic Sage & Matcha',
      desc: 'Hijau teh matcha khas Jepang yang tenang, rapi dan estetik',
      bg: '#0c1411',
      card: '#15241f',
      border: '#84cc16'
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
      id: 'crimson',
      name: 'Ruby Crimson Lounge',
      desc: 'Merah marun anggur mewah untuk restoran eksklusif & bar',
      bg: '#14070a',
      card: '#240d13',
      border: '#f43f5e'
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
      name: 'Clean Light (Siang Hari)',
      desc: 'Tema terang putih bersih dengan kontras font gelap yang jelas & mudah dibaca',
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

  const cashierBadgeStyles = [
    {
      id: 'pill-avatar',
      name: 'Pill Avatar Modern',
      desc: 'Bentuk lonjong rounded pill dengan avatar bulat & role chip.',
      styleClass: 'badge-style-pill-avatar'
    },
    {
      id: 'glass-card',
      name: 'Glassmorphism Kaca',
      desc: 'Efek kaca frosted transparan dengan kilau tepi modern.',
      styleClass: 'badge-style-glass-card'
    },
    {
      id: 'cyber-neon',
      name: 'Cyber Glow Neon',
      desc: 'Pendaran neon futuristik dengan kilau menyala berkarakter modern.',
      styleClass: 'badge-style-cyber-neon'
    },
    {
      id: 'minimal-clean',
      name: 'Minimalis Elegan',
      desc: 'Garis aksen tepi bersih tanpa bingkai tebal, rapi dan ringkas.',
      styleClass: 'badge-style-minimal-clean'
    },
    {
      id: 'gradient-badge',
      name: 'Gradasi Modern',
      desc: 'Latar belakang gradasi halus berpadu kontras modern dan mewah.',
      styleClass: 'badge-style-gradient-badge'
    },
    {
      id: 'tag-outline',
      name: 'Tag Outline Premium',
      desc: 'Gaya tag kasir eksklusif dengan aksen border tegas berkarakter.',
      styleClass: 'badge-style-tag-outline'
    }
  ];

  const handleSelectCashierBadgeStyle = (styleId) => {
    updateThemeSettings({ cashierBadgeStyle: styleId });
    playSound?.('beep');
    showToast('Desain tampilan nama kasir berhasil diperbarui!', 'success');
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

      {/* 3. Desain Tampilan & Warna Nama Kasir */}
      <div className="posa-admin-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-emerald-400" />
            <h2 className="posa-card-title">Desain & Gaya Tampilan Nama Kasir</h2>
          </div>

          {/* Live Preview Badge */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#070b14] border border-white/10">
            <span className="text-xs text-slate-400">Pratinjau Langsung:</span>
            <div
              className={`user-profile-badge badge-style-${themeSettings.cashierBadgeStyle || 'pill-avatar'}`}
              style={{ margin: 0 }}
            >
              <div className="user-profile-avatar-chip">
                A
              </div>
              <div className="user-profile-info-group">
                <span className="user-profile-name" style={{ color: themeSettings.userNameColor || '#10b981' }}>
                  Ahmad Rafi
                </span>
                <span className="user-profile-role">
                  Owner • Kasir
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="posa-card-subtitle mb-4">
          Pilih gaya bentuk kartu identitas kasir serta warna teksnya yang tampil di layar POS Kiosk dan Top Navbar.
        </p>

        {/* Sub-Section 1: Pilihan Desain Gaya Badge Kasir */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-slate-300 block mb-2.5 uppercase tracking-wider">
            1. Pilihan Gaya / Desain Bentuk Badge Nama Kasir
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cashierBadgeStyles.map((style) => {
              const isSelected = (themeSettings.cashierBadgeStyle || 'pill-avatar') === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => handleSelectCashierBadgeStyle(style.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-500/80 bg-emerald-500/10 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800 bg-[#0a0e1a]/80 hover:border-slate-700 hover:bg-[#0f1525]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {style.name}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  {/* Visual Render Miniature */}
                  <div className="p-2.5 rounded-lg bg-[#070a12] border border-slate-800/80 flex items-center justify-center">
                    <div className={`user-profile-badge ${style.styleClass}`} style={{ margin: 0 }}>
                      <div className="user-profile-avatar-chip">
                        K
                      </div>
                      <div className="user-profile-info-group">
                        <span className="user-profile-name" style={{ color: themeSettings.userNameColor || '#10b981', fontSize: '11px' }}>
                          Kasir Aktif
                        </span>
                        <span className="user-profile-role" style={{ fontSize: '9px' }}>
                          Shift 1
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {style.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sub-Section 2: Lingkaran / Bulat-Bulat Pilihan Warna */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2.5 uppercase tracking-wider">
            2. Pilihan Warna Teks Nama Kasir
          </label>
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

      {/* 5. Logo Usaha / Brand Visual */}
      <div className="posa-admin-card">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Image size={18} className="text-emerald-400" />
            <h2 className="posa-card-title">Logo Brand & Struk Usaha</h2>
          </div>
          {settings.store_logo && (
            <button
              type="button"
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              onClick={() => {
                updateSettings({ store_logo: '' });
                showToast('Logo berhasil dihapus', 'info');
              }}
            >
              <Trash2 size={13} />
              <span>Hapus Logo</span>
            </button>
          )}
        </div>
        <p className="posa-card-subtitle mb-4">
          Unggah logo bisnis Anda (PNG / JPG / SVG). Logo ini akan ditampilkan secara otomatis di Header Kasir Kiosk POS, Top Navbar Admin, Layar Kunci Kiosk, dan Kepala Cetak Nota Struk Kasir.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-slate-800 bg-[#0f1422]">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            {settings.store_logo ? (
              <img
                src={settings.store_logo}
                alt="Logo Toko"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="text-center p-2 text-slate-500">
                <Image size={24} className="mx-auto mb-1 opacity-50" />
                <span className="text-[10px] block">Belum ada logo</span>
              </div>
            )}
          </div>

          <div className="flex-1 w-full text-center sm:text-left">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    showToast('Ukuran gambar maksimal 2MB', 'warning');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (uploadEvent) => {
                    const base64 = uploadEvent.target?.result;
                    if (base64) {
                      updateSettings({ store_logo: base64 });
                      showToast('Logo bisnis berhasil diunggah & disimpan!', 'success');
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <button
              type="button"
              className="buat-laporan-btn inline-flex items-center gap-2 text-xs py-2 px-4 font-bold"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} />
              <span>{settings.store_logo ? 'Ganti Foto Logo' : 'Unggah Foto Logo Toko'}</span>
            </button>
            <span className="text-[11px] text-slate-400 block mt-2">
              Format yang didukung: PNG, JPG, WebP, SVG. Disarankan berukuran persegi / transparan (Maks. 2MB).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
