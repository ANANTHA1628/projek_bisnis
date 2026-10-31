import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Plus, Percent } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function PromosView() {
  const { showToast } = usePos();

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Promo Management" />

      <div className="posa-admin-card">
        <p className="posa-card-subtitle">
          Create special discounts, set conditions and claim limits.
        </p>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="posa-btn-primary"
            onClick={() => showToast('Membuka form Tambah Promo')}
          >
            <Plus size={16} />
            <span>Add Promo</span>
          </button>
        </div>

        <div className="posa-empty-state-centered">
          <div className="posa-icon-circle-empty mb-3">
            <Percent size={28} className="text-slate-500" />
          </div>
          <h3 className="font-bold text-white mb-1">No promos yet.</h3>
          <p className="text-slate-400 text-sm">
            A discount, buy 1 get 1, a free item, or a special price.
          </p>
        </div>
      </div>
    </div>
  );
}
