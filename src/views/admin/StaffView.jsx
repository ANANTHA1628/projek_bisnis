import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Search, Plus, UserPlus, Edit2, Key, Phone, Mail, Shield, Check, X } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function StaffView() {
  const { staffList, addStaff, updateStaff, deleteStaff, currentUser, showToast, playSound } = usePos();
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Cashier');
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [active, setActive] = useState('Yes');
  const [shift, setShift] = useState('Shift Pagi (08:00 - 16:00)');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  );

  const getPermissionsForRole = (r) => {
    switch (r) {
      case 'Owner':
        return 'Manage All';
      case 'Supervisor':
        return 'Day-to-day running (not the account)';
      case 'Manager':
        return 'Day-to-day running & inventory';
      case 'Barista':
        return 'Cashier POS & Kitchen';
      case 'Cashier':
      default:
        return 'Cashier POS only';
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setName('');
    setRole('Cashier');
    setPin('');
    setPhone('');
    setEmail('');
    setActive('Yes');
    setShift('Shift Pagi (08:00 - 16:00)');
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (staff) => {
    setModalMode('edit');
    setEditingId(staff.id);
    setName(staff.name || '');
    setRole(staff.role || 'Cashier');
    setPin(staff.pin || '');
    setPhone(staff.phone || '');
    setEmail(staff.email || '');
    setActive(staff.active || 'Yes');
    setShift(staff.shift || 'Shift Pagi (08:00 - 16:00)');
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Nama karyawan wajib diisi');
      return;
    }

    if (!pin.trim()) {
      setErrorMsg('PIN login kasir / backoffice (4 - 6 digit) wajib diisi');
      return;
    }

    if (pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
      setErrorMsg('PIN harus berupa 4 sampai 6 angka (contoh: 1234 atau 123456)');
      return;
    }

    // Check duplicate PIN with other staff
    const pinConflict = staffList.find(
      (s) => s.pin === pin && s.id !== editingId
    );
    if (pinConflict) {
      setErrorMsg(`PIN ${pin} sudah digunakan oleh ${pinConflict.name}. Gunakan PIN lain.`);
      return;
    }

    const payload = {
      name: name.trim(),
      role,
      pin,
      phone: phone.trim() || '081234567890',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@staycy.local`,
      active,
      shift,
      permissions: getPermissionsForRole(role)
    };

    if (modalMode === 'create') {
      addStaff(payload);
      playSound('success');
      showToast(`Karyawan baru ${payload.name} berhasil ditambahkan!`, 'success');
    } else {
      updateStaff(editingId, payload);
      playSound('success');
      showToast(`Data staf ${payload.name} berhasil diperbarui!`, 'success');
    }

    setShowModal(false);
  };

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Staff Management" />

      <div className="posa-admin-card">
        {/* Toolbar: Search & Add Staff button */}
        <div className="posa-card-toolbar">
          <div className="posa-search-wrapper flex-1">
            <Search size={16} className="posa-search-icon" />
            <input
              type="text"
              className="posa-search-input"
              placeholder="Search staff by name, role or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="posa-btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={16} />
            <span>Add Staff</span>
          </button>
        </div>

        {/* Staff Table */}
        <div className="posa-table-container">
          <table className="posa-table">
            <thead>
              <tr>
                <th>Name (Login)</th>
                <th>Role</th>
                <th>PIN (Kiosk)</th>
                <th>Permissions</th>
                <th>Active</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => {
                const isOwner = staff.role === 'Owner';
                const isCurrentLoggedIn = currentUser?.name === staff.name || currentUser?.id === staff.id;
                return (
                  <tr key={staff.id} className={isCurrentLoggedIn ? 'posa-row-logged-in' : ''}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-white">{staff.name}</div>
                        {isCurrentLoggedIn && (
                          <span className="posa-badge-you">
                            Online (Anda)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted font-mono">{staff.email}</div>
                    </td>
                    <td>
                      <span className={`posa-badge-pill ${staff.role === 'Owner' ? 'bg-blue-600/30 text-blue-300' : staff.role === 'Supervisor' ? 'bg-amber-600/30 text-amber-300' : 'bg-slate-700/50 text-slate-300'}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs bg-[#161c2d] px-2 py-1 rounded text-slate-300 border border-slate-700/50">
                        •••• ({staff.pin})
                      </span>
                    </td>
                    <td className="text-slate-400 text-sm">{staff.permissions || 'Standard'}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className={`posa-status-indicator-dot ${staff.active === 'No' ? 'inactive' : 'active'}`} />
                        <span className={staff.active === 'No' ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                          {staff.active === 'No' ? 'Disabled' : 'Active'}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="posa-table-actions justify-end">
                        <button
                          type="button"
                          className="posa-btn-sm"
                          onClick={() => openEditModal(staff)}
                          title="Edit data staf"
                        >
                          Edit
                        </button>
                        {!isOwner && (
                          <>
                            <button
                              type="button"
                              className="posa-btn-sm"
                              onClick={() => {
                                updateStaff(staff.id, { active: staff.active === 'No' ? 'Yes' : 'No' });
                              }}
                              title={staff.active === 'No' ? 'Aktifkan kembali' : 'Nonaktifkan sementara'}
                            >
                              {staff.active === 'No' ? 'Enable' : 'Disable'}
                            </button>
                            <button
                              type="button"
                              className="posa-btn-sm text-danger"
                              onClick={() => {
                                if (window.confirm(`Hapus karyawan ${staff.name}?`)) {
                                  deleteStaff(staff.id);
                                }
                              }}
                              title="Hapus staf"
                            >
                              Delete
                            </button>
                          </>
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

      {/* MODAL FORM TAMBAH / EDIT KARYAWAN */}
      {showModal && (
        <div className="posa-modal-overlay">
          <div className="posa-staff-modal-card">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">
                    {modalMode === 'create' ? 'Tambah Karyawan Baru' : `Edit Karyawan: ${name}`}
                  </h2>
                  <p className="text-xs text-muted">
                    Atur nama, peran akses (Owner, Supervisor, Kasir) dan PIN login 6 digit.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="posa-action-icon-btn"
                onClick={() => setShowModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 bg-red-950/40 border border-red-500/30 rounded-lg text-red-400 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Row 1: Nama Lengkap & Peran / Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="posa-label">Nama Lengkap *</label>
                  <input
                    type="text"
                    className="posa-input w-full"
                    placeholder="Contoh: Rian Pratama"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMsg('');
                    }}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="posa-label">Peran / Role *</label>
                  <select
                    className="posa-select w-full"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Cashier">Cashier / Kasir (POS Saja)</option>
                    <option value="Barista">Barista / Kasir</option>
                    <option value="Supervisor">Supervisor (POS & Day-to-day)</option>
                    <option value="Manager">Manager</option>
                    <option value="Owner">Owner (Akses Penuh)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: PIN 6 Digit & Status Aktif */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="posa-label">
                    PIN Login Kiosk (4 - 6 Angka) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="posa-input w-full font-mono text-center tracking-widest text-base"
                      maxLength={6}
                      placeholder="Contoh: 0000 atau 123456"
                      value={pin}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPin(val);
                        setErrorMsg('');
                      }}
                    />
                    <Key size={14} className="posa-search-icon" />
                  </div>
                  <span className="text-[11px] text-muted mt-1 block">
                    Digunakan saat login di layar sentuh POS Kiosk.
                  </span>
                </div>

                <div>
                  <label className="posa-label">Status Keaktifan</label>
                  <select
                    className="posa-select w-full"
                    value={active}
                    onChange={(e) => setActive(e.target.value)}
                  >
                    <option value="Yes">Yes (Aktif bekerja)</option>
                    <option value="No">No (Dinonaktifkan / Cuti)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Kontak Telepon & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="posa-label">Nomor WhatsApp / HP</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="posa-input w-full"
                      placeholder="081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <Phone size={14} className="posa-search-icon" />
                  </div>
                </div>

                <div>
                  <label className="posa-label">Alamat Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      className="posa-input w-full"
                      placeholder="karyawan@staycy.local"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail size={14} className="posa-search-icon" />
                  </div>
                </div>
              </div>

              {/* Row 4: Shift Kerja */}
              <div>
                <label className="posa-label">Jadwal Shift Kerja</label>
                <select
                  className="posa-select w-full"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                >
                  <option value="Shift Pagi (08:00 - 16:00)">Shift Pagi (08:00 - 16:00)</option>
                  <option value="Shift Sore (15:00 - 23:00)">Shift Sore (15:00 - 23:00)</option>
                  <option value="Shift Penuh / Fleksibel">Shift Penuh / Fleksibel</option>
                  <option value="Semua Shift">Semua Shift</option>
                </select>
              </div>

              {/* Permissions Info Box */}
              <div className="p-3 bg-[#0d121c] rounded-lg border border-slate-800 text-xs flex items-start gap-2.5">
                <Shield size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">
                    Hak Akses: {getPermissionsForRole(role)}
                  </div>
                  <div className="text-slate-400 mt-0.5">
                    {role === 'Owner' && 'Dapat mengakses seluruh menu finansial, bahan baku, pengaturan toko, dan kasir.'}
                    {role === 'Supervisor' && 'Dapat membatalkan pesanan (void), diskon manual, memulai Kitchen Screen, dan mengoperasikan kasir.'}
                    {(role === 'Cashier' || role === 'Barista') && 'Hanya dapat melayani pesanan transaksi penjualan di POS Kiosk, cetak struk, dan buka shift.'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  className="posa-btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="posa-btn-primary px-5"
                >
                  <Check size={16} />
                  <span>{modalMode === 'create' ? 'Simpan Karyawan' : 'Perbarui Karyawan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
