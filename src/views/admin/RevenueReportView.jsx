import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { FileSpreadsheet, FileText, Send, DollarSign, ArrowUpRight } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function RevenueReportView() {
  const { transactions, showToast, setShowWhatsAppModal } = usePos();
  const [fromDate, setFromDate] = useState('2026-10-31');
  const [toDate, setToDate] = useState('2026-10-31');
  const [periodPill, setPeriodPill] = useState('Today');

  const totalCollected = transactions
    .filter((t) => t.status !== 'voided')
    .reduce((acc, t) => acc + (t.total || 0), 0);

  const txCount = transactions.filter((t) => t.status !== 'voided').length;

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Revenue Report" />

      {/* Card 1: Report Period */}
      <div className="posa-admin-card">
        <h2 className="posa-card-title">Report period</h2>
        <div className="flex flex-wrap items-end gap-3 mt-4">
          <div className="flex-1 min-w-[140px]">
            <label className="posa-label">From</label>
            <input
              type="date"
              className="posa-input text-sm w-full"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="posa-label">To</label>
            <input
              type="date"
              className="posa-input text-sm w-full"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="posa-btn-primary"
            style={{ height: '38px', padding: '0 20px' }}
            onClick={() => showToast('Laporan berhasil dimuat')}
          >
            Generate Report
          </button>
        </div>

        <div className="posa-filter-pills mt-4 pt-3 border-t border-slate-800/80">
          {['Today', 'Yesterday', 'This Week', 'This Month', 'Last month'].map((p) => (
            <button
              key={p}
              type="button"
              className={`posa-pill-btn ${periodPill === p ? 'active' : ''}`}
              onClick={() => setPeriodPill(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Export & Daily WhatsApp */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Export Card */}
        <div className="posa-admin-card flex flex-col justify-between">
          <div>
            <h2 className="posa-card-title">Export</h2>
            <p className="posa-card-subtitle">
              Uses the period above. Times are WIB; voided orders are listed but excluded from totals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <button
              type="button"
              className="posa-export-card"
              onClick={() => showToast('Mengekspor Excel 6 sheets...')}
            >
              <FileSpreadsheet size={22} className="text-emerald-400 mb-2" />
              <div className="font-bold text-white text-xs mb-0.5">Excel</div>
              <div className="text-[11px] text-muted leading-tight">Full report, 6 sheets</div>
            </button>

            <button
              type="button"
              className="posa-export-card"
              onClick={() => showToast('Mengekspor CSV transaksi...')}
            >
              <FileText size={22} className="text-blue-400 mb-2" />
              <div className="font-bold text-white text-xs mb-0.5">CSV</div>
              <div className="text-[11px] text-muted leading-tight">One row per transaction</div>
            </button>

            <button
              type="button"
              className="posa-export-card"
              onClick={() => showToast('Mengekspor CSV per item sold...')}
            >
              <FileText size={22} className="text-blue-400 mb-2" />
              <div className="font-bold text-white text-xs mb-0.5">CSV</div>
              <div className="text-[11px] text-muted leading-tight">One row per item sold</div>
            </button>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className="posa-admin-card flex flex-col justify-between">
          <div>
            <h2 className="posa-card-title">Daily report to WhatsApp</h2>
            <p className="posa-card-subtitle">
              Sends the day's summary and transactions as CSV files.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <input
              type="date"
              className="posa-input text-sm flex-1"
              defaultValue="2026-10-31"
            />
            <button
              type="button"
              className="posa-btn-primary"
              style={{ height: '38px', padding: '0 18px' }}
              onClick={() => setShowWhatsAppModal(true)}
            >
              <Send size={15} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: 4 Metric Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="posa-metric-card">
          <div className="text-xs text-muted font-medium">Total collected</div>
          <div className="text-2xl font-bold text-white my-1.5">
            Rp {totalCollected.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500">Gross revenue</div>
        </div>

        <div className="posa-metric-card">
          <div className="text-xs text-muted font-medium">Net sales</div>
          <div className="text-2xl font-bold text-white my-1.5">
            Rp {totalCollected.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 leading-tight">Before tax, after discounts</div>
        </div>

        <div className="posa-metric-card">
          <div className="text-xs text-muted font-medium">Gross profit</div>
          <div className="text-2xl font-bold text-emerald-400 my-1.5">
            Rp {totalCollected.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 leading-tight">0% margin · ingredients cost Rp 0</div>
        </div>

        <div className="posa-metric-card">
          <div className="text-xs text-muted font-medium">Transactions</div>
          <div className="text-2xl font-bold text-white my-1.5">
            {txCount}
          </div>
          <div className="text-[11px] text-slate-400 leading-tight">avg Rp 0 · 0 voided</div>
        </div>
      </div>

      {/* Row 4: Revenue Trend & Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Revenue Trend Chart Box */}
        <div className="posa-admin-card md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="posa-card-title">Revenue Trend</h2>
            <span className="text-xs text-muted bg-[#161c2d] px-2.5 py-1 rounded-md border border-slate-800">
              Tap a day to see its busiest hours
            </span>
          </div>

          <div className="h-44 flex flex-col justify-between py-2 border-b border-slate-800">
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>0K</span>
              <span>Sat 31</span>
            </div>
            <div className="relative h-28 flex items-center">
              <div className="w-full border-b border-dashed border-slate-800" />
              <div className="absolute left-1/2 -translate-x-1/2 p-2.5 bg-[#192236] border border-blue-500/30 rounded-lg text-xs text-blue-300 shadow-lg">
                14:00–15:00 : 0 orders · Rp 0
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>08:00</span>
              <span>10:00</span>
              <span>12:00</span>
              <span>14:00</span>
              <span>16:00</span>
              <span>18:00</span>
              <span>20:00</span>
              <span>22:00</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 mt-4">
            ⏱ Busiest hours: whole period (No orders yet)
          </div>
        </div>

        {/* Payment Methods */}
        <div className="posa-admin-card">
          <h2 className="posa-card-title mb-4">Payment Methods</h2>
          <div className="space-y-3">
            <div className="p-3.5 bg-[#0f1422] rounded-xl border border-slate-800/80 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-200">💵 Cash</span>
              <span className="font-bold text-white text-sm">Rp 0</span>
            </div>
            <div className="p-3.5 bg-[#0f1422] rounded-xl border border-slate-800/80 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-200">📱 QRIS</span>
              <span className="font-bold text-white text-sm">Rp 0</span>
            </div>
            <div className="p-3.5 bg-[#0f1422] rounded-xl border border-slate-800/80 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-200">💳 Debit</span>
              <span className="font-bold text-white text-sm">Rp 0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Losses & Top Selling Menus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Losses Card */}
        <div className="posa-admin-card">
          <h2 className="posa-card-title mb-4">Losses</h2>
          <div className="space-y-2.5">
            <div className="p-3 bg-[#0f1422] rounded-xl border border-slate-800/80 flex justify-between text-sm">
              <span className="text-slate-300">Items voided after paying</span>
              <span className="font-bold text-red-400">Rp 0</span>
            </div>
            <div className="p-3 bg-[#0f1422] rounded-xl border border-slate-800/80 flex justify-between text-sm">
              <span className="text-slate-300">Thrown away (waste)</span>
              <span className="font-bold text-red-400">Rp 0</span>
            </div>
            <div className="p-3 bg-[#0f1422] rounded-xl border border-slate-800/80 flex justify-between text-sm">
              <span className="text-slate-300">Stock take difference</span>
              <span className="font-bold text-red-400">Rp 0</span>
            </div>
          </div>
          <p className="text-[11px] text-muted mt-3.5 leading-relaxed">
            Waste and stock-take differences are costs on top of the gross profit above.
          </p>
        </div>

        {/* Top Selling Menus */}
        <div className="posa-admin-card md:col-span-2">
          <h2 className="posa-card-title mb-4">Top Selling Menus</h2>
          <div className="posa-empty-state">
            No sales in this period.
          </div>
        </div>
      </div>
    </div>
  );
}
