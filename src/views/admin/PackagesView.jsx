import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Plus } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function PackagesView() {
  const { showToast } = usePos();

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Menu Packages" />

      <div className="posa-admin-card">
        <p className="posa-card-subtitle">
          Manage bundle (combo) packages for customers.
        </p>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="posa-btn-primary"
            onClick={() => showToast('Membuka form Buat Paket Menu')}
          >
            <Plus size={16} />
            <span>Create New Package</span>
          </button>
        </div>

        <div className="posa-empty-state">
          No packages yet.
        </div>
      </div>
    </div>
  );
}
