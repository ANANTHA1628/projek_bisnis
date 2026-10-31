import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Search } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function OrdersVoidView() {
  const { transactions, showToast } = usePos();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('Any payment');

  const filteredOrders = transactions.filter((t) => {
    const matchSearch = t.receiptNo?.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' ? true : t.status === statusFilter.toLowerCase();
    const matchPayment = paymentFilter === 'Any payment' ? true : t.paymentMethod?.toLowerCase() === paymentFilter.toLowerCase();
    return matchSearch && matchStatus && matchPayment;
  });

  const totalCollected = filteredOrders
    .filter((o) => o.status !== 'voided')
    .reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Orders & Void" />

      <div className="posa-admin-card">
        {/* Search bar & Date */}
        <div className="flex items-center gap-3 mb-4">
          <div className="posa-search-wrapper flex-1">
            <Search size={16} className="posa-search-icon" />
            <input
              type="text"
              className="posa-search-input"
              placeholder="Search order no, customer, phone, amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="posa-date-pill">
            31 Oct 2026
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4 pb-3 border-b border-slate-800">
          <div className="posa-filter-pills">
            {['All', 'Paid', 'Unpaid', 'Voided'].map((status) => (
              <button
                key={status}
                type="button"
                className={`posa-pill-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="posa-filter-pills">
            {['Any payment', 'Cash', 'QRIS', 'Debit'].map((pay) => (
              <button
                key={pay}
                type="button"
                className={`posa-pill-btn ${paymentFilter === pay ? 'active' : ''}`}
                onClick={() => setPaymentFilter(pay)}
              >
                {pay}
              </button>
            ))}
          </div>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center gap-6 text-sm text-slate-300 font-medium mb-3">
          <span>Orders: <strong className="text-white">{filteredOrders.length}</strong></span>
          <span>Collected: <strong className="text-white">Rp {totalCollected.toLocaleString('id-ID')}</strong></span>
        </div>

        {/* Table or Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="posa-empty-state">
            No orders today.
          </div>
        ) : (
          <div className="posa-table-container">
            <table className="posa-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Customer</th>
                  <th>Staff</th>
                  <th>Payment</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="font-mono text-xs">{ord.time}</td>
                    <td>{ord.customerName || 'Umum'}</td>
                    <td>{ord.cashier || 'Budi'}</td>
                    <td>{ord.paymentMethod?.toUpperCase()}</td>
                    <td className="font-semibold text-white">Rp {Number(ord.total).toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`posa-badge-${ord.status === 'voided' ? 'danger' : 'success'}`}>
                        {ord.status || 'paid'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="posa-btn-sm"
                        onClick={() => showToast(`Detail pesanan #${ord.receiptNo}`)}
                      >
                        Detail
                      </button>
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
