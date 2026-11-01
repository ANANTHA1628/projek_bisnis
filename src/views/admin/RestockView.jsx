import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Search, Package, AlertTriangle, Plus, ChevronDown, ShieldAlert, Trash2 } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function RestockView() {
  const { rawMaterials, restockRawMaterial, showToast, currentUser } = usePos();
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showTaxDelivery, setShowTaxDelivery] = useState(false);
  const [taxFee, setTaxFee] = useState(0);

  // Role check: Supervisor hanya view-only, tidak dapat menambah/mengubah stok restock
  const isSupervisor = currentUser?.role === 'Supervisor';
  const canModifyRestock = currentUser?.role === 'Owner' || currentUser?.role === 'Admin' || !currentUser?.role;

  const lowStockMaterials = rawMaterials.filter((m) => m.stock <= m.minStock);

  const handleAddItem = (material) => {
    if (isSupervisor) {
      showToast('Akses dibatasi: Supervisor hanya memiliki izin melihat data restock (View-Only)', 'warning');
      return;
    }
    const existing = cartItems.find((i) => i.id === material.id);
    if (existing) {
      setCartItems(cartItems.map((i) => i.id === material.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCartItems([...cartItems, { ...material, qty: 10, buyPrice: material.avgPrice }]);
    }
    setSearch('');
  };

  const handleConfirm = () => {
    if (isSupervisor) {
      showToast('Akses dibatasi: Supervisor tidak diizinkan mencatat restock baru', 'warning');
      return;
    }
    if (cartItems.length === 0) {
      showToast('Pilih item bahan baku terlebih dahulu', 'warning');
      return;
    }
    cartItems.forEach((item) => {
      restockRawMaterial(item.id, item.qty, item.buyPrice);
    });
    setCartItems([]);
    showToast('Restock berhasil dicatat ke pembukuan stok!', 'success');
  };

  const itemsTotal = cartItems.reduce((acc, i) => acc + (i.qty * i.buyPrice), 0);
  const totalPaid = itemsTotal + Number(taxFee || 0);

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Restock & Receipts" />

      {/* Banner Disclaimer untuk Supervisor */}
      {isSupervisor && (
        <div className="p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-center gap-3">
          <ShieldAlert size={18} className="text-amber-400 flex-shrink-0" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-white block font-semibold mb-0.5">Mode Tinjauan (View-Only Supervisor)</strong>
            Sebagai Supervisor, Anda hanya memiliki hak akses untuk memantau peringatan stok menipis dan harga bahan baku. Penambahan restock dan pengeluaran modal hanya dapat dikonfirmasi oleh Owner/Admin.
          </div>
        </div>
      )}

      <div className="posa-restock-grid">
        {/* Left Card: What did you buy? */}
        <div className="posa-admin-card flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="posa-card-title">What did you buy?</h2>
              <p className="posa-card-subtitle">
                Add everything from one purchase, then confirm once.
              </p>
            </div>
            {isSupervisor && (
              <span className="posa-badge-pill bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
                View Only
              </span>
            )}
          </div>

          <div className="posa-form-field mt-4 relative">
            <label className="posa-label">Cari & Tambah Bahan Baku</label>
            <div className="posa-search-wrapper w-full">
              <Search size={16} className="posa-search-icon" />
              <input
                type="text"
                disabled={isSupervisor}
                className="posa-search-input"
                style={{
                  cursor: isSupervisor ? 'not-allowed' : 'text',
                  opacity: isSupervisor ? 0.6 : 1
                }}
                placeholder={isSupervisor ? 'Supervisor tidak dapat menambah item restock...' : 'Ketik nama bahan baku (contoh: Kopi Arabika, Susu, Gula)...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {search && !isSupervisor && (
              <div className="posa-dropdown-results">
                {rawMaterials
                  .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
                  .map((m) => (
                    <div
                      key={m.id}
                      className="posa-dropdown-item"
                      onClick={() => handleAddItem(m)}
                    >
                      <div>
                        <span className="font-medium text-white">{m.name}</span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Harga rata-rata: Rp {Number(m.avgPrice || 0).toLocaleString('id-ID')} / {m.unit}
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-[#101726] border border-slate-700 rounded-md text-slate-300">
                        Stok: <strong>{m.stock}</strong> {m.unit}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Dotted box or items list */}
          {cartItems.length === 0 ? (
            <div className="posa-dashed-box my-4">
              <Package size={36} className="text-slate-500 mb-2" />
              <p className="max-w-xs text-center text-slate-400">
                {isSupervisor
                  ? 'Tidak ada item yang sedang dalam draf restock.'
                  : 'Belum ada bahan yang ditambahkan. Ketik di pencarian atas atau klik item peringatan stok di sebelah kanan.'}
              </p>
            </div>
          ) : (
            <div className="posa-restock-items-list my-4">
              {cartItems.map((item) => (
                <div key={item.id} className="posa-restock-item-row">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{item.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Rp {Number(item.buyPrice || 0).toLocaleString('id-ID')} / {item.unit}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-[#161c2d] px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400">Qty:</span>
                      <input
                        type="number"
                        disabled={isSupervisor}
                        className="posa-qty-input"
                        value={item.qty}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          setCartItems(cartItems.map((i) => i.id === item.id ? { ...i, qty: val } : i));
                        }}
                      />
                      <span className="text-xs font-medium text-slate-300">{item.unit}</span>
                    </div>

                    <div className="text-sm font-bold text-blue-400 min-w-[90px] text-right">
                      Rp {(item.qty * item.buyPrice).toLocaleString('id-ID')}
                    </div>

                    {!isSupervisor && (
                      <button
                        type="button"
                        className="posa-remove-btn"
                        onClick={() => setCartItems(cartItems.filter((i) => i.id !== item.id))}
                        title="Hapus dari daftar"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 pt-3 border-t border-slate-800/80">
            <div>
              <label className="posa-label">Pilih Supplier (Opsional)</label>
              <select
                disabled={isSupervisor}
                className="posa-select w-full"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <option value="">-- Tanpa Supplier Terdaftar --</option>
                <option value="CV Kopi Nusantara">CV Kopi Nusantara</option>
                <option value="PT Sumber Susu Segar">PT Sumber Susu Segar</option>
                <option value="Toko Kemasan Jaya">Toko Kemasan Jaya</option>
              </select>
            </div>

            <div>
              <label className="posa-label">Biaya Ekstra</label>
              <button
                type="button"
                disabled={isSupervisor}
                className="posa-btn-outline w-full flex justify-between items-center"
                style={{ height: '37px', opacity: isSupervisor ? 0.6 : 1 }}
                onClick={() => setShowTaxDelivery(!showTaxDelivery)}
              >
                <span>Ongkir / Pajak Pembelian</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {showTaxDelivery && (
            <div className="p-3 bg-[#0d111a] rounded-lg border border-slate-800 mb-3">
              <label className="posa-label">Biaya Kirim / Pajak Tambahan (Rp)</label>
              <input
                type="number"
                disabled={isSupervisor}
                className="posa-input w-full"
                placeholder="0"
                value={taxFee}
                onChange={(e) => setTaxFee(e.target.value)}
              />
            </div>
          )}

          {/* Cost Summary */}
          <div className="posa-summary-block">
            <div className="flex justify-between text-sm text-slate-400 py-1">
              <span>Total Item ({cartItems.length})</span>
              <span>Rp {itemsTotal.toLocaleString('id-ID')}</span>
            </div>
            {Number(taxFee) > 0 && (
              <div className="flex justify-between text-sm text-slate-400 py-1">
                <span>Ongkir / Pajak</span>
                <span>Rp {Number(taxFee).toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-white text-base pt-2 mt-2 border-t border-slate-800">
              <span>Total Pengeluaran Restock</span>
              <span className="text-emerald-400">Rp {totalPaid.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            type="button"
            className="posa-btn-primary w-full mt-4 py-3 justify-center text-sm font-semibold"
            disabled={isSupervisor || cartItems.length === 0}
            style={{
              opacity: isSupervisor || cartItems.length === 0 ? 0.5 : 1,
              cursor: isSupervisor || cartItems.length === 0 ? 'not-allowed' : 'pointer'
            }}
            onClick={handleConfirm}
          >
            <Plus size={16} />
            <span>{isSupervisor ? 'Izin Terbatas (Supervisor View-Only)' : 'Konfirmasi & Catat Restock'}</span>
          </button>
        </div>

        {/* Right Card: Low Stock Alerts */}
        <div className="posa-admin-card w-full lg:w-[340px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <AlertTriangle size={16} />
              <span>Low Stock Alerts</span>
            </div>
            <span className="posa-count-badge bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {lowStockMaterials.length}
            </span>
          </div>

          {lowStockMaterials.length === 0 ? (
            <p className="text-slate-400 text-xs py-4 text-center">
              Semua bahan baku berada di atas batas minimum stok.
            </p>
          ) : (
            <div className="space-y-2.5">
              {lowStockMaterials.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 bg-[#0f1422] rounded-xl border border-amber-500/20 flex justify-between items-center transition-all ${
                    isSupervisor
                      ? 'cursor-default opacity-85'
                      : 'cursor-pointer hover:bg-blue-950/20 hover:border-blue-500/40'
                  }`}
                  onClick={() => !isSupervisor && handleAddItem(m)}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-white text-xs font-semibold truncate">{m.name}</div>
                    <div className="text-[11px] text-amber-400 mt-0.5">
                      Sisa: <strong className="text-white">{m.stock}</strong> / min: {m.minStock} {m.unit}
                    </div>
                  </div>
                  {!isSupervisor ? (
                    <span className="text-xs text-blue-400 font-semibold flex-shrink-0 px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/20">
                      + Add
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-medium">
                      Menipis
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
