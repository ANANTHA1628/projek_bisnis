import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Palette, Check } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function AppearanceView() {
  const { themeSettings, updateThemeSettings, showToast } = usePos();

  const themes = [
    { id: 'dark', name: 'Dark Navy (Default)', bg: '#0a0d14', border: '#2563eb' },
    { id: 'oled', name: 'Pitch Black OLED', bg: '#000000', border: '#3b82f6' },
    { id: 'coffee', name: 'Artisan Coffee', bg: '#17120e', border: '#b45309' },
    { id: 'forest', name: 'Emerald Forest', bg: '#061a14', border: '#10b981' }
  ];

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Appearance" />

      <div className="posa-admin-card">
        <h2 className="posa-card-title mb-1">Color Theme & Display</h2>
        <p className="posa-card-subtitle mb-4">
          Choose a color theme that suits your café lighting.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${themeSettings.theme === t.id ? 'border-blue-500 bg-blue-950/20 ring-1 ring-blue-500' : 'border-slate-800 bg-[#0f1422]'}`}
              onClick={() => {
                updateThemeSettings({ theme: t.id });
                showToast(`Tema ${t.name} diaktifkan!`);
              }}
            >
              <div
                className="w-full h-20 rounded-lg mb-3 border border-slate-700 flex items-center justify-center"
                style={{ backgroundColor: t.bg }}
              >
                {themeSettings.theme === t.id && <Check size={22} className="text-blue-400" />}
              </div>
              <div className="text-sm font-semibold text-white">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
