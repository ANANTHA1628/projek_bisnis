import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Plus, Edit2, Trash2, Phone } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function SuppliersView() {
  const { showToast } = usePos();
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'CV Kopi Nusantara',
      contact: 'Pak Hendra',
      phone: '081122334455',
      items: 'Biji Kopi Arabika Single Origin & House Blend'
    },
    {
      id: 2,
      name: 'PT Sumber Susu Segar',
      contact: 'Ibu Maya',
      phone: '081233445566',
      items: 'Susu Segar Pasteurisasi & Oat Milk'
    },
    {
      id: 3,
      name: 'Toko Kemasan Jaya',
      contact: 'Ko Steven',
      phone: '081344556677',
      items: 'Cup 16oz, Paper Straw, Box Pastry'
    }
  ]);

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
        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="posa-btn-primary"
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
