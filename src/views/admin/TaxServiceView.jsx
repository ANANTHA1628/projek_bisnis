import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function TaxServiceView() {
  const { showToast } = usePos();
  const [taxes, setTaxes] = useState([
    {
      id: 1,
      name: 'Pajak Restoran (PB1)',
      type: 'Percentage',
      value: '10%',
      calculatedFrom: 'Subtotal after discounts',
      status: 'Active'
    }
  ]);

  const handleAdd = () => {
    const name = prompt('Nama Pajak / Biaya Layanan Baru:');
    if (name) {
      const val = prompt('Nilai (Contoh: 5% atau Rp 2000):', '5%') || '5%';
      setTaxes([
        ...taxes,
        {
          id: Date.now(),
          name,
          type: val.includes('%') ? 'Percentage' : 'Fixed',
          value: val,
          calculatedFrom: 'Subtotal',
          status: 'Active'
        }
      ]);
      showToast(`${name} berhasil ditambahkan!`, 'success');
    }
  };

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Tax & Service Charge" />

      <div className="posa-admin-card">
        <div className="flex items-center justify-between mb-4">
          <p className="posa-card-subtitle m-0">
            Restaurant Tax (PB1) & Service Charge
          </p>

          <button
            type="button"
            className="posa-btn-primary"
            onClick={handleAdd}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>

        <div className="posa-table-container">
          <table className="posa-table">
            <thead>
              <tr>
                <th>Tax/Fee Name</th>
                <th>Type</th>
                <th>Value</th>
                <th>Calculated From</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map((t) => (
                <tr key={t.id}>
                  <td className="font-semibold text-white">{t.name}</td>
                  <td>{t.type}</td>
                  <td className="font-bold text-blue-400">{t.value}</td>
                  <td className="text-slate-300 text-sm">{t.calculatedFrom}</td>
                  <td>
                    <span className="posa-badge-success">{t.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="posa-table-actions justify-end">
                      <button
                        type="button"
                        className="posa-action-icon-btn"
                        onClick={() => showToast(`Edit ${t.name}`)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="posa-action-icon-btn text-danger"
                        onClick={() => {
                          if (window.confirm(`Hapus ${t.name}?`)) {
                            setTaxes(taxes.filter((item) => item.id !== t.id));
                          }
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
