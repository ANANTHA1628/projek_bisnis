import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
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
  Clock
} from 'lucide-react';

export default function LaporanView() {
  const {
    language,
    setLanguage,
    toggleFullscreen,
    setShowWhatsAppModal,
    showToast,
    transactions
  } = usePos();

  const [startDate, setStartDate] = useState('28 Sep 2026');
  const [endDate, setEndDate] = useState('01 Okt 2026');
  const [activePreset, setActivePreset] = useState('Bulan Ini');
  const [waDate, setWaDate] = useState('01 Okt 2026');

  const presets = ['Hari Ini', 'Kemarin', 'Minggu Ini', 'Bulan Ini', 'Bulan lalu'];

  const handleExportCSV = (type) => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (type === 'transaksi') {
      csvContent += 'ID Transaksi,Tanggal,Waktu,Tipe,Meja,Pelanggan,Metode,Subtotal,PB1,Total\n';
      transactions.forEach((t) => {
        csvContent += `${t.id},${t.date},${t.time},${t.orderType},${t.table},${t.customer},${t.method},${t.subtotal},${t.tax},${t.total}\n`;
      });
    } else {
      csvContent += 'ID Transaksi,Nama Item,Harga,Jumlah,Subtotal Item\n';
      transactions.forEach((t) => {
        t.items.forEach((item) => {
          csvContent += `${t.id},"${item.name}",${item.price},${item.quantity},${item.price * item.quantity}\n`;
        });
      });
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

  const handleExportExcel = () => {
    handleExportCSV('transaksi');
    showToast('Laporan Excel 6 sheet disiapkan & diunduh');
  };

  // Mock bar chart data for 'Tren Pendapatan'
  const trendDays = [
    { label: 'Sen', amount: '800rb', height: 60 },
    { label: 'Sel', amount: '1.1jt', height: 85 },
    { label: 'Rab', amount: '950rb', height: 70 },
    { label: 'Kam', amount: '1.4jt', height: 95 },
    { label: 'Jum', amount: '1.2jt', height: 88 },
    { label: 'Sab', amount: '1.8jt', height: 100 },
    { label: 'Min', amount: '1.6jt', height: 92 }
  ];

  return (
    <div className="view-main-container">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="admin-content-area">
        {/* Header */}
        <div className="admin-header-row">
          <h1 className="admin-page-title">Laporan Pendapatan</h1>

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

        {/* Export & WhatsApp Row */}
        <div className="laporan-cards-row">
          {/* Card Ekspor */}
          <div className="dasbor-card-box">
            <div className="dasbor-card-header">
              <h2 className="dasbor-card-title">Ekspor</h2>
              <p className="dasbor-card-subtitle">
                Memakai periode di atas. Waktu dalam WIB; transaksi void tercantum tetapi tidak
                dihitung dalam total.
              </p>
            </div>

            <div className="export-buttons-group">
              <button className="export-action-card-btn" onClick={handleExportExcel}>
                <div className="export-icon-box excel">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <div className="export-card-title">Excel</div>
                  <div className="export-card-desc">Laporan lengkap, 6 sheet</div>
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
                  <div className="export-card-title">CSV</div>
                  <div className="export-card-desc">Satu baris per transaksi</div>
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
                  <div className="export-card-title">CSV</div>
                  <div className="export-card-desc">Satu baris per item terjual</div>
                </div>
              </button>
            </div>
          </div>

          {/* Card WhatsApp */}
          <div className="dasbor-card-box">
            <div className="dasbor-card-header">
              <h2 className="dasbor-card-title">Laporan harian ke WhatsApp</h2>
              <p className="dasbor-card-subtitle">
                Mengirim ringkasan dan transaksi hari itu sebagai file CSV.
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
                <span>Kirim</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Revenue Stat Cards */}
        <div className="stat-cards-row">
          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Total diterima</span>
              <span className="stat-value">Rp 1.421.200</span>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Penjualan bersih</span>
              <span className="stat-value">Rp 1.292.000</span>
              <span className="stat-subtext">Sebelum pajak, setelah diskon</span>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Laba kotor</span>
              <span className="stat-value" style={{ color: '#10b981' }}>
                Rp 871.850
              </span>
              <span className="stat-subtext">Margin 67% · biaya bahan Rp 420.150</span>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Transaksi</span>
              <span className="stat-value">36</span>
              <span className="stat-subtext">rata-rata Rp 39.478 · 0 dibatalkan</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid-row">
          {/* Bar Chart: Tren Pendapatan */}
          <div className="chart-card-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="dasbor-card-title">Tren Pendapatan</h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Ketuk satu hari untuk melihat jam tersibuknya
              </span>
            </div>

            <div className="chart-bars-container">
              {trendDays.map((d) => (
                <div key={d.label} className="chart-bar-col">
                  <div
                    className="chart-bar-fill"
                    style={{ height: `${d.height}%` }}
                    title={`${d.label}: Rp ${d.amount}`}
                  />
                  <span className="chart-bar-label">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metode Pembayaran Breakdown */}
          <div className="chart-card-box">
            <h3 className="dasbor-card-title">Metode Pembayaran</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                    <Banknote size={15} color="#3b82f6" /> Tunai
                  </span>
                  <span style={{ fontWeight: 600 }}>45% (Rp 639.540)</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px' }}>
                  <div style={{ width: '45%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                    <QrCode size={15} color="#10b981" /> QRIS
                  </span>
                  <span style={{ fontWeight: 600 }}>40% (Rp 568.480)</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px' }}>
                  <div style={{ width: '40%', height: '100%', backgroundColor: '#10b981', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                    <CreditCard size={15} color="#8b5cf6" /> Kartu debit
                  </span>
                  <span style={{ fontWeight: 600 }}>10% (Rp 142.120)</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px' }}>
                  <div style={{ width: '10%', height: '100%', backgroundColor: '#8b5cf6', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                    <Clock size={15} color="#f59e0b" /> Bayar nanti
                  </span>
                  <span style={{ fontWeight: 600 }}>5% (Rp 71.060)</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px' }}>
                  <div style={{ width: '5%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
