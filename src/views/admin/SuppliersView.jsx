import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Plus, Edit2, Trash2, Phone } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function SuppliersView() {
  const { showToast } = usePos();
  const [suppliers, setSuppliers] = useState([]);

  const handleAdd = () => {
    const name = prompt('Nama Supplier Baru:');
    if (name) {
      const contact = prompt('Nama Kontak Person:') || '-';
      const phone = prompt('Nomor Telepon:') || '-';
      setSuppliers([...suppliers, { id: Date.now(), name, contact, phone, items: '-' }]);
      showToast(`Supplier ${name} berhasil ditambahkan!`, 'success');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus supplier ini?')) {
      setSuppliers(suppliers.filter((s) => s.id !== id));
      showToast('Supplier telah dihapus');
    }
  };

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Suppliers" />

      <div className="posa-admin-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="posa-card-subtitle m-0">
            Daftar rekanan supplier bahan baku & kemasan kopi.
          </p>
          <button
            type="button"
            className="posa-btn-primary"
            style={{ width: 'auto' }}
            onClick={handleAdd}
          >
            <Plus size={16} />
            <span>Add Supplier</span>
          </button>
        </div>

        {suppliers.length === 0 ? (
          <div className="posa-empty-state">
            No suppliers found.
          </div>
        ) : (
          <div className="posa-table-container">
            <table className="posa-table">
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Contact Person</th>
                  <th>Phone</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id}>
                    <td className="font-semibold text-white">
                      <div>{s.name}</div>
                      <div className="text-xs text-muted font-normal">{s.items}</div>
                    </td>
                    <td>{s.contact}</td>
                    <td>
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <Phone size={13} />
                        <span>{s.phone}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="posa-table-actions">
                        <button
                          type="button"
                          className="posa-action-icon-btn"
                          onClick={() => showToast(`Edit data ${s.name}`)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="posa-action-icon-btn text-danger"
                          onClick={() => handleDelete(s.id)}
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
        )}
      </div>
    </div>
  );
}
