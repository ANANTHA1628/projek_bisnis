import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Plus, Layers } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function TablesView() {
  const { showToast } = usePos();
  const [tables, setTables] = useState([
    { id: 1, name: 'Meja 01', capacity: 4, status: 'available' },
    { id: 2, name: 'Meja 02', capacity: 2, status: 'occupied' },
    { id: 3, name: 'Meja 03', capacity: 4, status: 'available' },
    { id: 4, name: 'Meja 04', capacity: 6, status: 'occupied' }
  ]);

  const handleAddTable = () => {
    const name = prompt('Nomor/Nama Meja Baru:', `Meja 0${tables.length + 1}`);
    if (name) {
      setTables([...tables, { id: Date.now(), name, capacity: 4, status: 'available' }]);
      showToast(`${name} berhasil ditambahkan!`, 'success');
    }
  };

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Table Management" />

      <div className="posa-admin-card">
        {/* Floors & Add Table */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button type="button" className="posa-pill-btn active">
              Floor 1 · {tables.length}
            </button>
            <button
              type="button"
              className="text-xs text-blue-400 font-semibold hover:underline flex items-center gap-1"
              onClick={() => showToast('Tambah lantai baru')}
            >
              <Layers size={13} />
              <span>Add a floor</span>
            </button>
          </div>

          <button
            type="button"
            className="posa-btn-primary"
            onClick={handleAddTable}
          >
            <Plus size={16} />
            <span>Add Table</span>
          </button>
        </div>

        {tables.length === 0 ? (
          <div className="posa-empty-state">
            No tables found. Add some tables to manage dine-in orders.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {tables.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-xl border flex flex-col justify-between h-32 ${t.status === 'occupied' ? 'bg-[#1a1c2e] border-blue-500/40' : 'bg-[#101422] border-slate-800'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-white font-bold text-lg">{t.name}</div>
                  <span className={`posa-badge-${t.status === 'occupied' ? 'warning' : 'success'}`}>
                    {t.status === 'occupied' ? 'Terisi' : 'Kosong'}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Kapasitas: {t.capacity} Orang
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
