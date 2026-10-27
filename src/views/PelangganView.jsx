import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
import Sidebar from '../components/Sidebar';
import {
  UserCheck,
  UserPlus,
  Crown,
  Award,
  Phone,
  Mail,
  ShoppingBag,
  Sparkles,
  Search,
  Maximize2,
  Edit2,
  Trash2,
  MessageCircle,
  X,
  Calendar,
  CreditCard
} from 'lucide-react';

export default function PelangganView() {
  const {
    customerList,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    language,
    setLanguage,
    toggleFullscreen,
    showToast
  } = usePos();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('Semua');

  // Modal Tambah / Edit Pelanggan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustId, setEditingCustId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tier: 'Bronze',
    favoriteMenu: '',
    notes: ''
  });

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  // Format tanggal Indonesia yang manusiawi & rapi
  const formatTanggalWaktu = (dateStr) => {
    if (!dateStr || dateStr === 'Baru saja') return 'Hari ini (Baru saja)';
    try {
      const d = new Date(dateStr.replace(' ', 'T'));
      if (isNaN(d.getTime())) return dateStr;
      
      const tanggal = d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const waktu = d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${tanggal} • ${waktu} WIB`;
    } catch {
      return dateStr;
    }
  };

  const handleOpenAddModal = () => {
    setEditingCustId(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      tier: 'Bronze',
      favoriteMenu: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cust) => {
    setEditingCustId(cust.id);
    setFormData({
      name: cust.name,
      phone: cust.phone,
      email: cust.email || '',
      tier: cust.tier,
      favoriteMenu: cust.favoriteMenu || '',
      notes: cust.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Nama pelanggan wajib diisi', 'warning');
      return;
    }
    if (!formData.phone.trim()) {
      showToast('Nomor HP / WhatsApp wajib diisi', 'warning');
      return;
    }

    if (editingCustId) {
      updateCustomer(editingCustId, formData);
    } else {
      addCustomer(formData);
    }
    setIsModalOpen(false);
  };

  const handleWhatsAppSend = (cust) => {
    const text = encodeURIComponent(
      `Halo Kak ${cust.name}! Terima kasih telah menjadi pelanggan setia posa Coffee & Eatery. Saat ini kakak punya ${cust.points} Poin Reward Membership (${cust.tier}). Kunjungi outlet kami dan tukarkan promo menarik hari ini!`
    );
    window.open(`https://wa.me/${cust.phone.replace(/^0/, '62')}?text=${text}`, '_blank');
  };

  // Filter Pelanggan
  const filteredCustomers = customerList.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchTier = tierFilter === 'Semua' || c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const totalPoints = customerList.reduce((acc, c) => acc + (c.points || 0), 0);
  const totalLifetimeSpent = customerList.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
  const goldCount = customerList.filter((c) => c.tier === 'Gold VIP').length;

  return (
    <div className="view-main-container">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="admin-content-area">
        {/* Header */}
        <div className="admin-header-row">
          <div>
            <h1 className="admin-page-title">Database Pelanggan & Loyalitas</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Kelola data loyal customer, poin reward, preferensi menu, dan integrasi WhatsApp.
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
              <span className="stat-label">Total Anggota Member</span>
              <span className="stat-value">{customerList.length} Pelanggan</span>
              <span className="stat-subtext" style={{ color: '#10b981' }}>
                {goldCount} Member berstatus Gold VIP
              </span>
            </div>
            <div className="stat-icon-wrapper blue">
              <UserCheck size={20} />
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Total Belanja Kumulatif</span>
              <span className="stat-value">{formatRupiah(totalLifetimeSpent)}</span>
              <span className="stat-subtext">Akumulasi omzet pelanggan terdaftar</span>
            </div>
            <div className="stat-icon-wrapper yellow">
              <ShoppingBag size={20} />
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Poin Reward Beredar</span>
              <span className="stat-value">{totalPoints.toLocaleString('id-ID')} Poin</span>
              <span className="stat-subtext" style={{ color: '#60a5fa' }}>Dapat ditukar promo minuman</span>
            </div>
            <div className="stat-icon-wrapper blue">
              <Sparkles size={20} />
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
              placeholder="Cari pelanggan berdasarkan nama, HP, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="kasir-search-input"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          {/* Tier Filters */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Semua', 'Gold VIP', 'Silver', 'Bronze'].map((tier) => (
              <button
                key={tier}
                className={`category-pill ${tierFilter === tier ? 'active' : ''}`}
                onClick={() => setTierFilter(tier)}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Add Customer Button */}
          <div style={{ marginLeft: 'auto' }}>
            <button className="tambah-bahan-btn" onClick={handleOpenAddModal}>
              <UserPlus size={16} />
              <span>Daftar Pelanggan Baru</span>
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="dasbor-card-box" style={{ padding: '0 0 10px 0' }}>
          <div className="data-table-container">
            <table className="posa-table">
              <thead>
                <tr>
                  <th>Pelanggan</th>
                  <th>Tier Member</th>
                  <th>Kunjungan & Poin</th>
                  <th>Total Belanja</th>
                  <th>Menu Favorit & Catatan</th>
                  <th>Terakhir Berkunjung</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => {
                  const isGold = cust.tier === 'Gold VIP';
                  const isSilver = cust.tier === 'Silver';

                  return (
                    <tr key={cust.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: isGold
                                ? 'rgba(245, 158, 11, 0.2)'
                                : isSilver
                                ? 'rgba(148, 163, 184, 0.2)'
                                : 'rgba(59, 130, 246, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              color: isGold ? '#fbbf24' : isSilver ? '#cbd5e1' : '#60a5fa',
                              fontSize: '13px'
                            }}
                          >
                            {cust.name.charAt(0)}
                          </div>
                          <div>
                            <div className="item-name-bold">{cust.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {cust.phone} {cust.email && `• ${cust.email}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: isGold
                              ? 'rgba(245, 158, 11, 0.18)'
                              : isSilver
                              ? 'rgba(148, 163, 184, 0.18)'
                              : 'rgba(205, 127, 50, 0.18)',
                            color: isGold ? '#fbbf24' : isSilver ? '#cbd5e1' : '#f97316'
                          }}
                        >
                          {isGold && <Crown size={12} />}
                          {cust.tier}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>
                          {cust.totalVisits} kali datang
                        </div>
                        <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600 }}>
                          {cust.points} Poin
                        </div>
                      </td>

                      <td style={{ fontWeight: 700, color: '#10b981' }}>
                        {formatRupiah(cust.totalSpent)}
                      </td>

                      <td>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {cust.favoriteMenu || '-'}
                        </div>
                        {cust.notes && (
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            "{cust.notes}"
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                          <span>{formatTanggalWaktu(cust.lastVisit)}</span>
                        </div>
                      </td>

                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="table-action-icon-btn"
                            style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                            onClick={() => handleWhatsAppSend(cust)}
                            title="Kirim Pesan WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </button>
                          <button
                            className="table-action-icon-btn edit"
                            onClick={() => handleOpenEditModal(cust)}
                            title="Edit Data"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="table-action-icon-btn delete"
                            onClick={() => deleteCustomer(cust.id)}
                            title="Hapus Pelanggan"
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* Modal Tambah / Edit Pelanggan */}
      {isModalOpen && (
        <div className="modal-backdrop-overlay">
          <div className="modal-dialog-box" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div className="modal-title">
                {editingCustId ? 'Edit Data Pelanggan' : 'Daftar Pelanggan Baru'}
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    className="kasir-search-input"
                    placeholder="Contoh: Anisa Maharani"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Nomor HP / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      className="kasir-search-input"
                      placeholder="081234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      className="kasir-search-input"
                      placeholder="anisa@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Status / Tier Membership
                  </label>
                  <select
                    className="cart-select-field"
                    style={{ width: '100%' }}
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  >
                    <option value="Bronze">Bronze (Member Baru)</option>
                    <option value="Silver">Silver (Member Reguler)</option>
                    <option value="Gold VIP">Gold VIP (Pelanggan Utama)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Menu Favorit
                  </label>
                  <input
                    type="text"
                    className="kasir-search-input"
                    placeholder="Contoh: Kopi Susu Aren, Croissant"
                    value={formData.favoriteMenu}
                    onChange={(e) => setFormData({ ...formData, favoriteMenu: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Catatan Preferensi / Alergi Pelanggan
                  </label>
                  <textarea
                    rows={2}
                    className="kasir-search-input"
                    placeholder="Contoh: Selalu minta less sugar, alergi kacang..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    style={{ resize: 'none' }}
                  />
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
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
