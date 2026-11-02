import React, { useState, useRef } from 'react';
import AdminHeader from '../../components/AdminHeader';
import {
  Terminal,
  Shield,
  KeyRound,
  Database,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Users,
  Copy,
  Check,
  Download,
  Upload,
  AlertTriangle,
  ArrowRight,
  Settings,
  Sparkles,
  Cpu,
  Activity,
  LogOut,
  ExternalLink,
  Edit3,
  Trash2,
  Store,
  Mail,
  Phone,
  ShieldAlert,
  Play
} from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function DeveloperView() {
  const {
    currentUser,
    masterAccount,
    masterAccountsVault,
    devCredentials,
    updateDeveloperCredentials,
    updateMasterAccountByDev,
    impersonateUser,
    isImpersonatingByDev,
    exitImpersonation,
    exportSystemDatabase,
    importSystemDatabase,
    settings,
    updateSettings,
    staffList,
    updateStaff,
    deleteStaff,
    products,
    rawMaterials,
    transactions,
    currentShift,
    openShift,
    closeShift,
    setIsKioskMode,
    setIsKioskLocked,
    showToast,
    playSound
  } = usePos();

  const [activeTab, setActiveTab] = useState('master'); // 'master' | 'staff' | 'dev-creds' | 'database'
  const fileImportRef = useRef(null);

  // State untuk mengintip kata sandi
  const [showMasterPass, setShowMasterPass] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // State modal edit master account
  const [showEditMasterModal, setShowEditMasterModal] = useState(false);
  const [editMasterName, setEditMasterName] = useState(masterAccount?.name || '');
  const [editMasterStore, setEditMasterStore] = useState(settings?.store_name || '');
  const [editMasterEmail, setEditMasterEmail] = useState(masterAccount?.email || '');
  const [editMasterPass, setEditMasterPass] = useState('');
  const [editMasterPin, setEditMasterPin] = useState(masterAccount?.pin || settings?.admin_pin || '1234');

  // State modal edit staff PIN
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editStaffPin, setEditStaffPin] = useState('');
  const [editStaffRole, setEditStaffRole] = useState('Cashier');

  // State ubah kredensial developer
  const [newDevEmail, setNewDevEmail] = useState(devCredentials?.email || 'dev@posa.system');
  const [newDevPass, setNewDevPass] = useState(devCredentials?.password || 'developer123');
  const [newDevPin, setNewDevPin] = useState(devCredentials?.pin || '9999');

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playSound('click');
    showToast('Tersalin ke clipboard!', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveMasterChanges = (e) => {
    e.preventDefault();
    updateMasterAccountByDev({
      name: editMasterName,
      storeName: editMasterStore,
      email: editMasterEmail,
      password: editMasterPass || undefined,
      pin: editMasterPin
    });
    playSound('success');
    setShowEditMasterModal(false);
  };

  const handleSaveStaffChanges = (e) => {
    e.preventDefault();
    if (selectedStaff) {
      updateStaff(selectedStaff.id, {
        pin: editStaffPin,
        role: editStaffRole
      });
      playSound('success');
      setShowEditStaffModal(false);
      showToast(`PIN & Peran untuk ${selectedStaff.name} berhasil diperbarui!`, 'success');
    }
  };

  const handleSaveDevCreds = (e) => {
    e.preventDefault();
    updateDeveloperCredentials({
      email: newDevEmail,
      password: newDevPass,
      pin: newDevPin
    });
    playSound('success');
  };

  const activeMasterPassword =
    localStorage.getItem('posa_master_password') || settings.account_password || 'Belum diatur';

  return (
    <div className="posa-admin-page-container">
      {/* Impersonation Warning Banner */}
      {isImpersonatingByDev && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            color: '#facc15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} />
            <div>
              <strong>Mode Impersonasi Sedang Aktif:</strong> Masuk sebagai{' '}
              <strong>
                {currentUser?.name} ({currentUser?.role})
              </strong>
            </div>
          </div>
          <button
            type="button"
            onClick={exitImpersonation}
            className="buat-laporan-btn"
            style={{ padding: '6px 14px', fontSize: '12px', backgroundColor: '#eab308', color: '#000000' }}
          >
            Kembali ke Developer Console
          </button>
        </div>
      )}

      {/* Main Developer Header */}
      <div
        style={{
          padding: '24px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.18) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(168, 85, 247, 0.15)',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(168, 85, 247, 0.25)',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  color: '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Terminal size={20} />
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.3px' }}>
                Developer & Superadmin Console
              </h1>
              <span
                style={{
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#c084fc',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.5px'
                }}
              >
                ROOT ACCESS
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1' }}>
              Pusat Otoritas Tertinggi: Akses seluruh daftar Akun Master (Pemilik), intip & reset kata sandi, kontrol penuh staf kasir, dan cadangan database.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="posa-btn-outline"
              onClick={exportSystemDatabase}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }}
              title="Unduh seluruh data sebagai JSON"
            >
              <Download size={14} />
              <span>Backup JSON</span>
            </button>

            <button
              type="button"
              className="posa-btn-outline"
              onClick={() => fileImportRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }}
              title="Pulihkan data dari file JSON"
            >
              <Upload size={14} />
              <span>Restore JSON</span>
            </button>
            <input
              type="file"
              ref={fileImportRef}
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const content = event.target?.result;
                    if (content) {
                      importSystemDatabase(content);
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />

            <button
              type="button"
              className="buat-laporan-btn"
              onClick={() => {
                setIsKioskMode(true);
                setIsKioskLocked(false);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }}
            >
              <Store size={14} />
              <span>Buka Kasir Kiosk</span>
            </button>
          </div>
        </div>

        {/* Quick Diagnostic Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              Akun Master Aktif
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              {masterAccount ? masterAccount.name : 'Belum Ada'}
            </div>
            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>
              {settings.store_name || 'posa'} • PIN: {settings.admin_pin || '1234'}
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              Total Staf & Kasir
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              {staffList.length} Akun
            </div>
            <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
              Semua PIN terlihat di Developer
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              Data & Transaksi
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              {products.length} Menu • {transactions.length} Trx
            </div>
            <div style={{ fontSize: '11px', color: '#c084fc', marginTop: '2px' }}>
              {rawMaterials.length} Bahan Baku Tersimpan
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              Developer PIN Cepat
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#c084fc', fontFamily: 'monospace', marginTop: '4px' }}>
              {devCredentials?.pin || '9999'}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              Bisa langsung ketik di Keypad Kiosk
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('master')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'master' ? '2px solid #a855f7' : '2px solid transparent',
            backgroundColor: activeTab === 'master' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
            color: activeTab === 'master' ? '#c084fc' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Shield size={16} />
          <span>Daftar Akun Master & Kata Sandi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('staff')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'staff' ? '2px solid #a855f7' : '2px solid transparent',
            backgroundColor: activeTab === 'staff' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
            color: activeTab === 'staff' ? '#c084fc' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Users size={16} />
          <span>Manajemen Kasir & PIN Staf ({staffList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dev-creds')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'dev-creds' ? '2px solid #a855f7' : '2px solid transparent',
            backgroundColor: activeTab === 'dev-creds' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
            color: activeTab === 'dev-creds' ? '#c084fc' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <KeyRound size={16} />
          <span>Kredensial Developer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('database')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'database' ? '2px solid #a855f7' : '2px solid transparent',
            backgroundColor: activeTab === 'database' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
            color: activeTab === 'database' ? '#c084fc' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Database size={16} />
          <span>Sistem Database & Override</span>
        </button>
      </div>

      {/* TAB 1: LIST AKUN MASTER & PASSWORD VAULT */}
      {activeTab === 'master' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Master Account Card */}
          <div className="posa-admin-card" style={{ border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    Akun Master Pemilik (Owner Aktif Saat Ini)
                  </h2>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Akun yang berkuasa mengelola operasional toko dan backoffice
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="posa-btn-outline text-xs py-1.5 px-3"
                  onClick={() => {
                    setEditMasterName(masterAccount?.name || '');
                    setEditMasterStore(settings?.store_name || '');
                    setEditMasterEmail(masterAccount?.email || '');
                    setEditMasterPass('');
                    setEditMasterPin(masterAccount?.pin || settings?.admin_pin || '1234');
                    setShowEditMasterModal(true);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={14} />
                  <span>Ubah Kredensial Master</span>
                </button>

                {masterAccount && (
                  <button
                    type="button"
                    className="buat-laporan-btn text-xs py-1.5 px-3"
                    onClick={() => impersonateUser(masterAccount)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Play size={13} />
                    <span>Masuk sebagai Owner Ini</span>
                  </button>
                )}
              </div>
            </div>

            {masterAccount ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {/* Nama Owner */}
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>NAMA PEMILIK</span>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{masterAccount.name}</div>
                  <span style={{ fontSize: '11px', color: '#10b981' }}>Role: {masterAccount.role}</span>
                </div>

                {/* Nama Usaha */}
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>NAMA BRAND USAHA</span>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{settings.store_name || 'posa'}</div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{settings.store_tagline || 'Modern Cafe & POS'}</span>
                </div>

                {/* Email Master */}
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>EMAIL MASTER</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(masterAccount.email, 'master_email')}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0 }}
                      title="Salin Email"
                    >
                      {copiedKey === 'master_email' ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
                    {masterAccount.email}
                  </div>
                </div>

                {/* Password Master */}
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>KATA SANDI MASTER</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setShowMasterPass(!showMasterPass)}
                        style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', padding: 0 }}
                        title={showMasterPass ? 'Sembunyikan' : 'Lihat'}
                      >
                        {showMasterPass ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeMasterPassword, 'master_pass')}
                        style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0 }}
                        title="Salin Kata Sandi"
                      >
                        {copiedKey === 'master_pass' ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>
                    {showMasterPass ? activeMasterPassword : '••••••••••••'}
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                    {showMasterPass ? 'Password terlihat oleh Developer' : 'Klik icon mata untuk melihat'}
                  </span>
                </div>

                {/* PIN Kiosk Master */}
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>PIN KIOSK MASTER</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(masterAccount.pin || settings.admin_pin, 'master_pin')}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0 }}
                      title="Salin PIN"
                    >
                      {copiedKey === 'master_pin' ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#10b981', fontFamily: 'monospace', letterSpacing: '2px' }}>
                    {masterAccount.pin || settings.admin_pin || '1234'}
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Digunakan di Layar Kiosk Kasir</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                <AlertTriangle size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <p style={{ margin: 0 }}>Belum ada akun master yang terdaftar di perangkat ini.</p>
              </div>
            )}
          </div>

          {/* History Vault of Master Accounts */}
          <div className="posa-admin-card">
            <h2 className="posa-card-title mb-1">Riwayat Master Accounts Vault</h2>
            <p className="posa-card-subtitle mb-4">
              Daftar seluruh akun pemilik yang pernah didaftarkan pada browser ini beserta password dan waktu pendaftaran.
            </p>

            <div className="overflow-x-auto">
              <table className="posa-admin-table w-full text-left" style={{ fontSize: '12.5px' }}>
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Nama Pemilik</th>
                    <th className="py-2.5 px-3">Nama Brand Toko</th>
                    <th className="py-2.5 px-3">Email Master</th>
                    <th className="py-2.5 px-3">Kata Sandi</th>
                    <th className="py-2.5 px-3">PIN Kiosk</th>
                    <th className="py-2.5 px-3">Tanggal Dibuat</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {masterAccountsVault.length > 0 ? (
                    masterAccountsVault.map((m, idx) => (
                      <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/20">
                        <td className="py-3 px-3 font-semibold text-white">
                          {m.name}
                          {m.email === masterAccount?.email && (
                            <span className="ml-2 text-[10px] bg-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full font-bold">
                              AKTIF
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-300">{m.storeName || '-'}</td>
                        <td className="py-3 px-3 font-mono text-sky-400">{m.email}</td>
                        <td className="py-3 px-3 font-mono text-amber-400 font-bold">
                          {m.password || '••••••••'}
                        </td>
                        <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{m.pin || '1234'}</td>
                        <td className="py-3 px-3 text-slate-400 text-xs">{m.createdAt || m.joinedDate || '-'}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            className="posa-btn-outline text-xs py-1 px-2.5 mr-1"
                            onClick={() => {
                              impersonateUser(m);
                            }}
                            title="Masuk sebagai akun ini"
                          >
                            Masuk
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-slate-500">
                        Belum ada riwayat akun master di vault.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STAFF & KASIR MANAGEMENT */}
      {activeTab === 'staff' && (
        <div className="posa-admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 className="posa-card-title mb-1">Manajemen Kasir & PIN Seluruh Staf</h2>
              <p className="posa-card-subtitle">
                Sebagai Developer, Anda dapat melihat seluruh PIN kasir dan mengubahnya seketika tanpa batas.
              </p>
            </div>
            <div style={{ fontSize: '12px', color: '#a855f7', fontWeight: 700 }}>
              {staffList.length} Staf Terdaftar
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="posa-admin-table w-full text-left" style={{ fontSize: '12.5px' }}>
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Nama Pegawai</th>
                  <th className="py-2.5 px-3">Peran (Role)</th>
                  <th className="py-2.5 px-3">PIN Kiosk</th>
                  <th className="py-2.5 px-3">Shift Kerja</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi Developer</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length > 0 ? (
                  staffList.map((s) => (
                    <tr key={s.id} className="border-b border-slate-800/60 hover:bg-slate-800/20">
                      <td className="py-3 px-3 font-semibold text-white">
                        {s.name}
                        {s.role === 'Owner' && (
                          <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 py-0.5 px-2 rounded-full font-bold">
                            OWNER
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`py-0.5 px-2 rounded text-xs font-bold ${
                            s.role === 'Owner'
                              ? 'bg-blue-600/30 text-blue-300'
                              : s.role === 'Supervisor'
                              ? 'bg-amber-600/30 text-amber-300'
                              : 'bg-emerald-600/30 text-emerald-300'
                          }`}
                        >
                          {s.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-400 text-sm">
                        {s.pin || '0000'}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-xs">{s.shift || 'Semua Shift'}</td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 text-xs font-semibold">● {s.status || 'Aktif'}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="posa-btn-outline text-xs py-1 px-2.5"
                            onClick={() => {
                              setSelectedStaff(s);
                              setEditStaffPin(s.pin || '');
                              setEditStaffRole(s.role || 'Cashier');
                              setShowEditStaffModal(true);
                            }}
                            title="Edit PIN Staf ini"
                          >
                            <KeyRound size={12} className="inline mr-1" />
                            <span>Ganti PIN</span>
                          </button>

                          <button
                            type="button"
                            className="buat-laporan-btn text-xs py-1 px-2.5"
                            onClick={() => impersonateUser(s)}
                            title="Masuk sebagai staf ini ke Kiosk"
                          >
                            <Play size={12} className="inline mr-1" />
                            <span>Impersonate</span>
                          </button>

                          {s.role !== 'Owner' && (
                            <button
                              type="button"
                              className="posa-btn-outline text-xs py-1 px-2 text-rose-400 hover:text-rose-300"
                              onClick={() => {
                                if (window.confirm(`Hapus staf ${s.name}?`)) {
                                  deleteStaff(s.id);
                                }
                              }}
                              title="Hapus staf"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-slate-500">
                      Belum ada staf terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KREDENSIAL DEVELOPER */}
      {activeTab === 'dev-creds' && (
        <div className="posa-admin-card" style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <KeyRound size={18} />
            </div>
            <div>
              <h2 className="posa-card-title mb-0">Ubah Kredensial Developer Superadmin</h2>
              <p className="posa-card-subtitle">
                Atur email login, kata sandi, dan PIN bypass root khusus akun pengembang.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveDevCreds} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Developer</label>
              <input
                type="text"
                className="posa-input w-full font-mono"
                value={newDevEmail}
                onChange={(e) => setNewDevEmail(e.target.value)}
                placeholder="dev@posa.system"
                required
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Gunakan email ini saat login di Layar Master Auth.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Kata Sandi Developer</label>
              <input
                type="text"
                className="posa-input w-full font-mono"
                value={newDevPass}
                onChange={(e) => setNewDevPass(e.target.value)}
                placeholder="developer123"
                required
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Kata sandi untuk membuka Developer Superadmin Console.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Developer Root PIN Kiosk (4-6 Angka)</label>
              <input
                type="text"
                maxLength={6}
                className="posa-input w-full font-mono font-bold text-amber-400"
                value={newDevPin}
                onChange={(e) => setNewDevPin(e.target.value.replace(/\D/g, ''))}
                placeholder="9999"
                required
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Ketikkan angka PIN ini pada Keypad Kiosk Kasir untuk langsung masuk ke Developer Console tanpa login.
              </span>
            </div>

            <button
              type="submit"
              className="buat-laporan-btn"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 700,
                backgroundColor: '#9333ea',
                marginTop: '8px'
              }}
            >
              Simpan Kredensial Developer
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: SYSTEM DATABASE & OVERRIDE */}
      {activeTab === 'database' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="posa-admin-card">
            <h2 className="posa-card-title mb-1">Override Sistem & Kontrol Shift Kasir</h2>
            <p className="posa-card-subtitle mb-4">
              Aksi manual darurat untuk developer memperbaiki status sistem kasir secara instan.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {/* Force Toggle Shift */}
              <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.25)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Status Shift Kasir: {currentShift.isOpen ? '🟢 TERBUKA' : '🔴 TERTUTUP'}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>
                  {currentShift.isOpen
                    ? `Kasir aktif: ${currentShift.cashierName} (Saldo awal Rp ${currentShift.openingCash.toLocaleString('id-ID')})`
                    : 'Kasir dalam keadaan tutup, kasir harus buka shift terlebih dahulu.'}
                </div>
                {currentShift.isOpen ? (
                  <button
                    type="button"
                    className="posa-btn-outline text-xs py-1.5 px-3 text-rose-400"
                    onClick={() => {
                      closeShift(currentShift.expectedCash || 0);
                      showToast('Shift kasir berhasil ditutup paksa oleh Developer', 'info');
                    }}
                  >
                    Tutup Paksa Shift Kasir
                  </button>
                ) : (
                  <button
                    type="button"
                    className="buat-laporan-btn text-xs py-1.5 px-3"
                    onClick={() => {
                      openShift('Developer Bypass', 100000);
                      showToast('Shift kasir dibuka paksa oleh Developer', 'success');
                    }}
                  >
                    Buka Paksa Shift Kasir (Rp 100.000)
                  </button>
                )}
              </div>

              {/* Force Lock to PIN */}
              <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.25)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Kunci Sesi ke Keypad PIN Kiosk
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>
                  Kunci seketika layar kasir dan kembali ke layar PIN keypad untuk karyawan selanjutnya.
                </div>
                <button
                  type="button"
                  className="posa-btn-outline text-xs py-1.5 px-3"
                  onClick={() => {
                    setIsKioskMode(true);
                    setIsKioskLocked(true);
                    showToast('Sesi kasir berhasil dikunci ke Layar PIN', 'info');
                  }}
                >
                  Kunci ke Layar PIN
                </button>
              </div>

              {/* Export Full JSON */}
              <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.25)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Download Full Database Dump
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>
                  Unduh seluruh database (produk, bahan baku, transaksi, akun, resep) sebagai file JSON.
                </div>
                <button
                  type="button"
                  className="buat-laporan-btn text-xs py-1.5 px-3"
                  onClick={exportSystemDatabase}
                >
                  <Download size={13} className="inline mr-1" />
                  <span>Download Backup JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MASTER ACCOUNT BY DEVELOPER */}
      {showEditMasterModal && (
        <div className="posa-modal-overlay" style={{ zIndex: 1200 }}>
          <div className="posa-dialog-card" style={{ maxWidth: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} className="text-purple-400" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  Ubah Kredensial Master (Root Override)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditMasterModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMasterChanges} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nama Pemilik (Owner)</label>
                <input
                  type="text"
                  className="posa-input w-full"
                  value={editMasterName}
                  onChange={(e) => setEditMasterName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nama Toko / Brand</label>
                <input
                  type="text"
                  className="posa-input w-full"
                  value={editMasterStore}
                  onChange={(e) => setEditMasterStore(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Master</label>
                <input
                  type="email"
                  className="posa-input w-full font-mono"
                  value={editMasterEmail}
                  onChange={(e) => setEditMasterEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Kata Sandi Baru (Kosongkan jika tidak ingin mengubah)
                </label>
                <input
                  type="text"
                  className="posa-input w-full font-mono text-amber-400"
                  placeholder="Masukkan kata sandi baru"
                  value={editMasterPass}
                  onChange={(e) => setEditMasterPass(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">PIN Kiosk Master (4-6 Digit)</label>
                <input
                  type="text"
                  maxLength={6}
                  className="posa-input w-full font-mono text-emerald-400 font-bold"
                  value={editMasterPin}
                  onChange={(e) => setEditMasterPin(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="posa-cancel-logout-btn"
                  style={{ flex: 1, padding: '10px' }}
                  onClick={() => setShowEditMasterModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="buat-laporan-btn"
                  style={{ flex: 1, padding: '10px', backgroundColor: '#9333ea' }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT STAFF PIN BY DEVELOPER */}
      {showEditStaffModal && selectedStaff && (
        <div className="posa-modal-overlay" style={{ zIndex: 1200 }}>
          <div className="posa-dialog-card" style={{ maxWidth: '420px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={18} className="text-purple-400" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  Ganti PIN Staf: {selectedStaff.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditStaffModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStaffChanges} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Peran Akses (Role)</label>
                <select
                  className="posa-input w-full"
                  value={editStaffRole}
                  onChange={(e) => setEditStaffRole(e.target.value)}
                >
                  <option value="Cashier">Kasir (Hanya Akses Kiosk)</option>
                  <option value="Barista">Barista (Kiosk POS & Dapur)</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Manager">Manager</option>
                  <option value="Owner">Owner (Akses Penuh)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  PIN Kiosk Baru (4-6 Digit Angka)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="posa-input w-full font-mono text-amber-400 font-bold"
                  value={editStaffPin}
                  onChange={(e) => setEditStaffPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Contoh: 0000"
                  required
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Kasir akan menggunakan PIN ini saat shift harian di Kiosk.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="posa-cancel-logout-btn"
                  style={{ flex: 1, padding: '10px' }}
                  onClick={() => setShowEditStaffModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="buat-laporan-btn"
                  style={{ flex: 1, padding: '10px', backgroundColor: '#9333ea' }}
                >
                  Simpan PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
