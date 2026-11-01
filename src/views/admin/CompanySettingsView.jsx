import React, { useState, useRef } from 'react';
import AdminHeader from '../../components/AdminHeader';
import {
  Building2,
  KeyRound,
  Laptop,
  Ticket,
  Store,
  Bike,
  ShieldCheck,
  QrCode,
  AlertTriangle,
  Copy,
  Check,
  Upload,
  Lock,
  Mail,
  Phone,
  ShieldAlert,
  RotateCcw,
  X,
  Eye,
  EyeOff,
  Image,
  Trash2
} from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function CompanySettingsView() {
  const { settings, updateSettings, clearAllSampleData, deleteMasterAccountAndReset, showToast } = usePos();
  const logoInputRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [queueNumbers, setQueueNumbers] = useState(settings.queue_numbers || false);
  const [takeaway, setTakeaway] = useState(settings.order_type_takeaway !== false);
  const [goFood, setGoFood] = useState(settings.delivery_gofood || false);
  const [grabFood, setGrabFood] = useState(settings.delivery_grabfood || false);
  const [shopeeFood, setShopeeFood] = useState(settings.delivery_shopeefood || false);
  const [supervisorPinRequired, setSupervisorPinRequired] = useState(true);

  // Edit states for company info
  const [companyName, setCompanyName] = useState(settings.store_name || 'posa');
  const [companyEmail, setCompanyEmail] = useState(settings.store_email || 'hamdirafi310@gmail.com');
  const [companyPhone, setCompanyPhone] = useState(settings.store_phone || '6283871983300');

  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const businessCode = settings.business_code || 'e14d33a6-e2a7-4f8c-8ce6-63a7e1f6c6d7';

  // Modal Ubah Kata Sandi Master
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(businessCode);
    setCopied(true);
    showToast('Business Code berhasil disalin!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok');
      return;
    }
    updateSettings({ account_password: newPassword });
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    showToast('Kata sandi master (Account Password) berhasil diperbarui!', 'success');
  };

  const handleSaveInfo = () => {
    updateSettings({
      store_name: companyName,
      store_email: companyEmail,
      store_phone: companyPhone
    });
    showToast('Nama brand kasir & informasi perusahaan berhasil diperbarui!', 'success');
  };

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Company Settings" />

      <div className="space-y-4">
        {/* 1. Company Information */}
        <div className="posa-admin-card">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
              <Building2 size={18} />
              <span>Company Information</span>
            </div>
            <button
              type="button"
              className="posa-btn-outline text-xs py-1.5 px-3"
              onClick={handleSaveInfo}
            >
              Simpan Perubahan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Upload Logo Toko */}
            <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-800 bg-[#0f1422] flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                {settings.store_logo ? (
                  <img src={settings.store_logo} alt="Logo Toko" className="w-full h-full object-contain p-1" />
                ) : (
                  <Image size={24} className="text-slate-600" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="text-xs font-bold text-white mb-0.5">Logo Brand & Struk Kasir</div>
                <div className="text-[11px] text-slate-400">
                  {settings.store_logo ? 'Logo terpasang. Tampil di Kasir Kiosk, Struk Nota, & Navbar.' : 'Unggah logo untuk menampilkan brand visual di kasir dan struk thermal.'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={logoInputRef}
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
                          showToast('Logo berhasil diperbarui', 'success');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  className="posa-btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Upload size={13} />
                  <span>{settings.store_logo ? 'Ganti' : 'Unggah Logo'}</span>
                </button>
                {settings.store_logo && (
                  <button
                    type="button"
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10"
                    title="Hapus Logo"
                    onClick={() => {
                      updateSettings({ store_logo: '' });
                      showToast('Logo dihapus', 'info');
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nama Usaha / Brand Kasir (POS Logo Brand)
              </label>
              <input
                type="text"
                className="posa-input w-full font-semibold"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Contoh: posa, Kopi Senja, Resto Berkah"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Nama brand ini otomatis tampil sebagai logo utama di layar Kasir POS Kiosk (menggantikan tulisan 'posa'), Top Navbar, dan struk nota.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-muted">Email Perusahaan</label>
                <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                  <Check size={12} /> Verified
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  className="posa-input w-full pr-8"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
                <Mail size={14} className="absolute right-2.5 top-3 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted block mb-1">WhatsApp Bisnis</label>
              <div className="relative">
                <input
                  type="tel"
                  className="posa-input w-full pr-8"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                />
                <Phone size={14} className="absolute right-2.5 top-3 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted block mb-1">Business Identifier Code</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 overflow-hidden">
                  <code className="text-slate-300 text-xs bg-[#0b0e17] px-2.5 py-2 rounded-lg font-mono block truncate border border-white/5">
                    {businessCode}
                  </code>
                </div>
                <button
                  type="button"
                  className="p-2 rounded-lg border border-slate-700 bg-[#161c2d] hover:bg-[#222d46] text-slate-200 transition-colors flex-shrink-0"
                  onClick={handleCopyCode}
                  title="Salin Business Code"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-[11px] text-muted mt-1.5 leading-relaxed">
                Gunakan kode ini saat menghubungi customer support untuk identifikasi cepat café Anda.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Account Password */}
        <div className="posa-admin-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-950/40 border border-blue-500/20 rounded-xl text-blue-400 flex-shrink-0">
              <KeyRound size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Account Password</h3>
              <p className="text-xs text-muted max-w-xl mt-1 leading-relaxed">
                Kata sandi master untuk menghubungkan tablet baru ke bisnis ini atau mengubah pengaturan sensitif. (PIN 6 digit hanya untuk absensi & kasir harian).
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
                <Check size={13} />
                <span>Password aktif & terproteksi</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="posa-btn-outline w-full sm:w-auto justify-center flex-shrink-0"
            onClick={() => {
              setPasswordError('');
              setShowPasswordModal(true);
            }}
          >
            Change Password
          </button>
        </div>

        {/* 3. Connected Devices */}
        <div className="posa-admin-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-950/40 border border-blue-500/20 rounded-xl text-blue-400 flex-shrink-0">
              <Laptop size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Connected Devices</h3>
              <p className="text-xs text-muted max-w-xl mt-1 leading-relaxed">
                Tablet atau PC kasir hilang, atau staf lama keluar? Keluarkan semua perangkat lain secara serentak agar mereka wajib meminta otorisasi ulang.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="posa-btn-outline w-full sm:w-auto justify-center flex-shrink-0 text-amber-400 hover:text-amber-300"
            onClick={() => showToast('Semua perangkat lain telah dikeluarkan!', 'warning')}
          >
            Sign Out Others
          </button>
        </div>

        {/* 4. Queue Numbers */}
        <div className="posa-admin-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-950/40 border border-blue-500/20 rounded-xl text-blue-400 flex-shrink-0">
              <Ticket size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Queue Numbers (Nomor Antrean)</h3>
              <p className="text-xs text-muted max-w-xl mt-1 leading-relaxed">
                Setiap transaksi otomatis mendapat nomor antrean (1, 2, 3...) yang di-reset setiap pergantian hari. Nomor dicetak di struk untuk panggilan pesanan kafe.
              </p>
            </div>
          </div>

          <label className="posa-switch flex-shrink-0">
            <input
              type="checkbox"
              checked={queueNumbers}
              onChange={(e) => {
                setQueueNumbers(e.target.checked);
                updateSettings({ queue_numbers: e.target.checked });
                showToast(`Nomor antrean ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}`);
              }}
            />
            <span className="posa-slider" />
          </label>
        </div>

        {/* 5. Till Settings */}
        <div className="posa-admin-card">
          <h2 className="posa-card-title">Till & Order Settings</h2>
          <p className="posa-card-subtitle">
            Konfigurasi penerimaan pesanan dan otorisasi kasir untuk seluruh mesin POS.
          </p>

          {/* Order types */}
          <div className="mt-5 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm text-blue-400 font-semibold mb-3">
              <Store size={16} />
              <span>Tipe Pemesanan (Order Types)</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <div>
                  <span className="text-sm text-white font-medium">Dine In (Makan di Tempat)</span>
                  <p className="text-xs text-muted">Dukungan pemilihan meja dan pesanan dine-in</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                  Always Active
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <div>
                  <span className="text-sm text-white font-medium">Takeaway (Bungkus)</span>
                  <p className="text-xs text-muted">Kemasan bawa pulang tanpa nomor meja</p>
                </div>
                <label className="posa-switch">
                  <input
                    type="checkbox"
                    checked={takeaway}
                    onChange={(e) => {
                      setTakeaway(e.target.checked);
                      updateSettings({ order_type_takeaway: e.target.checked });
                    }}
                  />
                  <span className="posa-slider" />
                </label>
              </div>
            </div>
          </div>

          {/* Delivery apps */}
          <div className="mt-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm text-blue-400 font-semibold mb-1">
              <Bike size={16} />
              <span>Integrasi Aplikasi Ojek Online</span>
            </div>
            <p className="text-xs text-muted mb-3">
              Pencatatan order dari GoFood, GrabFood, dan ShopeeFood ke sistem laporan kasir.
            </p>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-white font-medium">GoFood</span>
                <label className="posa-switch">
                  <input
                    type="checkbox"
                    checked={goFood}
                    onChange={(e) => {
                      setGoFood(e.target.checked);
                      updateSettings({ delivery_gofood: e.target.checked });
                    }}
                  />
                  <span className="posa-slider" />
                </label>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-white font-medium">GrabFood</span>
                <label className="posa-switch">
                  <input
                    type="checkbox"
                    checked={grabFood}
                    onChange={(e) => {
                      setGrabFood(e.target.checked);
                      updateSettings({ delivery_grabfood: e.target.checked });
                    }}
                  />
                  <span className="posa-slider" />
                </label>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-white font-medium">ShopeeFood</span>
                <label className="posa-switch">
                  <input
                    type="checkbox"
                    checked={shopeeFood}
                    onChange={(e) => {
                      setShopeeFood(e.target.checked);
                      updateSettings({ delivery_shopeefood: e.target.checked });
                    }}
                  />
                  <span className="posa-slider" />
                </label>
              </div>
            </div>
          </div>

          {/* Supervisor Approval */}
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm text-blue-400 font-semibold mb-1">
                  <ShieldCheck size={16} />
                  <span>Supervisor PIN Approval</span>
                </div>
                <p className="text-xs text-muted max-w-xl">
                  Mewajibkan PIN Owner atau Supervisor saat kasir melakukan diskon khusus, refund, atau void transaksi.
                </p>
              </div>
              <label className="posa-switch flex-shrink-0">
                <input
                  type="checkbox"
                  checked={supervisorPinRequired}
                  onChange={(e) => {
                    setSupervisorPinRequired(e.target.checked);
                    showToast(e.target.checked ? 'Otorisasi Supervisor diaktifkan' : 'Otorisasi Supervisor dinonaktifkan');
                  }}
                />
                <span className="posa-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* 6. Payment: QRIS */}
        <div className="posa-admin-card">
          <h2 className="posa-card-title mb-1">Payment: QRIS Standar Statis / Dinamis</h2>
          <p className="posa-card-subtitle mb-4">
            Unggah gambar barcode QRIS dari bank atau payment gateway Anda. Gambar ini ditampilkan kepada pelanggan pada saat memilih metode pembayaran QRIS di kasir.
          </p>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-36 h-36 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg border border-slate-700 flex-shrink-0">
              <img
                src="/QRIS.jpeg"
                alt="QRIS Staycy"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left">
              <button
                type="button"
                className="posa-btn-outline"
                onClick={() => showToast('Membuka file dialog Unggah QRIS')}
              >
                <Upload size={16} />
                <span>Upload Barcode Baru</span>
              </button>
              <span className="text-[11px] text-muted max-w-xs">
                Format didukung: PNG, JPG, atau JPEG. Ukuran rekomendasi minimal 400x400 piksel.
              </span>
            </div>
          </div>
        </div>

        {/* 6B. Kosongkan Data Contoh (Siap Isi Baru) */}
        <div className="posa-admin-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                <RotateCcw size={18} />
                <span>Kosongkan Semua Data Contoh (Mulai Fresh)</span>
              </div>
              <p className="text-xs text-muted max-w-xl leading-relaxed">
                Menghapus semua menu, bahan baku, transaksi, keranjang, dan laporan contoh. Database akan menjadi kosongan bersih sehingga Anda tinggal menambahkan data asli bisnis Anda tanpa harus menghapus satu persatu.
              </p>
            </div>
            <button
              type="button"
              className="posa-btn-outline border-amber-500/50 text-amber-400 hover:bg-amber-500/10 flex-shrink-0"
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh data contoh? Sistem akan di-reset menjadi kosongan bersih dan siap diisi data baru.')) {
                  clearAllSampleData();
                }
              }}
            >
              <RotateCcw size={15} />
              <span>Kosongkan Data Contoh</span>
            </button>
          </div>
        </div>

        {/* 7. Danger Zone */}
        <div className="posa-danger-zone-card">
          <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
            <AlertTriangle size={18} />
            <span>Danger Zone</span>
          </div>

          <h3 className="text-white font-semibold text-sm mb-1">Hapus Akun & Data Perusahaan</h3>
          <p className="text-xs text-red-300/80 mb-4 leading-relaxed">
            Peringatan: Tindakan ini permanen. Seluruh profil perusahaan, akun kasir/staf, menu, resep, data bahan baku, serta riwayat laporan keuangan akan dihapus secara menyeluruh.
          </p>

          <div className="space-y-3 max-w-md">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Ketik <strong className="text-red-400">"CONFIRM"</strong> untuk melanjutkan
              </label>
              <input
                type="text"
                className="posa-input w-full"
                placeholder='Ketik "CONFIRM"'
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Kata Sandi Akun Master</label>
              <input
                type="password"
                className="posa-input w-full"
                placeholder="••••••••"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="posa-btn-sm text-danger w-full py-2.5 font-bold"
              disabled={deleteConfirmText !== 'CONFIRM' || !deletePassword}
              style={{
                opacity: deleteConfirmText === 'CONFIRM' && deletePassword ? 1 : 0.4,
                cursor: deleteConfirmText === 'CONFIRM' && deletePassword ? 'pointer' : 'not-allowed'
              }}
              onClick={() => {
                if (window.confirm('PERINGATAN TERAKHIR: Seluruh akun dan data bisnis akan dihapus selamanya dari perangkat ini. Lanjutkan?')) {
                  const res = deleteMasterAccountAndReset(deletePassword);
                  if (!res.success) {
                    showToast(res.message, 'error');
                  }
                }
              }}
            >
              Hapus Perusahaan Selamanya
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog: Ubah Kata Sandi Master (Account Password) */}
      {showPasswordModal && (
        <div className="modal-backdrop-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-dialog-box" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <KeyRound size={18} className="text-emerald-400" />
                <span className="modal-title">Ubah Kata Sandi Master</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePassword}>
              <div className="modal-body space-y-4">
                <p className="text-xs text-muted leading-relaxed">
                  Kata sandi master digunakan untuk login otorisasi akun pemilik (Owner), menghubungkan perangkat tablet baru, dan mengubah pengaturan sensitif.
                </p>

                {passwordError && (
                  <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Kata Sandi Lama (Opsional untuk Reset)
                  </label>
                  <input
                    type="password"
                    className="posa-input w-full"
                    placeholder="Masukkan kata sandi lama (jika ada)"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-300">
                      Kata Sandi Baru (Min. 6 Karakter) *
                    </label>
                    <button
                      type="button"
                      className="text-[11px] text-emerald-400 flex items-center gap-1 hover:underline"
                      onClick={() => setShowNewPass(!showNewPass)}
                    >
                      {showNewPass ? <EyeOff size={12} /> : <Eye size={12} />}
                      <span>{showNewPass ? 'Sembunyikan' : 'Lihat'}</span>
                    </button>
                  </div>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    className="posa-input w-full font-mono"
                    placeholder="Minimal 6 karakter kombinasi"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Ulangi Kata Sandi Baru *
                  </label>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    className="posa-input w-full font-mono"
                    placeholder="Ketik ulang kata sandi baru"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="posa-btn-outline"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="buat-laporan-btn"
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                >
                  Simpan Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
