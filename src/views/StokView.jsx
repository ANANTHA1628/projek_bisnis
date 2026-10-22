import React, { useState } from 'react';
import { usePos } from '../context/PosContext';
import Sidebar from '../components/Sidebar';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Maximize2,
  Sliders,
  PackageCheck,
  ClipboardCheck,
  AlertTriangle,
  History,
  BookOpen,
  Calculator,
  Layers
} from 'lucide-react';

export default function StokView() {
  const {
    rawMaterials,
    products,
    calculateMenuHpp,
    materialSearch,
    setMaterialSearch,
    materialFilter,
    setMaterialFilter,
    totalStockValue,
    deleteRawMaterial,
    setMaterialModalData,
    setShowRestockModal,
    setShowOpnameModal,
    setShowWasteModal,
    stockMovements,
    language,
    setLanguage,
    toggleFullscreen,
    stokSubTab,
    setStokSubTab
  } = usePos();

  // State for Simulator HPP (INV-12)
  const [simDose, setSimDose] = useState(18); // gram kopi
  const [simMilk, setSimMilk] = useState(150); // ml susu
  const [simSyrup, setSimSyrup] = useState(25); // ml aren
  const [simPackaging, setSimPackaging] = useState(1000); // cup + lid
  const [simTargetPrice, setSimTargetPrice] = useState(22000);

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  const formatNumber = (num) => Number(num || 0).toLocaleString('id-ID');

  const lowStockCount = rawMaterials.filter((m) => m.stock > 0 && m.stock <= m.minStock).length;
  const outOfStockCount = rawMaterials.filter((m) => m.stock <= 0).length;

  const filteredMaterials = rawMaterials.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(materialSearch.toLowerCase());
    if (materialFilter === 'low') return matchesSearch && item.stock > 0 && item.stock <= item.minStock;
    if (materialFilter === 'out') return matchesSearch && item.stock <= 0;
    return matchesSearch;
  });

  // Simulator Calculations
  const coffeeCost = (simDose * 220); // 220/g
  const milkCost = (simMilk * 22); // 22/ml
  const syrupCost = (simSyrup * 40); // 40/ml
  const simulatedHpp = coffeeCost + milkCost + syrupCost + Number(simPackaging);
  const simulatedMargin = simTargetPrice - simulatedHpp;
  const simulatedFoodCostPct = simTargetPrice > 0 ? ((simulatedHpp / simTargetPrice) * 100).toFixed(1) : 0;
  const isSimWarning = Number(simulatedFoodCostPct) > 35.0;

  return (
    <div className="view-main-container">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="admin-content-area">
        {/* Header */}
        <div className="admin-header-row">
          <div>
            <h1 className="admin-page-title">Manajemen Stok & HPP Menu</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Kontrol bahan baku per gram/ml/pcs dan pengujian HPP selama fase R&D.
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

        {/* Sub-Tabs: Bahan Baku, Resep & HPP, Simulator HPP, Buku Besar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <button
            className={`category-pill ${stokSubTab === 'bahan' ? 'active' : ''}`}
            onClick={() => setStokSubTab('bahan')}
          >
            <Layers size={14} style={{ marginRight: '6px' }} />
            Bahan Baku ({rawMaterials.length})
          </button>

          <button
            className={`category-pill ${stokSubTab === 'resep' ? 'active' : ''}`}
            onClick={() => setStokSubTab('resep')}
          >
            <BookOpen size={14} style={{ marginRight: '6px' }} />
            Resep & HPP Menu ({products.length})
          </button>

          <button
            className={`category-pill ${stokSubTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setStokSubTab('simulator')}
          >
            <Calculator size={14} style={{ marginRight: '6px' }} />
            Simulator HPP (R&D)
          </button>

          <button
            className={`category-pill ${stokSubTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setStokSubTab('ledger')}
          >
            <History size={14} style={{ marginRight: '6px' }} />
            Buku Besar Mutasi
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: BAHAN BAKU */}
        {/* ========================================================================= */}
        {stokSubTab === 'bahan' && (
          <>
            {/* Action Bar */}
            <div className="stok-filter-row">
              <div className="stok-search-box">
                <Search size={16} className="kasir-search-icon" />
                <input
                  type="text"
                  className="kasir-search-input"
                  placeholder="Cari bahan baku..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                />
              </div>

              <div className="stok-filter-pills">
                <button
                  className={`stok-filter-pill ${materialFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setMaterialFilter('all')}
                >
                  Semua · {rawMaterials.length}
                </button>

                <button
                  className={`stok-filter-pill warning-pill ${materialFilter === 'low' ? 'active' : ''}`}
                  onClick={() => setMaterialFilter(materialFilter === 'low' ? 'all' : 'low')}
                >
                  Hampir habis · {lowStockCount}
                </button>

                {outOfStockCount > 0 && (
                  <button
                    className={`stok-filter-pill danger-pill ${materialFilter === 'out' ? 'active' : ''}`}
                    onClick={() => setMaterialFilter(materialFilter === 'out' ? 'all' : 'out')}
                    style={{ color: '#ef4444', borderColor: '#ef4444' }}
                  >
                    Habis · {outOfStockCount}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                <button
                  className="kasir-action-pill-btn"
                  style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)', borderColor: '#3b82f6', color: '#60a5fa' }}
                  onClick={() => setShowRestockModal(true)}
                >
                  <PackageCheck size={15} />
                  <span>Restock</span>
                </button>

                <button
                  className="kasir-action-pill-btn"
                  onClick={() => setShowOpnameModal(true)}
                >
                  <ClipboardCheck size={15} />
                  <span>Stok Opname</span>
                </button>

                <button
                  className="kasir-action-pill-btn"
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  onClick={() => setShowWasteModal(true)}
                >
                  <Trash2 size={15} />
                  <span>Catat Waste</span>
                </button>

                <button
                  className="tambah-bahan-btn"
                  onClick={() => setMaterialModalData({})}
                >
                  <Plus size={16} />
                  <span>Tambah Bahan</span>
                </button>
              </div>
            </div>

            {/* Stock Value Summary */}
            <div className="stok-total-value-text">
              Total Nilai Aset Stok Real-time (Stok × HPP): <strong>{formatRupiah(totalStockValue)}</strong>
            </div>

            {/* Materials Table */}
            <div className="dasbor-card-box" style={{ padding: '0 0 10px 0' }}>
              <div className="data-table-container">
                <table className="posa-table">
                  <thead>
                    <tr>
                      <th>Nama Bahan</th>
                      <th>Stok Sistem</th>
                      <th>Status Stok</th>
                      <th>HPP Rata-rata</th>
                      <th>Nilai Aset</th>
                      <th>Batas Minimal</th>
                      <th style={{ textAlign: 'right', paddingRight: '20px' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.map((item) => {
                      const isLow = item.stock > 0 && item.stock <= item.minStock;
                      const isOut = item.stock <= 0;
                      const itemValue = Math.max(0, item.stock) * item.avgPrice;

                      return (
                        <tr key={item.id}>
                          <td className="item-name-bold">{item.name}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: isOut ? '#ef4444' : isLow ? '#fbbf24' : 'var(--text-primary)' }}>
                              {formatNumber(item.stock)}
                            </span>{' '}
                            {item.unit}
                          </td>
                          <td>
                            {isOut ? (
                              <span className="badge-warning-chip" style={{ backgroundColor: '#ef4444', color: '#fff' }}>
                                Habis (≤ 0)
                              </span>
                            ) : isLow ? (
                              <span className="badge-warning-chip">
                                Hampir Habis
                              </span>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                                Aman
                              </span>
                            )}
                          </td>
                          <td>
                            {formatRupiah(item.avgPrice)} / {item.unit}
                          </td>
                          <td style={{ fontWeight: 600 }}>{formatRupiah(itemValue)}</td>
                          <td>{formatNumber(item.minStock)} {item.unit}</td>
                          <td style={{ textAlign: 'right', paddingRight: '16px' }}>
                            <button
                              className="table-action-icon-btn"
                              title="Edit Bahan"
                              onClick={() => setMaterialModalData(item)}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="table-action-icon-btn delete"
                              title="Hapus Bahan"
                              onClick={() => deleteRawMaterial(item.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: RESEP & HPP MENU (INV-02 & INV-03) */}
        {/* ========================================================================= */}
        {stokSubTab === 'resep' && (
          <div className="dasbor-card-box" style={{ padding: '16px' }}>
            <div className="dasbor-card-header">
              <h2 className="dasbor-card-title">Resep & Perhitungan HPP per Menu</h2>
              <p className="dasbor-card-subtitle">
                Formula HPP = Σ (takaran bahan × harga rata-rata bahan) + biaya kemasan (cup, tutup, sedotan).
              </p>
            </div>

            <div className="data-table-container">
              <table className="posa-table">
                <thead>
                  <tr>
                    <th>Menu</th>
                    <th>Kategori</th>
                    <th>Harga Jual (Base)</th>
                    <th>HPP Otomatis</th>
                    <th>Margin (Rp)</th>
                    <th>Food Cost %</th>
                    <th>Rincian Resep Bahan</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const hpp = calculateMenuHpp(p);
                    const margin = p.price - hpp;
                    const foodCostPct = p.price > 0 ? ((hpp / p.price) * 100).toFixed(1) : 0;
                    const isAlert = Number(foodCostPct) > 35.0;

                    return (
                      <tr key={p.id}>
                        <td className="item-name-bold">{p.name}</td>
                        <td>{p.category}</td>
                        <td style={{ fontWeight: 700 }}>{formatRupiah(p.price)}</td>
                        <td style={{ color: '#60a5fa', fontWeight: 700 }}>{formatRupiah(hpp)}</td>
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
                          {isAlert && (
                            <span title="Melebihi ambang batas 35%" style={{ marginLeft: '4px' }}>⚠️</span>
                          )}
                        </td>
                        <td style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          {(p.recipe || []).map((r) => {
                            const mat = rawMaterials.find((m) => m.id === r.materialId);
                            return `${mat ? mat.name : r.materialId}: ${r.amount}${mat ? mat.unit : ''}`;
                          }).join(', ')}
                          {p.packagingCost ? ` + Kemasan (${formatRupiah(p.packagingCost)})` : ''}
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
        {/* TAB 3: SIMULATOR HPP (INV-12) */}
        {/* ========================================================================= */}
        {stokSubTab === 'simulator' && (
          <div className="dasbor-card-box" style={{ padding: '20px' }}>
            <div className="dasbor-card-header">
              <h2 className="dasbor-card-title">Simulator HPP (R&D Recipe Tuning)</h2>
              <p className="dasbor-card-subtitle">
                Uji variasi gramasi takaran bahan kopi, susu, dan sirup secara live tanpa mengubah resep live di kasir.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
              {/* Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span>Dosis Biji Kopi Arabika</span>
                    <strong style={{ color: '#60a5fa' }}>{simDose} gram ({formatRupiah(coffeeCost)})</strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={25}
                    step={1}
                    value={simDose}
                    onChange={(e) => setSimDose(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span>Takaran Susu Segar</span>
                    <strong style={{ color: '#60a5fa' }}>{simMilk} ml ({formatRupiah(milkCost)})</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={250}
                    step={10}
                    value={simMilk}
                    onChange={(e) => setSimMilk(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span>Gula Aren Cair</span>
                    <strong style={{ color: '#60a5fa' }}>{simSyrup} ml ({formatRupiah(syrupCost)})</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={simSyrup}
                    onChange={(e) => setSimSyrup(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Biaya Kemasan (Cup & Lid)
                    </label>
                    <input
                      type="number"
                      className="kasir-search-input"
                      value={simPackaging}
                      onChange={(e) => setSimPackaging(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Target Harga Jual (Rp)
                    </label>
                    <input
                      type="number"
                      className="kasir-search-input"
                      value={simTargetPrice}
                      onChange={(e) => setSimTargetPrice(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Real-time Result Card */}
              <div
                style={{
                  backgroundColor: '#162033',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `1px solid ${isSimWarning ? '#ef4444' : '#3b82f6'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>HASIL SIMULASI R&D</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#60a5fa', margin: '4px 0 12px 0' }}>
                    HPP: {formatRupiah(simulatedHpp)}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <div className="summary-row">
                      <span>Target Harga Jual</span>
                      <strong>{formatRupiah(simTargetPrice)}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Proyeksi Laba Kotor (Margin)</span>
                      <strong style={{ color: '#10b981' }}>{formatRupiah(simulatedMargin)}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Food Cost %</span>
                      <strong style={{ color: isSimWarning ? '#ef4444' : '#10b981', fontSize: '16px' }}>
                        {simulatedFoodCostPct}%
                      </strong>
                    </div>
                  </div>
                </div>

                {isSimWarning ? (
                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      borderRadius: '8px',
                      color: '#ef4444',
                      fontSize: '12px',
                      marginTop: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <AlertTriangle size={16} />
                    <span>Food cost melebihi ambang batas rekomendasi (35%)! Coba kurangi takaran susu/biji kopi atau naikkan harga jual.</span>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '12px',
                      marginTop: '14px'
                    }}
                  >
                    ✓ Food cost sangat ideal (&lt; 35%). Margin keuntungan sehat untuk operasional kafe.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: BUKU BESAR MUTASI STOK (RPT-04) */}
        {/* ========================================================================= */}
        {stokSubTab === 'ledger' && (
          <div className="dasbor-card-box" style={{ padding: '0 0 10px 0' }}>
            <div className="dasbor-card-header" style={{ padding: '16px 20px 0 20px' }}>
              <h2 className="dasbor-card-title">Buku Besar Pergerakan Stok (Single Source of Truth)</h2>
              <p className="dasbor-card-subtitle">
                Setiap mutasi stok (penjualan, restock, opname, waste, void_return) dicatat secara kekal dan dapat diaudit.
              </p>
            </div>

            <div className="data-table-container">
              <table className="posa-table">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Nama Bahan</th>
                    <th>Tipe Mutasi</th>
                    <th>Jumlah Mutasi</th>
                    <th>HPP per Satuan</th>
                    <th>Keterangan / Referensi</th>
                  </tr>
                </thead>
                <tbody>
                  {stockMovements.map((m) => {
                    const isPositive = m.qty > 0;
                    return (
                      <tr key={m.id}>
                        <td>{m.time || 'Hari ini'}</td>
                        <td className="item-name-bold">{m.materialName}</td>
                        <td>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor:
                                m.type === 'restock' ? 'rgba(59, 130, 246, 0.15)' :
                                m.type === 'sale' ? 'rgba(16, 185, 129, 0.15)' :
                                m.type === 'waste' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color:
                                m.type === 'restock' ? '#60a5fa' :
                                m.type === 'sale' ? '#10b981' :
                                m.type === 'waste' ? '#ef4444' : '#fbbf24'
                            }}
                          >
                            {m.type}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: isPositive ? '#10b981' : '#ef4444' }}>
                          {isPositive ? `+${m.qty}` : m.qty}
                        </td>
                        <td>{formatRupiah(m.unitCost)}</td>
                        <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {m.note}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
