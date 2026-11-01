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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="posa-card-subtitle m-0">
            Create special discounts, set conditions and claim limits.
          </p>

          <button
            type="button"
            className="posa-btn-primary"
            style={{ width: 'auto' }}
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
