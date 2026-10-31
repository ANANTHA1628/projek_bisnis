import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Search, Plus } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function SemiFinishedView() {
  const { showToast } = usePos();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Semi-Finished Goods" />

      <div className="posa-admin-card">
        <p className="posa-card-subtitle">
          Things you make in the kitchen from raw materials, like cooked rice or milk mix. Make a batch here first, then menus that use it can be sold.
        </p>

        <div className="posa-card-toolbar">
          <div className="posa-search-wrapper">
            <Search size={16} className="posa-search-icon" />
            <input
              type="text"
              className="posa-search-input"
              placeholder="Search raw materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="posa-filter-pills">
            <button
              type="button"
              className={`posa-pill-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All · 0
            </button>
            <button
              type="button"
              className={`posa-pill-btn ${filterType === 'low' ? 'active' : ''}`}
              onClick={() => setFilterType('low')}
            >
              Running low · 0
            </button>
          </div>

          <button
            type="button"
            className="posa-btn-primary"
            onClick={() => showToast('Fitur tambah semi-finished item siap digunakan')}
          >
            <Plus size={16} />
            <span>Add item</span>
          </button>
        </div>

        <div className="posa-empty-state">
          Nothing yet. Add something you prepare in advance, like cooked rice or sugar syrup.
        </div>
      </div>
    </div>
  );
}
