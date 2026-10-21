import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
import Sidebar from '../components/Sidebar';
import {
  TrendingUp,
  ShoppingCart,
  Boxes,
  Clock,
  AlertTriangle,
  Send,
  Maximize2,
  ChevronRight
} from 'lucide-react';

export default function DasborView() {
  const {
    rawMaterials,
    language,
    setLanguage,
    toggleFullscreen,
    setShowRestockModal,
    setShowWhatsAppModal,
    showToast
  } = usePos();

  const [reportDate, setReportDate] = useState('01 Okt 2026');

  // Calculate stats based on raw materials
  const lowStockCount = rawMaterials.filter((m) => m.stock <= m.minStock).length;

  return (
    <div className="view-main-container">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="admin-content-area">
        {/* Header */}
        <div className="admin-header-row">
          <h1 className="admin-page-title">Dashboard Admin</h1>

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

        {/* 4 Metric Stats Cards */}
        <div className="stat-cards-row">
          {/* Card 1 */}
          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Penjualan hari ini</span>
              <span className="stat-value">Rp 676.500</span>
              <span className="stat-subtext">16 pesanan · laba Rp 409.220</span>
            </div>
            <div className="stat-icon-wrapper blue">
              <TrendingUp size={20} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Total Penjualan (Bulan Ini)</span>
              <span className="stat-value">Rp 676.500</span>
              <span className="stat-subtext">16 pesanan · laba Rp 409.220</span>
            </div>
            <div className="stat-icon-wrapper blue">
              <ShoppingCart size={20} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Barang Stok Rendah</span>
              <span className="stat-value">{lowStockCount}</span>
              <span className="stat-subtext">Gula aren cair, Roti tawar</span>
            </div>
            <div className="stat-icon-wrapper yellow">
              <Boxes size={20} />
            </div>
          </div>

          {/* Card 4 */}
          <div className="stat-metric-card">
            <div className="stat-info-col">
              <span className="stat-label">Habis dalam 14 hari</span>
              <span className="stat-value">3</span>
              <span className="stat-subtext">Roti tawar: 3 hari</span>
            </div>
            <div className="stat-icon-wrapper yellow">
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* Dasbor 2-Column Grid */}
        <div className="dasbor-grid-columns">
          {/* Left Column: Stock Velocity Table */}
          <div className="dasbor-card-box">
            <div className="dasbor-card-header">
              <h2 className="dasbor-card-title">Seberapa cepat stok terpakai</h2>
              <p className="dasbor-card-subtitle">
                Berdasarkan penjualan 7 hari terakhir.
              </p>
            </div>

            <div className="data-table-container">
              <table className="posa-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Stok</th>
                    <th>Terpakai per hari</th>
                    <th>Sisa hari</th>
                  </tr>
                </thead>
                <tbody>
                  {rawMaterials.map((item) => {
                    // Calculate remaining days
                    const daysLeft = Math.floor(item.stock / (item.dailyUsage || 1));
                    let urgencyClass = '';
                    if (daysLeft <= 3) urgencyClass = 'danger';
                    else if (daysLeft <= 14) urgencyClass = 'warning';

                    return (
                      <tr key={item.id}>
                        <td className="item-name-bold">{item.name}</td>
                        <td>
                          {item.stock.toLocaleString('id-ID')} {item.unit}
                        </td>
                        <td>
                          {item.dailyUsage} {item.unit}
                        </td>
                        <td>
                          <span className={`days-left-badge ${urgencyClass}`}>
                            {daysLeft} hari
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Alerts & WhatsApp Report */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Low Stock Warning Card */}
            <div className="dasbor-card-box">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#fbbf24',
                  fontWeight: '700',
                  fontSize: '14.5px'
                }}
              >
                <AlertTriangle size={18} />
                <span>Peringatan Stok Rendah</span>
              </div>

              <div>
                <div className="low-stock-alert-item">
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Gula aren cair
                  </span>
                  <span className="low-stock-ratio">420 / 1000 ml</span>
                </div>

                <div className="low-stock-alert-item">
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Roti tawar
                  </span>
                  <span className="low-stock-ratio">6 / 20 pcs</span>
                </div>
              </div>

              <button
                className="buka-restock-btn"
                onClick={() => setShowRestockModal(true)}
              >
                <span>Buka Restock</span>
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Daily WhatsApp Report Card */}
            <div className="dasbor-card-box">
              <div className="dasbor-card-header">
                <h3 className="dasbor-card-title">Laporan harian</h3>
                <p className="dasbor-card-subtitle">
                  Kirim ringkasan dan transaksi hari ini ke WhatsApp.
                </p>
              </div>

              <input
                type="text"
                className="wa-date-input"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />

              <button
                className="wa-submit-btn"
                onClick={() => setShowWhatsAppModal(true)}
              >
                <Send size={15} />
                <span>Kirim Laporan WA</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
