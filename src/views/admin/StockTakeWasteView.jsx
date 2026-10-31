import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Search, FileSpreadsheet, Check } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function StockTakeWasteView() {
  const { rawMaterials, recordOpname, recordWaste, stockMovements, showToast } = usePos();
  const [activeTab, setActiveTab] = useState('take'); // 'take' | 'waste' | 'history'
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState({});
  const [note, setNote] = useState('');

  const filteredMaterials = rawMaterials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCountChange = (id, val) => {
    setCounts((prev) => ({ ...prev, [id]: val }));
  };

  const countedItemsCount = Object.keys(counts).filter((k) => counts[k] !== '' && counts[k] !== undefined).length;

  const handleSave = () => {
    if (countedItemsCount === 0) {
      showToast('Masukkan minimal satu item yang dihitung', 'warning');
      return;
    }
    Object.keys(counts).forEach((id) => {
      const realVal = Number(counts[id]);
      if (!isNaN(realVal)) {
        recordOpname(id, realVal, note || 'Stok Opname Rutin');
      }
    });
    setCounts({});
    setNote('');
    showToast('Selisih stok fisik berhasil disimpan ke pembukuan!', 'success');
  };

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Stock take & waste" />

      {/* Tab Row & Import */}
      <div className="posa-tab-row-container">
        <div className="posa-tab-pills">
          <button
            type="button"
            className={`posa-tab-btn ${activeTab === 'take' ? 'active' : ''}`}
            onClick={() => setActiveTab('take')}
          >
            <Check size={14} />
            <span>Stock take</span>
          </button>
          <button
            type="button"
            className={`posa-tab-btn ${activeTab === 'waste' ? 'active' : ''}`}
            onClick={() => setActiveTab('waste')}
          >
            <span>Waste</span>
          </button>
          <button
            type="button"
            className={`posa-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span>History</span>
          </button>
        </div>

        <button
          type="button"
          className="posa-btn-outline"
          onClick={() => showToast('Membuka dialog Import from Excel')}
        >
          <FileSpreadsheet size={15} />
          <span>Import from Excel</span>
        </button>
      </div>

      {activeTab === 'take' && (
        <div className="posa-admin-card mt-3">
          <p className="posa-card-subtitle">
            Count what is really on the shelf and type it in. Leave an item empty to skip it. Only differences are saved.
          </p>

          <div className="posa-search-wrapper my-3 w-full">
            <Search size={16} className="posa-search-icon" />
            <input
              type="text"
              className="posa-search-input"
              placeholder="Search ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="posa-table-container">
            <table className="posa-table">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>In posa</th>
                  <th style={{ width: '180px' }}>Counted</th>
                  <th style={{ width: '140px' }}>Difference</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((m) => {
                  const countedVal = counts[m.id];
                  const hasVal = countedVal !== undefined && countedVal !== '';
                  const diff = hasVal ? Number(countedVal) - m.stock : 0;
                  return (
                    <tr key={m.id}>
                      <td className="font-semibold text-white">{m.name}</td>
                      <td>{m.stock} {m.unit}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            className="posa-input py-1 px-2 text-sm w-28 text-white font-mono"
                            placeholder={String(m.stock)}
                            value={countedVal || ''}
                            onChange={(e) => handleCountChange(m.id, e.target.value)}
                          />
                          <span className="text-xs text-muted">{m.unit}</span>
                        </div>
                      </td>
                      <td>
                        {hasVal ? (
                          <span className={`font-mono text-sm font-bold ${diff < 0 ? 'text-red-400' : diff > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {diff > 0 ? `+${diff}` : diff} {m.unit}
                          </span>
                        ) : (
                          <span className="text-muted text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <input
              type="text"
              className="posa-input w-full"
              placeholder="Note (optional), e.g. monthly count"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
            <span className="text-sm text-slate-400">
              {countedItemsCount} item(s) counted
            </span>
            <button
              type="button"
              className="posa-btn-primary px-6"
              onClick={handleSave}
            >
              Save the count
            </button>
          </div>
        </div>
      )}

      {activeTab === 'waste' && (
        <div className="posa-admin-card mt-3">
          <h2 className="posa-card-title">Catat Bahan Terbuang (Waste / Rusak)</h2>
          <p className="posa-card-subtitle">
            Catat bahan baku basi, tumpah, atau rusak untuk transparansi HPP.
          </p>
          <div className="space-y-3 mt-4">
            {rawMaterials.map((m) => (
              <div key={m.id} className="p-3 bg-[#0d111a] rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">{m.name}</div>
                  <div className="text-xs text-muted">Stok sistem: {m.stock} {m.unit}</div>
                </div>
                <button
                  type="button"
                  className="posa-btn-outline text-xs text-red-400 border-red-500/30"
                  onClick={() => {
                    const qty = prompt(`Berapa banyak ${m.name} yang dibuang? (${m.unit})`);
                    if (qty && Number(qty) > 0) {
                      recordWaste(m.id, Number(qty), 'Barang kadaluarsa / rusak');
                    }
                  }}
                >
                  Catat Buang
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="posa-admin-card mt-3">
          <h2 className="posa-card-title">Riwayat Penyesuaian Stok (Mutasi)</h2>
          <div className="posa-table-container mt-3">
            <table className="posa-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Nama Bahan</th>
                  <th>Tipe Mutasi</th>
                  <th>Perubahan Qty</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {stockMovements.map((sm) => (
                  <tr key={sm.id}>
                    <td>{sm.time}</td>
                    <td className="text-white font-medium">{sm.materialName}</td>
                    <td>
                      <span className={`posa-badge-${sm.type === 'restock' ? 'success' : sm.type === 'waste' ? 'danger' : 'warning'}`}>
                        {sm.type}
                      </span>
                    </td>
                    <td className="font-mono text-sm">{sm.qty > 0 ? `+${sm.qty}` : sm.qty}</td>
                    <td className="text-slate-400 text-xs">{sm.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
