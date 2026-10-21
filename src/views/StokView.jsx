import React from 'react';
import { usePos } from '../context/PosContext';
import Sidebar from '../components/Sidebar';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Maximize2
} from 'lucide-react';

export default function StokView() {
  const {
    rawMaterials,
    materialSearch,
    setMaterialSearch,
    materialFilter,
    setMaterialFilter,
    totalStockValue,
    deleteRawMaterial,
    setMaterialModalData,
    language,
    setLanguage,
    toggleFullscreen
  } = usePos();

  const formatRupiah = (num) => {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  };

  const formatNumber = (num) => {
    return Number(num).toLocaleString('id-ID');
  };

  const lowStockCount = rawMaterials.filter((m) => m.stock <= m.minStock).length;

  const filteredMaterials = rawMaterials.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(materialSearch.toLowerCase());
    const matchesFilter =
      materialFilter === 'all' || (materialFilter === 'low' && item.stock <= item.minStock);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="view-main-container">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="admin-content-area">
        {/* Header */}
        <div className="admin-header-row">
          <h1 className="admin-page-title">Pengaturan Bahan Baku</h1>

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

        {/* Search, Filter Pills & Add Button */}
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
          </div>

          <button
            className="tambah-bahan-btn"
            onClick={() => setMaterialModalData({})}
          >
            <Plus size={16} />
            <span>Tambah Bahan</span>
          </button>
        </div>

        {/* Stock Value Summary */}
        <div className="stok-total-value-text">
          Nilai stok: <strong>{formatRupiah(totalStockValue)}</strong>
        </div>

        {/* Materials Table */}
        <div className="dasbor-card-box" style={{ padding: '0 0 10px 0' }}>
          <div className="data-table-container">
            <table className="posa-table">
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Stok</th>
                  <th>Harga rata-rata</th>
                  <th>Nilai</th>
                  <th>Stok minimum</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((item) => {
                  const isLow = item.stock <= item.minStock;
                  const itemValue = item.stock * item.avgPrice;

                  return (
                    <tr key={item.id}>
                      <td className="item-name-bold">{item.name}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {formatNumber(item.stock)}
                        </span>{' '}
                        {item.unit}
                        {isLow && (
                          <span className="badge-warning-chip">Hampir habis</span>
                        )}
                      </td>
                      <td>
                        {formatRupiah(item.avgPrice)} / {item.unit}
                      </td>
                      <td>{formatRupiah(itemValue)}</td>
                      <td>{formatNumber(item.minStock)}</td>
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
      </main>
    </div>
  );
}
