import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Search, Plus, FileSpreadsheet, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function MenusView() {
  const { products, calculateMenuHpp, showToast } = usePos();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');

  const categories = ['All categories', 'Makanan', 'Non-Kopi', 'Kopi'];

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All categories' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Menus" />

      <div className="posa-admin-card">
        {/* Toolbar */}
        <div className="posa-card-toolbar">
          <div className="posa-search-wrapper flex-1">
            <Search size={16} className="posa-search-icon" />
            <input
              type="text"
              className="posa-search-input"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="posa-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="posa-btn-outline"
            onClick={() => showToast('Membuka dialog Import Excel')}
          >
            <FileSpreadsheet size={15} />
            <span>Import from Excel</span>
          </button>

          <button
            type="button"
            className="posa-btn-primary"
            onClick={() => showToast('Membuka form Tambah Menu Baru')}
          >
            <Plus size={16} />
            <span>Add Menu</span>
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="posa-empty-state">
            No menus found.
          </div>
        ) : (
          <div className="posa-table-container">
            <table className="posa-table">
              <thead>
                <tr>
                  <th>SKU / Item Name</th>
                  <th>Category</th>
                  <th>Selling Price (Dine-in)</th>
                  <th>HPP (Cost)</th>
                  <th>Margin %</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const hpp = calculateMenuHpp ? calculateMenuHpp(p) : 0;
                  const marginPct = p.price > 0 ? Math.round(((p.price - hpp) / p.price) * 100) : 0;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-xs text-muted font-mono">{p.sku}</div>
                      </td>
                      <td>
                        <span className="posa-badge-pill">{p.category}</span>
                      </td>
                      <td className="font-semibold text-white">
                        Rp {Number(p.price).toLocaleString('id-ID')}
                      </td>
                      <td className="text-slate-300">
                        Rp {Number(hpp).toLocaleString('id-ID')}
                      </td>
                      <td>
                        <span className={`font-bold ${marginPct >= 65 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {marginPct}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="posa-table-actions">
                          <button
                            type="button"
                            className="posa-action-icon-btn"
                            onClick={() => showToast(`Edit menu ${p.name}`)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="posa-action-icon-btn text-danger"
                            onClick={() => showToast(`Hapus ${p.name}`)}
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
