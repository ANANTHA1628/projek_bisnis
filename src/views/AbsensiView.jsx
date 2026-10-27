import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePos } from '../context/PosContext';
import Sidebar from '../components/Sidebar';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  LogOut as LogOutIcon,
  UserCheck,
  Search,
  MapPin,
  MessageSquare
} from 'lucide-react';

export default function AbsensiView() {
  const { user, canViewAbsensiAll, apiFetch } = useAuth();
  const { showToast } = usePos();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total_employees: 0, present_today: 0, absent_today: 0 });
  const [actionLoading, setActionLoading] = useState(false);

  // Filter for Owner / Admin
  const [searchStaff, setSearchStaff] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Leave Form Modal
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveStatus, setLeaveStatus] = useState('izin');
  const [leaveNotes, setLeaveNotes] = useState('');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Attendance Data
  const fetchAttendanceData = useCallback(async () => {
    try {
      // 1. Get today status for current user
      const todayRes = await apiFetch('/attendance/today');
      if (todayRes.success) {
        setTodayAttendance(todayRes.data);
      }

      // 2. Get history (all if owner/admin, own if karyawan)
      let url = '/attendances?';
      if (canViewAbsensiAll && filterDate) {
        url += `date=${filterDate}&`;
      }
      if (filterStatus !== 'all') {
        url += `status=${filterStatus}&`;
      }

      const historyRes = await apiFetch(url);
      if (historyRes.success) {
        setHistory(historyRes.data || []);
        if (historyRes.stats) {
          setStats(historyRes.stats);
        }
      }
    } catch (err) {
      console.warn('Gagal memuat absensi dari backend:', err.message);
    }
  }, [apiFetch, canViewAbsensiAll, filterDate, filterStatus]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  // Clock In
  const handleClockIn = async () => {
    setActionLoading(true);
    try {
      const res = await apiFetch('/attendance/clock-in', {
        method: 'POST',
        body: JSON.stringify({
          location: 'POS Outlet Utama',
          notes: 'Absen masuk dari aplikasi POS',
        }),
      });
      if (res.success) {
        showToast(res.message, 'success');
        setTodayAttendance(res.data);
        fetchAttendanceData();
      }
    } catch (err) {
      showToast(err.message, 'warning');
    } finally {
      setActionLoading(false);
    }
  };

  // Clock Out
  const handleClockOut = async () => {
    setActionLoading(true);
    try {
      const res = await apiFetch('/attendance/clock-out', {
        method: 'POST',
        body: JSON.stringify({
          location: 'POS Outlet Utama',
          notes: 'Absen pulang dari aplikasi POS',
        }),
      });
      if (res.success) {
        showToast(res.message, 'success');
        setTodayAttendance(res.data);
        fetchAttendanceData();
      }
    } catch (err) {
      showToast(err.message, 'warning');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Leave (Izin / Sakit)
  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await apiFetch('/attendance/leave', {
        method: 'POST',
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          status: leaveStatus,
          notes: leaveNotes,
        }),
      });
      if (res.success) {
        showToast(res.message, 'success');
        setShowLeaveModal(false);
        setLeaveNotes('');
        fetchAttendanceData();
      }
    } catch (err) {
      showToast(err.message, 'warning');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    if (!searchStaff) return true;
    const name = item.user?.name?.toLowerCase() || '';
    const email = item.user?.email?.toLowerCase() || '';
    return name.includes(searchStaff.toLowerCase()) || email.includes(searchStaff.toLowerCase());
  });

  return (
    <div className="admin-layout-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Absensi Content */}
      <main className="admin-main-content">
        {/* Top Header */}
        <div className="admin-content-header" style={{ marginBottom: '20px' }}>
          <div>
            <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={24} color="#f59e0b" />
              <span>Sistem Absensi Karyawan & Staf</span>
            </h1>
            <p className="admin-page-desc">
              {canViewAbsensiAll
                ? 'Monitoring dan rekap kehadiran staf secara real-time untuk Owner & Admin.'
                : 'Pencatatan absensi masuk, pulang, serta rekap kehadiran harian Anda.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="absensi-live-clock">
              <Clock size={16} color="#fbbf24" />
              <span>
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Kartu Absen Mandiri (Khusus Karyawan atau Siapa Saja) */}
        <div className="absensi-action-grid">
          {/* Card Clock-In / Clock-Out */}
          <div className="absensi-clock-card">
            <div className="absensi-card-header">
              <span className="absensi-user-badge">
                {user?.role?.toUpperCase()} • {user?.name}
              </span>
              <span className="absensi-date-text">
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <div className="absensi-status-display">
              <div className="absensi-big-time">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                <span className="absensi-sec-small">
                  :{currentTime.toLocaleTimeString('id-ID', { second: '2-digit' })}
                </span>
              </div>
              <div className="absensi-state-pill">
                {todayAttendance?.clock_in ? (
                  todayAttendance?.clock_out ? (
                    <span className="badge-status-selesai">
                      <CheckCircle2 size={14} /> Selesai Bekerja Hari Ini
                    </span>
                  ) : (
                    <span className="badge-status-bekerja">
                      <Clock size={14} /> Sedang Bekerja (Masuk: {new Date(todayAttendance.clock_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})
                    </span>
                  )
                ) : (
                  <span className="badge-status-belum">
                    <AlertTriangle size={14} /> Belum Absen Masuk Hari Ini
                  </span>
                )}
              </div>
            </div>

            <div className="absensi-btn-actions">
              <button
                className="btn-absen-masuk"
                disabled={actionLoading || !!todayAttendance?.clock_in}
                onClick={handleClockIn}
              >
                <LogIn size={18} />
                <span>{todayAttendance?.clock_in ? 'Sudah Absen Masuk' : 'Absen Masuk (Clock In)'}</span>
              </button>

              <button
                className="btn-absen-pulang"
                disabled={actionLoading || !todayAttendance?.clock_in || !!todayAttendance?.clock_out}
                onClick={handleClockOut}
              >
                <LogOutIcon size={18} />
                <span>
                  {todayAttendance?.clock_out
                    ? 'Sudah Absen Pulang'
                    : !todayAttendance?.clock_in
                    ? 'Absen Pulang (Menunggu Masuk)'
                    : 'Absen Pulang (Clock Out)'}
                </span>
              </button>

              <button
                className="btn-absen-izin"
                disabled={actionLoading || !!todayAttendance?.clock_in}
                onClick={() => setShowLeaveModal(true)}
              >
                <MessageSquare size={16} />
                <span>Pengajuan Izin / Sakit</span>
              </button>
            </div>
          </div>

          {/* Card Summary (Khusus Owner / Admin) */}
          {canViewAbsensiAll && (
            <div className="absensi-summary-box">
              <h3 className="summary-title">Ringkasan Hari Ini ({filterDate})</h3>
              <div className="summary-stat-grid">
                <div className="summary-stat-item stat-total">
                  <div className="stat-num">{stats.total_employees}</div>
                  <div className="stat-lbl">Total Karyawan</div>
                </div>
                <div className="summary-stat-item stat-hadir">
                  <div className="stat-num">{stats.present_today}</div>
                  <div className="stat-lbl">Hadir Hari Ini</div>
                </div>
                <div className="summary-stat-item stat-absen">
                  <div className="stat-num">{stats.absent_today}</div>
                  <div className="stat-lbl">Belum Hadir / Izin</div>
                </div>
              </div>

              <div className="owner-role-highlight-note">
                <strong>👑 Mode Akses Owner & Admin:</strong>
                <p>
                  Sebagai Owner, Anda berhak memantau kehadiran seluruh staf barista & kasir secara transparan dan lengkap.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Tabel Riwayat Absensi */}
        <div className="absensi-table-container">
          <div className="absensi-table-header">
            <div className="table-title-area">
              <h3>{canViewAbsensiAll ? 'Daftar & Rekap Absensi Seluruh Karyawan' : 'Riwayat Absensi Saya'}</h3>
              <span className="record-count">{filteredHistory.length} data ditemukan</span>
            </div>

            {/* Filter tools */}
            <div className="absensi-filters">
              {canViewAbsensiAll && (
                <>
                  <div className="filter-input-search">
                    <Search size={15} />
                    <input
                      type="text"
                      placeholder="Cari nama karyawan..."
                      value={searchStaff}
                      onChange={(e) => setSearchStaff(e.target.value)}
                    />
                  </div>

                  <input
                    type="date"
                    className="filter-date-input"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </>
              )}

              <select
                className="filter-status-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="hadir">Hadir (Tepat Waktu)</option>
                <option value="terlambat">Terlambat</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
              </select>
            </div>
          </div>

          <table className="absensi-table">
            <thead>
              <tr>
                {canViewAbsensiAll && <th>Karyawan</th>}
                <th>Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Pulang</th>
                <th>Status</th>
                <th>Lokasi</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={canViewAbsensiAll ? 7 : 6} style={{ textAlign: 'center', padding: '36px', color: '#9ca3af' }}>
                    Belum ada catatan absensi untuk periode ini.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id}>
                    {canViewAbsensiAll && (
                      <td>
                        <div style={{ fontWeight: '600', color: '#f3f4f6' }}>
                          {item.user?.name || `Staf #${item.user_id}`}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                          {item.user?.role} • {item.user?.email}
                        </div>
                      </td>
                    )}
                    <td>{item.date}</td>
                    <td>
                      {item.clock_in ? (
                        <span className="clock-tag in">
                          {new Date(item.clock_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {item.clock_out ? (
                        <span className="clock-tag out">
                          {new Date(item.clock_out).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>Belum Pulang</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge-chip ${item.status}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <MapPin size={12} color="#9ca3af" />
                        <span>{item.location_in || 'POS Outlet'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', color: '#d1d5db' }}>
                        {item.notes || '-'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Pengajuan Izin / Sakit */}
        {showLeaveModal && (
          <div className="modal-overlay">
            <div className="modal-card" style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3>Form Keterangan Tidak Hadir</h3>
                <button className="modal-close-btn" onClick={() => setShowLeaveModal(false)}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitLeave} style={{ padding: '20px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Jenis Keterangan</label>
                  <select
                    value={leaveStatus}
                    onChange={(e) => setLeaveStatus(e.target.value)}
                    className="modal-select-input"
                  >
                    <option value="izin">Izin</option>
                    <option value="sakit">Sakit</option>
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Alasan / Catatan</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Sakit demam ada surat dokter..."
                    value={leaveNotes}
                    onChange={(e) => setLeaveNotes(e.target.value)}
                    className="modal-textarea-input"
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="modal-secondary-btn"
                    onClick={() => setShowLeaveModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="modal-primary-btn"
                    disabled={actionLoading}
                  >
                    Kirim Keterangan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
