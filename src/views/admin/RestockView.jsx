import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Search, Package, AlertTriangle, Plus, ChevronDown } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function RestockView() {
  const { rawMaterials, restockRawMaterial, showToast } = usePos();
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showTaxDelivery, setShowTaxDelivery] = useState(false);
  const [taxFee, setTaxFee] = useState(0);

  const lowStockMaterials = rawMaterials.filter((m) => m.stock <= m.minStock);

  const handleAddItem = (material) => {
    const existing = cartItems.find((i) => i.id === material.id);
    if (existing) {
      setCartItems(cartItems.map((i) => i.id === material.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCartItems([...cartItems, { ...material, qty: 10, buyPrice: material.avgPrice }]);
    }
    setSearch('');
  };

  const handleConfirm = () => {
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

      <div className="posa-restock-grid">
        {/* Left Card: What did you buy? */}
        <div className="posa-admin-card flex-1">
          <h2 className="posa-card-title">What did you buy?</h2>
          <p className="posa-card-subtitle">
            Add everything from one purchase, then confirm once.
          </p>

          <div className="posa-form-field mt-3">
            <label className="posa-label">Add an item</label>
            <div className="posa-search-wrapper w-full">
              <Search size={16} className="posa-search-icon" />
              <input
                type="text"
                className="posa-search-input"
                placeholder="Search raw materials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {search && (
              <div className="posa-dropdown-results">
                {rawMaterials
                  .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
                  .map((m) => (
                    <div
                      key={m.id}
                      className="posa-dropdown-item"
                      onClick={() => handleAddItem(m)}
                    >
                      <span>{m.name}</span>
                      <span className="text-muted">Stock: {m.stock} {m.unit}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Dotted box or items list */}
          {cartItems.length === 0 ? (
            <div className="posa-dashed-box my-4">
              <Package size={36} className="text-slate-500 mb-2" />
              <p>Nothing added yet. Search above, tap a low-stock item, or scan a receipt.</p>
            </div>
          ) : (
            <div className="posa-restock-items-list my-4">
              {cartItems.map((item) => (
                <div key={item.id} className="posa-restock-item-row">
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-muted">Rp {item.buyPrice} / {item.unit}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="posa-qty-input"
                      value={item.qty}
                      onChange={(e) => {
                        const val = Math.max(1, Number(e.target.value));
                        setCartItems(cartItems.map((i) => i.id === item.id ? { ...i, qty: val } : i));
                      }}
                    />
                    <span className="text-xs text-muted">{item.unit}</span>
                    <button
                      type="button"
                      className="posa-remove-btn"
                      onClick={() => setCartItems(cartItems.filter((i) => i.id !== item.id))}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form selectors */}
          <div className="grid grid-cols-2 gap-3 my-3">
            <div>
              <label className="posa-label">Select Supplier (Optional)</label>
              <select
                className="posa-select"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <option value="">-- No Supplier --</option>
                <option value="CV Kopi Nusantara">CV Kopi Nusantara</option>
                <option value="PT Sumber Susu Segar">PT Sumber Susu Segar</option>
                <option value="Toko Kemasan Jaya">Toko Kemasan Jaya</option>
              </select>
            </div>

            <div>
              <label className="posa-label">&nbsp;</label>
              <button
                type="button"
                className="posa-btn-outline w-full flex justify-between items-center"
                onClick={() => setShowTaxDelivery(!showTaxDelivery)}
              >
                <span>Tax, delivery or discount</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {showTaxDelivery && (
            <div className="p-3 bg-[#0d111a] rounded-lg border border-slate-800 mb-3">
              <label className="posa-label">Biaya Kirim / Pajak Tambahan (Rp)</label>
              <input
                type="number"
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
              <span>Items</span>
              <span>Rp {itemsTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-bold text-white text-base py-1">
              <span>Total paid</span>
              <span>Rp {totalPaid.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            type="button"
            className="posa-btn-primary w-full mt-4 py-3 justify-center"
            onClick={handleConfirm}
          >
            <Plus size={16} />
            <span>Confirm Restock</span>
          </button>
        </div>

        {/* Right Card: Low Stock Alerts */}
        <div className="posa-admin-card w-80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <AlertTriangle size={16} />
              <span>Low Stock Alerts</span>
            </div>
            <span className="posa-count-badge">{lowStockMaterials.length}</span>
          </div>

          {lowStockMaterials.length === 0 ? (
            <p className="text-slate-400 text-sm">
              Everything is above its minimum. Nice.
            </p>
          ) : (
            <div className="space-y-2">
              {lowStockMaterials.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 bg-[#0f1422] rounded-lg border border-amber-500/20 flex justify-between items-center cursor-pointer hover:bg-blue-950/20"
                  onClick={() => handleAddItem(m)}
                >
                  <div>
                    <div className="text-white text-sm font-semibold">{m.name}</div>
                    <div className="text-xs text-amber-400">
                      Sisa: {m.stock} / min: {m.minStock} {m.unit}
                    </div>
                  </div>
                  <span className="text-xs text-blue-400 font-semibold">+ Add</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
