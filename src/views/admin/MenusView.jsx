import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { Search, Plus, FileSpreadsheet, Edit2, Trash2, X, Check } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function MenusView() {
  const { products, calculateMenuHpp, saveProduct, deleteProduct, showToast } = usePos();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('Makanan');
  const [formPrice, setFormPrice] = useState(20000);

  const categories = ['All categories', 'Makanan', 'Non-Kopi', 'Kopi', 'Snack', 'Dessert'];

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku('MN-' + Math.floor(100 + Math.random() * 900));
    setFormCategory('Makanan');
    setFormPrice(20000);
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku || '');
    setFormCategory(p.category || 'Makanan');
    setFormPrice(p.price || 0);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Nama menu wajib diisi!', 'warning');
      return;
    }
    const payload = {
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name: formName.trim(),
      sku: formSku.trim() || 'MN-001',
      category: formCategory,
      price: Number(formPrice) || 0,
      icon: editingProduct?.icon || 'coffee'
    };
    saveProduct(payload);
    setShowModal(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All categories' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Menus" />

      <div className="posa-admin-card">
        {/* Toolbar */}
        <div className="posa-card-toolbar">
          <div className="posa-search-wrapper flex-1">
            <Search size={16} className="posa-search-icon" />
            <input
              type="text"
              className="posa-search-input"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="posa-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="posa-btn-outline"
            onClick={() => showToast('Membuka dialog Import Excel')}
          >
            <FileSpreadsheet size={15} />
            <span>Import from Excel</span>
          </button>

          <button
            type="button"
            className="posa-btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={16} />
            <span>Add Menu</span>
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="posa-empty-state">
            No menus found.
          </div>
        ) : (
          <div className="posa-table-container">
            <table className="posa-table">
              <thead>
                <tr>
                  <th>SKU / Item Name</th>
                  <th>Category</th>
                  <th>Selling Price (Dine-in)</th>
                  <th>HPP (Cost)</th>
                  <th>Margin %</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const hpp = calculateMenuHpp ? calculateMenuHpp(p) : 0;
                  const marginPct = p.price > 0 ? Math.round(((p.price - hpp) / p.price) * 100) : 0;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-xs text-muted font-mono">{p.sku}</div>
                      </td>
                      <td>
                        <span className="posa-badge-pill">{p.category}</span>
                      </td>
                      <td className="font-semibold text-white">
                        Rp {Number(p.price).toLocaleString('id-ID')}
                      </td>
                      <td className="text-slate-300">
                        Rp {Number(hpp).toLocaleString('id-ID')}
                      </td>
                      <td>
                        <span className={`font-bold ${marginPct >= 65 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {marginPct}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="posa-table-actions">
                          <button
                            type="button"
                            className="posa-action-icon-btn"
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Menu"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="posa-action-icon-btn text-danger"
                            onClick={() => deleteProduct(p.id)}
                            title="Hapus Menu"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Menu */}
      {showModal && (
        <div className="posa-modal-backdrop" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="posa-admin-card" style={{ maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? 'Edit Menu' : 'Tambah Menu Baru'}
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-white"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nama Menu</label>
                <input
                  type="text"
                  className="posa-search-input w-full"
                  placeholder="Contoh: Kopi Susu Aren"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">SKU / Kode</label>
                  <input
                    type="text"
                    className="posa-search-input w-full"
                    placeholder="KP-001"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Kategori</label>
                  <select
                    className="posa-select w-full"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Kopi">Kopi</option>
                    <option value="Non-Kopi">Non-Kopi</option>
                    <option value="Snack">Snack</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Harga Jual Dine-in (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  className="posa-search-input w-full"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  className="posa-btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="posa-btn-primary"
                >
                  <Check size={16} />
                  <span>{editingProduct ? 'Simpan Perubahan' : 'Tambah Menu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
