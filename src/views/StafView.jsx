import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
import Sidebar from '../components/Sidebar';
import {
  Users,
  UserPlus,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Maximize2,
  X
} from 'lucide-react';

export default function StafView() {
  const {
    staffList,
    addStaff,
    updateStaff,
    deleteStaff,
    language,
    setLanguage,
    toggleFullscreen,
    setShowAdminPinModal,
    setAdminPinConfig,
    showToast
  } = usePos();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [showPinId, setShowPinId] = useState(null); // id staf yang pin-nya diintip

  // Modal Tambah / Edit Staf
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Kasir',
    pin: '',
    phone: '',
    shift: 'Shift Pagi (07:00 - 15:00)',
    status: 'Aktif',
    permissions: ['cashier_pos', 'print_receipt']
  });

  const availablePermissions = [
    { key: 'cashier_pos', label: 'Buka Kasir & Transaksi POS' },
    { key: 'manual_discount', label: 'Otorisasi Diskon Manual' },
    { key: 'void_transaction', label: 'Otorisasi Void / Batal Transaksi' },
    { key: 'cash_drawer', label: 'Buka Laci Kas & Tutup Shift' },
    { key: 'stock_manage', label: 'Manajemen Stok & Restock' },
    { key: 'financial_report', label: 'Akses Laporan Keuangan & Laba' }
  ];

  const handleOpenAddModal = () => {
    setEditingStaffId(null);
    setFormData({
      name: '',
      email: '',
      role: 'Kasir',
      pin: '',
      phone: '',
      shift: 'Shift Pagi (07:00 - 15:00)',
      status: 'Aktif',
      permissions: ['cashier_pos', 'print_receipt']
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff) => {
    setEditingStaffId(staff.id);
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      pin: staff.pin,
      phone: staff.phone,
      shift: staff.shift,
      status: staff.status,
      permissions: staff.permissions || []
    });
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permKey) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permKey)
          : [...prev.permissions, permKey]
      };
    });
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Nama staf wajib diisi', 'warning');
      return;
    }
    if (!formData.pin || formData.pin.length < 4) {
      showToast('PIN harus berupa 4 digit angka', 'warning');
      return;
    }

    if (editingStaffId) {
      updateStaff(editingStaffId, formData);
    } else {
      addStaff(formData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteStaffWithAuth = (staff) => {
    if (staff.role === 'Owner') {
      showToast('Akun Owner utama tidak dapat dihapus', 'warning');
      return;
    }

    setAdminPinConfig({
      title: `Konfirmasi Hapus Staf: ${staff.name}`,
      requireReason: false,
      onSuccess: () => {
        deleteStaff(staff.id);
      }
    });
    setShowAdminPinModal(true);
  };

  // Filter Staf
  const filteredStaff = staffList.filter((s) => {
    const matchName =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);
    const matchRole = roleFilter === 'Semua' || s.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchName && matchRole;
  });

  const totalActive = staffList.filter((s) => s.status === 'Aktif').length;
  const totalKasir = staffList.filter((s) => s.role.includes('Kasir') || s.role.includes('Barista')).length;

  return (
    <div className="view-main-container">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="admin-content-area">
        {/* Header */}
        <div className="admin-header-row">
          <div>
            <h1 className="admin-page-title">Manajemen Staf & Hak Akses (Role)</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Atur akun kasir, barista, supervisor, PIN otorisasi, dan perizinan fitur POS.
            </p>
          </div>

          <div className="admin-header-tools">
            <button className="tool-icon-btn" onClick={toggleFullscreen} title="Layar Penuh">
              <Maximize2 size={16} />
            </button>

            <div className="lang-switch-group">
              <button
                className={`lang-btn ${language === 'ID' ? 'active' : ''}`}
                onClick={() => setLanguage('ID')}
              >
                ID
              </button>
              <button
                className={`lang-btn ${language === 'EN' ? 'active' : ''}`}
                onClick={() => setLanguage('EN')}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="stat-cards-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '18px' }}>
          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Total Staf Terdaftar</span>
              <span className="stat-value">{staffList.length} Orang</span>
              <span className="stat-subtext" style={{ color: '#10b981' }}>
                {totalActive} staf berstatus aktif operasional
              </span>
            </div>
            <div className="stat-icon-wrapper blue">
              <Users size={20} />
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Staf Kasir & Barista</span>
              <span className="stat-value">{totalKasir} Orang</span>
              <span className="stat-subtext">Akses kasir POS & cetak struk</span>
            </div>
            <div className="stat-icon-wrapper yellow">
              <Clock size={20} />
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Tingkat Hak Akses</span>
              <span className="stat-value">3 Tingkatan</span>
              <span className="stat-subtext" style={{ color: '#60a5fa' }}>Owner, Supervisor, Kasir</span>
            </div>
            <div className="stat-icon-wrapper blue">
              <Shield size={20} />
            </div>
          </div>
        </div>

        {/* Filter & Action Bar */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Cari nama, email, no HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="kasir-search-input"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          {/* Role Filters */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Semua', 'Owner', 'Supervisor', 'Kasir'].map((role) => (
              <button
                key={role}
                className={`category-pill ${roleFilter === role ? 'active' : ''}`}
                onClick={() => setRoleFilter(role)}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Add Staff Button */}
          <div style={{ marginLeft: 'auto' }}>
            <button className="tambah-bahan-btn" onClick={handleOpenAddModal}>
              <UserPlus size={16} />
              <span>Tambah Staf Baru</span>
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="dasbor-card-box" style={{ padding: '0 0 10px 0' }}>
          <div className="data-table-container">
            <table className="posa-table">
              <thead>
                <tr>
                  <th>Nama & Email</th>
                  <th>Role / Jabatan</th>
                  <th>Shift Kerja</th>
                  <th>PIN Akses</th>
                  <th>Hak Akses Utama</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => {
                  const isOwner = staff.role === 'Owner';
                  const isVisiblePin = showPinId === staff.id;

                  return (
                    <tr key={staff.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: isOwner ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              color: isOwner ? '#60a5fa' : 'var(--text-primary)',
                              fontSize: '13px'
                            }}
                          >
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <div className="item-name-bold">{staff.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {staff.email} • {staff.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            backgroundColor: isOwner
                              ? 'rgba(59, 130, 246, 0.18)'
                              : staff.role.includes('Supervisor')
                              ? 'rgba(245, 158, 11, 0.18)'
                              : 'rgba(16, 185, 129, 0.18)',
                            color: isOwner ? '#60a5fa' : staff.role.includes('Supervisor') ? '#fbbf24' : '#10b981'
                          }}
                        >
                          {staff.role}
                        </span>
                      </td>

                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {staff.shift}
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '13px',
                              fontWeight: 700,
                              letterSpacing: isVisiblePin ? '2px' : '3px',
                              color: isVisiblePin ? '#60a5fa' : 'var(--text-muted)'
                            }}
                          >
                            {isVisiblePin ? staff.pin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPinId(isVisiblePin ? null : staff.id)}
                            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                            title={isVisiblePin ? 'Sembunyikan PIN' : 'Lihat PIN'}
                          >
                            {isVisiblePin ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '240px' }}>
                          {isOwner ? (
                            <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600 }}>
                              Akses Penuh (Super Admin)
                            </span>
                          ) : (
                            (staff.permissions || []).slice(0, 2).map((p) => {
                              const found = availablePermissions.find((ap) => ap.key === p);
                              return (
                                <span
                                  key={p}
                                  style={{
                                    fontSize: '10.5px',
                                    padding: '2px 6px',
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                    borderRadius: '4px',
                                    color: 'var(--text-secondary)'
                                  }}
                                >
                                  {found ? found.label.split(' ')[0] + ' ' + (found.label.split(' ')[1] || '') : p}
                                </span>
                              );
                            })
                          )}
                          {!isOwner && (staff.permissions || []).length > 2 && (
                            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                              +{staff.permissions.length - 2} lainnya
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: staff.status === 'Aktif' ? '#10b981' : '#f59e0b'
                          }}
                        >
                          {staff.status === 'Aktif' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {staff.status}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            className="table-action-icon-btn edit"
                            onClick={() => handleOpenEditModal(staff)}
                            title="Edit Staf"
                          >
                            <Edit2 size={14} />
                          </button>
                          {!isOwner && (
                            <button
                              className="table-action-icon-btn delete"
                              onClick={() => handleDeleteStaffWithAuth(staff)}
                              title="Hapus Staf"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Tambah / Edit Staf */}
      {isModalOpen && (
        <div className="modal-backdrop-overlay">
          <div className="modal-dialog-box" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title">
                {editingStaffId ? 'Edit Data Staf' : 'Tambah Staf Baru'}
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStaff}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    className="kasir-search-input"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="kasir-search-input"
                      placeholder="budi@posacoffee.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Nomor HP / WA *
                    </label>
                    <input
                      type="text"
                      required
                      className="kasir-search-input"
                      placeholder="08123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Role / Jabatan *
                    </label>
                    <select
                      className="cart-select-field"
                      style={{ width: '100%' }}
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="Kasir">Kasir</option>
                      <option value="Barista / Kasir">Barista / Kasir</option>
                      <option value="Supervisor / Manager">Supervisor / Manager</option>
                      <option value="Owner">Owner</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      PIN Akses (4 Digit) *
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      className="kasir-search-input"
                      placeholder="4 Digit PIN"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Jadwal Shift
                    </label>
                    <select
                      className="cart-select-field"
                      style={{ width: '100%' }}
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    >
                      <option value="Shift Pagi (07:00 - 15:00)">Shift Pagi (07:00 - 15:00)</option>
                      <option value="Shift Sore (15:00 - 23:00)">Shift Sore (15:00 - 23:00)</option>
                      <option value="Shift Fleksibel">Shift Fleksibel</option>
                      <option value="Semua Shift">Semua Shift</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Status Karyawan
                    </label>
                    <select
                      className="cart-select-field"
                      style={{ width: '100%' }}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Cuti">Cuti</option>
                      <option value="Non-aktif">Non-aktif</option>
                    </select>
                  </div>
                </div>

                {/* Permissions Checkbox Grid */}
                <div style={{ marginTop: '6px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Hak Akses / Otorisasi POS
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      padding: '10px',
                      borderRadius: '8px'
                    }}
                  >
                    {availablePermissions.map((perm) => (
                      <label
                        key={perm.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11.5px',
                          color: 'var(--text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.key)}
                          onChange={() => handleTogglePermission(perm.key)}
                        />
                        <span>{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="tutup-kasir-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="buat-laporan-btn">
                  Simpan Staf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
