import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import AdminHeader from '../../components/AdminHeader';
import { Search, Plus, Edit2, Trash2, ArrowUpRight } from 'lucide-react';

export default function RawMaterialsView() {
  const {
    rawMaterials,
    materialSearch,
    setMaterialSearch,
    setMaterialModalData,
    deleteRawMaterial,
    setShowRestockModal
  } = usePos();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'low'

  const lowStockCount = rawMaterials.filter((m) => m.stock <= m.minStock).length;
  const allCount = rawMaterials.length;

  const filteredMaterials = rawMaterials.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes((materialSearch || '').toLowerCase());
    const matchLow = filterType === 'low' ? m.stock <= m.minStock : true;
    return matchSearch && matchLow;
  });

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Raw Materials Setup" />

      <div className="posa-admin-card">
        {/* Filter bar & Actions */}
        <div className="posa-card-toolbar">
          <div className="posa-search-wrapper">
            <Search size={16} className="posa-search-icon" />
            <input
              type="text"
              className="posa-search-input"
              placeholder="Search raw materials..."
              value={materialSearch}
              onChange={(e) => setMaterialSearch(e.target.value)}
            />
          </div>

          <div className="posa-filter-pills">
            <button
              type="button"
              className={`posa-pill-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All · {allCount}
            </button>
            <button
              type="button"
              className={`posa-pill-btn ${filterType === 'low' ? 'active' : ''}`}
              onClick={() => setFilterType('low')}
            >
              Running low · {lowStockCount}
            </button>
          </div>

          <button
            type="button"
            className="posa-btn-primary"
            onClick={() => setMaterialModalData({})}
          >
            <Plus size={16} />
            <span>Add Material</span>
          </button>
        </div>

        {/* Content Table / Empty state */}
        {filteredMaterials.length === 0 ? (
          <div className="posa-empty-state">
            No raw materials yet. Add the first one, or import them from Excel on the Stock take page.
          </div>
        ) : (
          <div className="posa-table-container">
            <table className="posa-table">
              <thead>
                <tr>
                  <th>Material Name</th>
                  <th>Current Stock</th>
                  <th>Unit</th>
                  <th>Avg Price / Unit</th>
                  <th>Min Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((item) => {
                  const isLow = item.stock <= item.minStock;
                  return (
                    <tr key={item.id}>
                      <td className="font-semibold text-white">{item.name}</td>
                      <td>
                        <span className={isLow ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                          {Number(item.stock).toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td>{item.unit}</td>
                      <td>Rp {Number(item.avgPrice).toLocaleString('id-ID')}</td>
                      <td>{Number(item.minStock).toLocaleString('id-ID')} {item.unit}</td>
                      <td>
                        {isLow ? (
                          <span className="posa-badge-warning">Running Low</span>
                        ) : (
                          <span className="posa-badge-success">Safe</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="posa-table-actions">
                          <button
                            type="button"
                            className="posa-action-icon-btn"
                            title="Restock"
                            onClick={() => setShowRestockModal(true)}
                          >
                            <ArrowUpRight size={15} />
                          </button>
                          <button
                            type="button"
                            className="posa-action-icon-btn"
                            title="Edit"
                            onClick={() => setMaterialModalData(item)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="posa-action-icon-btn text-danger"
                            title="Delete"
                            onClick={() => deleteRawMaterial(item.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
