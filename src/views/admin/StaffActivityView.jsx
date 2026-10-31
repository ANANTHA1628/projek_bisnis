import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Wallet, Calendar, FileSpreadsheet, Search, Filter, RefreshCw } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function StaffActivityView() {
  const { staffActivityLogs, showToast, staffList } = usePos();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [staffFilter, setStaffFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const shiftsData = [
    {
      id: 1,
      staff: 'Aryaputra Ferdiananta',
      role: 'Supervisor',
      shift: '31 Oct, 08:00 – 14:58',
      sales: 185000,
      expected: 685000,
      counted: 685000,
      diff: 'exact'
    },
    {
      id: 2,
      staff: 'Budi Barista',
      role: 'Cashier',
      shift: '31 Oct, 15:02 – Sekarang',
      sales: 120000,
      expected: 320000,
      counted: 320000,
      diff: 'Shift Aktif'
    },
    {
      id: 3,
      staff: 'Ahmad Rafi Hamdi',
      role: 'Owner',
      shift: '28 Oct, 12:03 – 12:03',
      sales: 0,
      expected: 500000,
      counted: 500000,
      diff: 'exact'
    }
  ];

  // Filter dynamic activity logs
  const logsToDisplay = (staffActivityLogs && staffActivityLogs.length > 0)
    ? staffActivityLogs
    : [];

  const filteredLogs = logsToDisplay.filter((log) => {
    const matchSearch =
      log.name.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.role.toLowerCase().includes(search.toLowerCase());

    const matchStaff = staffFilter === 'ALL' || log.name === staffFilter;
    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchSearch && matchStaff && matchAction;
  });

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Staff Activity" />

      {/* Card 1: Shifts & Cash Drawer */}
      <div className="posa-admin-card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
            <Wallet size={16} />
            <span>Shifts & Cash Drawer Rekonsiliasi</span>
          </div>
          <span className="text-xs text-muted">
            Riwayat buka/tutup kasir kas & laci per staf
          </span>
        </div>

        <div className="posa-table-container">
          <table className="posa-table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Role</th>
                <th>Shift</th>
                <th>Total Sales</th>
                <th>Should be in the drawer</th>
                <th>Counted</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              {shiftsData.map((s) => (
                <tr key={s.id}>
                  <td className="font-semibold text-white">{s.staff}</td>
                  <td>
                    <span className="posa-badge-pill">{s.role}</span>
                  </td>
                  <td className="text-slate-300 font-mono text-xs">{s.shift}</td>
                  <td>Rp {s.sales.toLocaleString('id-ID')}</td>
                  <td>Rp {s.expected.toLocaleString('id-ID')}</td>
                  <td>Rp {s.counted.toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`font-semibold text-xs ${s.diff === 'Shift Aktif' ? 'text-blue-400' : 'text-emerald-400'}`}>
                      {s.diff}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-end gap-3 mt-4 pt-3 border-t border-slate-800">
          <div>
            <label className="posa-label">Date From</label>
            <input
              type="date"
              className="posa-input text-sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div>
            <label className="posa-label">Date To</label>
            <input
              type="date"
              className="posa-input text-sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="posa-btn-primary"
            onClick={() => showToast('Filter shift diterapkan')}
          >
            <span>Filter</span>
          </button>

          <button
            type="button"
            className="posa-btn-outline"
            onClick={() => showToast('Mengekspor Shift & Cash Drawer ke Excel')}
          >
            <FileSpreadsheet size={15} />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Card 2: Activity Log Table (Realtime Login / Logout All Staff) */}
      <div className="posa-admin-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="posa-card-title">Staff Audit Log (Login & Logout)</h2>
            <p className="posa-card-subtitle">
              Pencatatan riwayat masuk (*Sign In*) dan keluar (*Sign Out*) semua staf dan kasir secara realtime.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Staf */}
            <select
              className="posa-select text-xs"
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
            >
              <option value="ALL">Semua Staf & Kasir</option>
              {staffList.map((st) => (
                <option key={st.id} value={st.name}>
                  {st.name} ({st.role})
                </option>
              ))}
            </select>

            {/* Filter Action */}
            <select
              className="posa-select text-xs"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="ALL">Semua Aktivitas</option>
              <option value="SIGNED IN">SIGNED IN (Masuk)</option>
              <option value="SIGNED OUT">SIGNED OUT (Keluar)</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="posa-search-wrapper mb-3 w-full">
          <Search size={16} className="posa-search-icon" />
          <input
            type="text"
            className="posa-search-input"
            placeholder="Search activity by name, role, or action detail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="posa-table-container">
          <table className="posa-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Role</th>
                <th>Action</th>
                <th>Details</th>
                <th>Time & Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    Tidak ada aktivitas staf yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((act) => {
                  const isOwner = act.role === 'Owner';
                  const isSupervisor = act.role === 'Supervisor';
                  return (
                    <tr key={act.id}>
                      <td>
                        <div className="font-semibold text-white">{act.name}</div>
                      </td>
                      <td>
                        <span className={`posa-badge-pill ${isOwner ? 'bg-blue-600/30 text-blue-300' : isSupervisor ? 'bg-amber-600/30 text-amber-300' : 'bg-slate-700/50 text-slate-300'}`}>
                          {act.role}
                        </span>
                      </td>
                      <td>
                        <span className={`posa-status-tag ${act.action === 'SIGNED IN' ? 'in' : 'out'}`}>
                          {act.action}
                        </span>
                      </td>
                      <td className="text-slate-300 text-sm">{act.details}</td>
                      <td className="text-slate-400 font-mono text-xs">{act.time}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
