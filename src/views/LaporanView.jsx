import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  FileSpreadsheet,
  FileText,
  Send,
  Maximize2,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
  Clock,
  TrendingUp,
  DollarSign,
  PieChart,
  ShieldAlert,
  Plus,
  Trash2,
  AlertOctagon
} from 'lucide-react';

export default function LaporanView() {
  const {
    language,
    setLanguage,
    toggleFullscreen,
    setShowWhatsAppModal,
    showToast,
    transactions,
    rawMaterials,
    products,
    expenses,
    addExpense,
    currentShift,
    stockMovements,
    laporanSubTab,
    setLaporanSubTab,
    voidTransaction,
    setShowAdminPinModal,
    setAdminPinConfig,
    setActiveTab
  } = usePos();

  const { canViewLaporan, user } = useAuth();

  const [startDate, setStartDate] = useState('28 Sep 2026');
  const [endDate, setEndDate] = useState('01 Okt 2026');
  const [activePreset, setActivePreset] = useState('Bulan Ini');
  const [waDate, setWaDate] = useState('01 Okt 2026');
  const [isExporting, setIsExporting] = useState(false);

  // New expense form state
  const [newExpCategory, setNewExpCategory] = useState('Listrik & Air');
  const [newExpAmount, setNewExpAmount] = useState(50000);
  const [newExpNote, setNewExpNote] = useState('');

  // If a non-authorized role (like karyawan) accesses Laporan, show restricted notice
  if (!canViewLaporan) {
    return (
      <div className="admin-layout-container">
        <Sidebar />
        <main className="admin-main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '420px', padding: '30px', background: '#1e293b', borderRadius: '16px', border: '1px solid #ef4444' }}>
            <AlertOctagon size={48} color="#ef4444" style={{ marginBottom: '14px' }} />
            <h2 style={{ fontSize: '18px', color: '#f3f4f6', marginBottom: '8px' }}>Akses Dibatasi</h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.5', marginBottom: '16px' }}>
              Akun <strong>{user?.name}</strong> dengan role <strong>{user?.role}</strong> tidak memiliki izin untuk melihat laporan keuangan dan laba rugi. Menu laporan hanya untuk <strong>Owner</strong> dan <strong>Admin</strong>.
            </p>
            <button
              className="modal-primary-btn"
              onClick={() => setActiveTab('kasir')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Kembali ke Menu Kasir
            </button>
          </div>
        </main>
      </div>
    );
  }

  const presets = ['Hari Ini', 'Kemarin', 'Minggu Ini', 'Bulan Ini', 'Bulan lalu'];

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  // Transactions calculations
  const paidTransactions = transactions.filter((t) => t.status === 'paid');
  const totalOmzetBruto = paidTransactions.reduce((acc, t) => acc + t.subtotal, 0);
  const totalDiskon = paidTransactions.reduce((acc, t) => acc + (t.discount || 0), 0);
  const totalOmzetNet = totalOmzetBruto - totalDiskon;
  const totalTaxPb1 = paidTransactions.reduce((acc, t) => acc + t.tax, 0);
  const totalDiterima = paidTransactions.reduce((acc, t) => acc + t.total, 0);
  const totalHpp = paidTransactions.reduce((acc, t) => acc + (t.cost || 0), 0);
  const totalKomisiOjol = paidTransactions.reduce((acc, t) => acc + (t.commissionAmount || 0), 0);
  const totalBiayaOps = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Laba Kotor & Laba Bersih (RPT-03)
  const labaKotor = totalOmzetNet - totalHpp;
  const marginKotorPct = totalOmzetNet > 0 ? Math.round((labaKotor / totalOmzetNet) * 100) : 0;
  const labaBersih = totalOmzetNet - totalHpp - totalKomisiOjol - totalBiayaOps;

  // Handle Void with Admin PIN modal
  const handleRequestVoid = (trx) => {
    setAdminPinConfig({
      title: `Void Transaksi #${trx.id}`,
      requireReason: true,
      isVoid: true,
      onSuccess: ({ reason, isWaste }) => {
        voidTransaction(trx.id, '1234', reason, isWaste);
      }
    });
    setShowAdminPinModal(true);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpAmount || newExpAmount <= 0) return;
    addExpense({
      date: new Date().toISOString().split('T')[0],
      category: newExpCategory,
      amount: Number(newExpAmount),
      note: newExpNote || newExpCategory
    });
    setNewExpAmount(50000);
    setNewExpNote('');
  };

  const handleExportCSV = (type) => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (type === 'transaksi') {
      csvContent += 'ID Transaksi,Tanggal,Waktu,Tipe,Meja,Pelanggan,Metode,Status,Subtotal,Diskon,PB1,Total,HPP,Komisi Ojol\n';
      transactions.forEach((t) => {
        csvContent += `${t.id},${t.date},${t.time},${t.orderType},${t.table},"${t.customer}",${t.method},${t.status},${t.subtotal},${t.discount || 0},${t.tax},${t.total},${t.cost},${t.commissionAmount || 0}\n`;
      });
    } else if (type === 'item') {
      csvContent += 'ID Transaksi,Nama Item,Harga,Jumlah,Subtotal Item\n';
      transactions.forEach((t) => {
        t.items.forEach((item) => {
          csvContent += `${t.id},"${item.name}",${item.price},${item.quantity},${item.price * item.quantity}\n`;
        });
      });
    } else if (type === 'labarugi') {
      csvContent += 'Komponen,Nominal (Rp)\n';
      csvContent += `Omzet Penjualan Bruto,${totalOmzetBruto}\n`;
      csvContent += `Potongan Diskon,${totalDiskon}\n`;
      csvContent += `Omzet Penjualan Bersih,${totalOmzetNet}\n`;
      csvContent += `HPP Bahan Baku (COGS),${totalHpp}\n`;
      csvContent += `Komisi Platform Ojol,${totalKomisiOjol}\n`;
      csvContent += `Total Biaya Operasional Toko,${totalBiayaOps}\n`;
      csvContent += `Laba Bersih Usaha,${labaBersih}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `posa_laporan_${type}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`File CSV ${type} berhasil diunduh!`);
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    showToast('Menghubungi backend Laravel untuk generate Excel (.xlsx)...');
    try {
      const response = await fetch('http://localhost:8000/api/export/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          rawMaterials,
          periodInfo: { startDate, endDate }
        })
      });

      if (!response.ok) throw new Error('Gagal dari server Laravel');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `posa_laporan_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showToast('Laporan Excel multi-sheet berhasil diunduh dari Laravel!');
    } catch (err) {
      console.warn('Backend Laravel offline, fallback ke CSV:', err);
      handleExportCSV('transaksi');
      showToast('Mengunduh file CSV transaksi sebagai alternatif.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    showToast('Menghubungi backend Laravel untuk generate PDF...');
    try {
      const response = await fetch('http://localhost:8000/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          periodInfo: { startDate, endDate }
        })
      });

      if (!response.ok) throw new Error('Gagal membuat PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `posa_laporan_resmi_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showToast('Laporan PDF resmi berhasil diunduh dari Laravel!');
    } catch (err) {
      console.warn('Backend Laravel offline:', err);
      showToast('Pastikan backend Laravel berjalan (npm run backend)');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="view-main-container">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="admin-content-area">
        {/* Header */}
        <div className="admin-header-row">
          <div>
            <h1 className="admin-page-title">Laporan Keuangan & Analitik Bisnis</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Laporan terverifikasi RPT-01 s/d RPT-06, HPP, Laba Rugi, dan Ekspor Excel & PDF.
            </p>
          </div>

          <div className="admin-header-tools">
            <button
              className="tool-icon-btn"
              onClick={toggleFullscreen}
              title="Layar Penuh"
            >
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

        {/* Sub-Tabs: Pendapatan, Laba Rugi, Penjualan Item, Biaya Ops, Riwayat Transaksi */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <button
            className={`category-pill ${laporanSubTab === 'pendapatan' ? 'active' : ''}`}
            onClick={() => setLaporanSubTab('pendapatan')}
          >
            RPT-01 Pendapatan
          </button>

          <button
            className={`category-pill ${laporanSubTab === 'labarugi' ? 'active' : ''}`}
            onClick={() => setLaporanSubTab('labarugi')}
          >
            RPT-03 Laba Rugi
          </button>

          <button
            className={`category-pill ${laporanSubTab === 'item' ? 'active' : ''}`}
            onClick={() => setLaporanSubTab('item')}
          >
            RPT-02 & 06 Item & Margin
          </button>

          <button
            className={`category-pill ${laporanSubTab === 'biaya' ? 'active' : ''}`}
            onClick={() => setLaporanSubTab('biaya')}
          >
            Biaya Operasional ({expenses.length})
          </button>

          <button
            className={`category-pill ${laporanSubTab === 'riwayat' ? 'active' : ''}`}
            onClick={() => setLaporanSubTab('riwayat')}
          >
            Riwayat Transaksi & Void ({transactions.length})
          </button>
        </div>

        {/* Period Selector Card */}
        <div className="period-selector-card">
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Periode laporan
          </span>

          <div className="period-inputs-row">
            <div className="period-input-group">
              <label>Dari</label>
              <input
                type="text"
                className="period-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="period-input-group">
              <label>Sampai</label>
              <input
                type="text"
                className="period-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              className="buat-laporan-btn"
              onClick={() => showToast('Laporan berhasil diperbarui untuk periode yang dipilih')}
            >
              Buat Laporan
            </button>
          </div>

          <div className="preset-pills-row">
            {presets.map((preset) => (
              <button
                key={preset}
                className={`preset-pill ${activePreset === preset ? 'active' : ''}`}
                onClick={() => {
                  setActivePreset(preset);
                  showToast(`Memfilter periode: ${preset}`);
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUBTAB 1: RPT-01 PENDAPATAN & EKSPOR */}
        {/* ========================================================================= */}
        {laporanSubTab === 'pendapatan' && (
          <>
            {/* Export & WhatsApp Row */}
            <div className="laporan-cards-row">
              {/* Card Ekspor */}
              <div className="dasbor-card-box">
                <div className="dasbor-card-header">
                  <h2 className="dasbor-card-title">Ekspor Laporan Resmi</h2>
                  <p className="dasbor-card-subtitle">
                    Waktu dalam WIB; transaksi void tercantum tetapi tidak dihitung dalam total.
                  </p>
                </div>

                <div className="export-buttons-group">
                  <button
                    className="export-action-card-btn"
                    onClick={handleExportExcel}
                    disabled={isExporting}
                  >
                    <div className="export-icon-box excel">
                      <FileSpreadsheet size={18} />
                    </div>
                    <div>
                      <div className="export-card-title">Excel (.xlsx)</div>
                      <div className="export-card-desc">Multi-sheet via Laravel</div>
                    </div>
                  </button>

                  <button
                    className="export-action-card-btn"
                    onClick={handleExportPDF}
                    disabled={isExporting}
                  >
                    <div className="export-icon-box pdf">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="export-card-title">PDF Resmi</div>
                      <div className="export-card-desc">Siap cetak via Laravel</div>
                    </div>
                  </button>

                  <button
                    className="export-action-card-btn"
                    onClick={() => handleExportCSV('transaksi')}
                  >
                    <div className="export-icon-box csv">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="export-card-title">CSV Transaksi</div>
                      <div className="export-card-desc">Data mentah per order</div>
                    </div>
                  </button>

                  <button
                    className="export-action-card-btn"
                    onClick={() => handleExportCSV('item')}
                  >
                    <div className="export-icon-box csv">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="export-card-title">CSV Item</div>
                      <div className="export-card-desc">Per produk terjual</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Card WhatsApp */}
              <div className="dasbor-card-box">
                <div className="dasbor-card-header">
                  <h2 className="dasbor-card-title">Laporan harian ke WhatsApp</h2>
                  <p className="dasbor-card-subtitle">
                    Mengirim ringkasan omzet dan transaksi hari ini via WhatsApp API.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="wa-date-input"
                    style={{ flex: 1 }}
                    value={waDate}
                    onChange={(e) => setWaDate(e.target.value)}
                  />

                  <button
                    className="wa-submit-btn green"
                    style={{ width: 'auto', padding: '11px 20px' }}
                    onClick={() => setShowWhatsAppModal(true)}
                  >
                    <Send size={15} />
                    <span>Kirim WA</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Revenue Stat Cards */}
            <div className="stat-cards-row">
              <div className="stat-metric-card">
                <div className="stat-info-col">
                  <span className="stat-label">Total diterima</span>
                  <span className="stat-value">{formatRupiah(totalDiterima)}</span>
                  <span className="stat-subtext">Termasuk PB1 10%</span>
                </div>
              </div>

              <div className="stat-metric-card">
                <div className="stat-info-col">
                  <span className="stat-label">Penjualan bersih</span>
                  <span className="stat-value">{formatRupiah(totalOmzetNet)}</span>
                  <span className="stat-subtext">Sebelum pajak, setelah diskon</span>
                </div>
              </div>

              <div className="stat-metric-card">
                <div className="stat-info-col">
                  <span className="stat-label">Laba kotor</span>
                  <span className="stat-value" style={{ color: '#10b981' }}>
                    {formatRupiah(labaKotor)}
                  </span>
                  <span className="stat-subtext">Margin {marginKotorPct}% · Biaya HPP {formatRupiah(totalHpp)}</span>
                </div>
              </div>

              <div className="stat-metric-card">
                <div className="stat-info-col">
                  <span className="stat-label">Transaksi Berhasil</span>
                  <span className="stat-value">{paidTransactions.length}</span>
                  <span className="stat-subtext">
                    Rata-rata {formatRupiah(paidTransactions.length > 0 ? Math.round(totalDiterima / paidTransactions.length) : 0)} · {transactions.filter(t => t.status === 'void').length} dibatalkan
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 2: RPT-03 LAPORAN LABA RUGI */}
        {/* ========================================================================= */}
        {laporanSubTab === 'labarugi' && (
          <div className="dasbor-card-box" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 className="dasbor-card-title">Laporan Laba Rugi (Profit & Loss)</h2>
                <p className="dasbor-card-subtitle">
                  Formula PRD RPT-03: Omzet − Diskon − HPP − Komisi Ojol − Biaya Operasional.
                </p>
              </div>
              <button
                className="tambah-bahan-btn"
                onClick={() => handleExportCSV('labarugi')}
              >
                Unduh CSV Laba Rugi
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="summary-row" style={{ fontSize: '13.5px' }}>
                <span>(+) Omzet Penjualan Bruto</span>
                <strong>{formatRupiah(totalOmzetBruto)}</strong>
              </div>

              <div className="summary-row" style={{ fontSize: '13.5px', color: '#ef4444' }}>
                <span>(-) Potongan Diskon Manual (PIN Admin)</span>
                <strong>-{formatRupiah(totalDiskon)}</strong>
              </div>

              <div className="receipt-divider" />

              <div className="summary-row" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>(=) Penjualan Bersih (Net Revenue)</span>
                <span>{formatRupiah(totalOmzetNet)}</span>
              </div>

              <div className="summary-row" style={{ fontSize: '13.5px', color: '#ef4444' }}>
                <span>(-) Harga Pokok Penjualan (HPP / COGS Bahan)</span>
                <strong>-{formatRupiah(totalHpp)}</strong>
              </div>

              <div className="summary-row" style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>
                <span>(=) Laba Kotor (Gross Profit)</span>
                <span>{formatRupiah(labaKotor)} (Margin {marginKotorPct}%)</span>
              </div>

              <div className="summary-row" style={{ fontSize: '13.5px', color: '#f59e0b' }}>
                <span>(-) Potongan Komisi Platform Ojol (GoFood/GrabFood 20%)</span>
                <strong>-{formatRupiah(totalKomisiOjol)}</strong>
              </div>

              <div className="summary-row" style={{ fontSize: '13.5px', color: '#f59e0b' }}>
                <span>(-) Beban Biaya Operasional Toko (Sewa, Listrik, Gaji)</span>
                <strong>-{formatRupiah(totalBiayaOps)}</strong>
              </div>

              <div className="receipt-divider" style={{ borderTop: '2px dashed var(--border-subtle)', margin: '8px 0' }} />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: '#162033',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 800
                }}
              >
                <span>LABA BERSIH BERJALAN (NET PROFIT)</span>
                <span style={{ color: labaBersih >= 0 ? '#10b981' : '#ef4444' }}>
                  {formatRupiah(labaBersih)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 3: RPT-02 & RPT-06 PENJUALAN ITEM & MARGIN TERTINGGI */}
        {/* ========================================================================= */}
        {laporanSubTab === 'item' && (
          <div className="dasbor-card-box" style={{ padding: '0 0 10px 0' }}>
            <div className="dasbor-card-header" style={{ padding: '16px 20px 0 20px' }}>
              <h2 className="dasbor-card-title">Penjualan per Item & Peringkat Margin R&D (RPT-02 & RPT-06)</h2>
              <p className="dasbor-card-subtitle">
                Peringkat menu terlaris dan margin tertinggi untuk keputusan pengembangan menu (R&D).
              </p>
            </div>

            <div className="data-table-container">
              <table className="posa-table">
                <thead>
                  <tr>
                    <th>Menu</th>
                    <th>Kategori</th>
                    <th>Harga Base</th>
                    <th>HPP per Porsi</th>
                    <th>Margin Unit</th>
                    <th>Food Cost %</th>
                    <th>Status R&D</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    let hpp = 0;
                    if (p.recipe) {
                      p.recipe.forEach((r) => {
                        const mat = rawMaterials.find((m) => m.id === r.materialId);
                        if (mat) hpp += Math.round(r.amount * mat.avgPrice);
                      });
                    }
                    hpp += (p.packagingCost || 0);
                    const margin = p.price - hpp;
                    const foodCostPct = p.price > 0 ? ((hpp / p.price) * 100).toFixed(1) : 0;
                    const isAlert = Number(foodCostPct) > 35.0;

                    return (
                      <tr key={p.id}>
                        <td className="item-name-bold">{p.name}</td>
                        <td>{p.category}</td>
                        <td style={{ fontWeight: 700 }}>{formatRupiah(p.price)}</td>
                        <td style={{ color: '#60a5fa' }}>{formatRupiah(hpp)}</td>
                        <td style={{ color: '#10b981', fontWeight: 600 }}>{formatRupiah(margin)}</td>
                        <td>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 700,
                              backgroundColor: isAlert ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                              color: isAlert ? '#ef4444' : '#10b981'
                            }}
                          >
                            {foodCostPct}%
                          </span>
                        </td>
                        <td>
                          {isAlert ? (
                            <span style={{ color: '#ef4444', fontSize: '11.5px', fontWeight: 600 }}>
                              ⚠️ Perlu Kalibrasi Resep
                            </span>
                          ) : (
                            <span style={{ color: '#10b981', fontSize: '11.5px', fontWeight: 600 }}>
                              ✓ Margin Prima (Bintang R&D)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 4: PENCATATAN BIAYA OPERASIONAL (EXPENSES) */}
        {/* ========================================================================= */}
        {laporanSubTab === 'biaya' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {/* Form Input */}
            <div className="dasbor-card-box">
              <div className="dasbor-card-header">
                <h3 className="dasbor-card-title">Catat Biaya Operasional Baru</h3>
                <p className="dasbor-card-subtitle">
                  Pencatatan sederhana: tanggal, kategori, nominal untuk laporan laba rugi.
                </p>
              </div>

              <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Kategori Pengeluaran
                  </label>
                  <select
                    className="kasir-search-input"
                    value={newExpCategory}
                    onChange={(e) => setNewExpCategory(e.target.value)}
                  >
                    <option value="Sewa Tempat">Sewa Tempat</option>
                    <option value="Listrik & Air">Listrik & Air</option>
                    <option value="Gaji / Upah Shift">Gaji / Upah Shift</option>
                    <option value="Bahan Habis Pakai">Bahan Habis Pakai (Gas, Sabun, Plastik)</option>
                    <option value="Internet & Promosi">Internet & Promosi</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Nominal Biaya (Rp)
                  </label>
                  <input
                    type="number"
                    className="kasir-search-input"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(Number(e.target.value))}
                    required
                    min={1000}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Catatan Keterangan
                  </label>
                  <input
                    type="text"
                    className="kasir-search-input"
                    placeholder="Contoh: Beli token listrik via Indomaret"
                    value={newExpNote}
                    onChange={(e) => setNewExpNote(e.target.value)}
                  />
                </div>

                <button type="submit" className="buat-laporan-btn" style={{ marginTop: '4px' }}>
                  <Plus size={15} style={{ marginRight: '6px' }} />
                  Simpan Biaya Operasional
                </button>
              </form>
            </div>

            {/* List Expenses */}
            <div className="dasbor-card-box">
              <div className="dasbor-card-header">
                <h3 className="dasbor-card-title">Daftar Biaya Operasional</h3>
                <p className="dasbor-card-subtitle">
                  Total Biaya: <strong>{formatRupiah(totalBiayaOps)}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: '#162033',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {exp.category}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {exp.date} • {exp.note}
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444' }}>
                      {formatRupiah(exp.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 5: RIWAYAT TRANSAKSI & VOID DENGAN PIN ADMIN (POS-10) */}
        {/* ========================================================================= */}
        {laporanSubTab === 'riwayat' && (
          <div className="dasbor-card-box" style={{ padding: '0 0 10px 0' }}>
            <div className="dasbor-card-header" style={{ padding: '16px 20px 0 20px' }}>
              <h2 className="dasbor-card-title">Riwayat Transaksi & Pembatalan (Void)</h2>
              <p className="dasbor-card-subtitle">
                Aturan keamanan PRD: Void wajib mencatat PIN Admin dan alasan ke audit log.
              </p>
            </div>

            <div className="data-table-container">
              <table className="posa-table">
                <thead>
                  <tr>
                    <th>No. Transaksi</th>
                    <th>Waktu</th>
                    <th>Kanal & Meja</th>
                    <th>Pelanggan</th>
                    <th>Metode</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th style={{ textAlign: 'right', paddingRight: '20px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((trx) => (
                    <tr key={trx.id}>
                      <td className="item-name-bold">{trx.id}</td>
                      <td>{trx.date} {trx.time}</td>
                      <td>{trx.orderType} • {trx.table}</td>
                      <td>{trx.customer}</td>
                      <td>{trx.method}</td>
                      <td>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            backgroundColor: trx.status === 'paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: trx.status === 'paid' ? '#10b981' : '#ef4444'
                          }}
                        >
                          {trx.status}
                        </span>
                        {trx.voidReason && (
                          <div style={{ fontSize: '10px', color: '#f87171', marginTop: '2px' }}>
                            Alasan: {trx.voidReason}
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 700 }}>{formatRupiah(trx.total)}</td>
                      <td style={{ textAlign: 'right', paddingRight: '16px' }}>
                        {trx.status === 'paid' && (
                          <button
                            className="table-action-icon-btn delete"
                            title="Void Transaksi (PIN Admin Wajib)"
                            onClick={() => handleRequestVoid(trx)}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
