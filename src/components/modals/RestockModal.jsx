import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, Plus, PackageCheck } from 'lucide-react';

export default function RestockModal() {
  const {
    showRestockModal,
    setShowRestockModal,
    rawMaterials,
    restockRawMaterial,
    showToast
  } = usePos();

  const [selectedId, setSelectedId] = useState(rawMaterials[0]?.id || 'biji-kopi-arabika');
  const [amount, setAmount] = useState(1000);
  const [unitPrice, setUnitPrice] = useState(220);
  const [supplierName, setSupplierName] = useState('CV Kopi Nusantara');
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-4)}`);

  if (!showRestockModal) return null;

  const currentItem = rawMaterials.find((m) => m.id === selectedId) || rawMaterials[0];
  const lowStockItems = rawMaterials.filter((m) => m.stock <= m.minStock);

  const handleSelectMaterial = (id) => {
    setSelectedId(id);
    const item = rawMaterials.find((m) => m.id === id);
    if (item) {
      setUnitPrice(item.avgPrice);
    }
  };

  const handleRestock = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    restockRawMaterial(selectedId, Number(amount), Number(unitPrice), invoiceNo);
    setShowRestockModal(false);
  };

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  const totalCost = Number(amount || 0) * Number(unitPrice || 0);

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PackageCheck size={18} color="#60a5fa" />
            <span className="modal-title">Restock Bahan Baku (Moving Average)</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setShowRestockModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleRestock}>
          <div className="modal-body">
            {lowStockItems.length > 0 && (
              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  fontSize: '12px',
                  color: '#fbbf24'
                }}
              >
                Terdapat <strong>{lowStockItems.length} bahan</strong> di bawah stok minimum!
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Pilih Bahan Baku
              </label>
              <select
                className="kasir-search-input"
                value={selectedId}
                onChange={(e) => handleSelectMaterial(e.target.value)}
              >
                {rawMaterials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Stok: {m.stock} {m.unit} · HPP saat ini: {formatRupiah(m.avgPrice)}/{m.unit}) {m.stock <= m.minStock ? '⚠️' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Jumlah Masuk ({currentItem?.unit})
                </label>
                <input
                  type="number"
                  className="kasir-search-input"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  min={0.1}
                  step="any"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Harga Beli Satuan (Rp)
                </label>
                <input
                  type="number"
                  className="kasir-search-input"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  required
                  min={0}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Pemasok (Supplier)
                </label>
                <select
                  className="kasir-search-input"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                >
                  <option value="CV Kopi Nusantara">CV Kopi Nusantara</option>
                  <option value="PT Sumber Susu Segar">PT Sumber Susu Segar</option>
                  <option value="Toko Kemasan Jaya">Toko Kemasan Jaya</option>
                  <option value="Pemasok Lainnya">Pemasok Lainnya</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  No. Faktur / Invoice
                </label>
                <input
                  type="text"
                  className="kasir-search-input"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                />
              </div>
            </div>

            {/* Total restock calculation */}
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: '#162033',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px'
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>Total Pembelian:</span>
              <span style={{ fontWeight: 700, color: '#60a5fa' }}>{formatRupiah(totalCost)}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="tutup-kasir-btn"
              onClick={() => setShowRestockModal(false)}
            >
              Batal
            </button>
            <button type="submit" className="buat-laporan-btn">
              Simpan & Update HPP Rata-rata
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
