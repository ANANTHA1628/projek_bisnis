import React from 'react';
import { usePos } from '../../context/PosContext';
import { X, Receipt, ArrowRight, PlusCircle, Trash2 } from 'lucide-react';

export default function OpenBillsModal() {
  const {
    showOpenBillsModal,
    setShowOpenBillsModal,
    openBills,
    recallOpenBill,
    saveAsOpenBill,
    cart,
    showToast
  } = usePos();

  if (!showOpenBillsModal) return null;

  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={18} color="#60a5fa" />
            <span className="modal-title">Tagihan Terbuka (Open Bills)</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setShowOpenBillsModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick hold active cart */}
          {cart.length > 0 && (
            <button
              className="buka-restock-btn"
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                borderColor: '#3b82f6',
                color: '#60a5fa',
                marginTop: 0
              }}
              onClick={() => {
                saveAsOpenBill();
                setShowOpenBillsModal(false);
              }}
            >
              <PlusCircle size={16} />
              <span>Simpan Pesanan Aktif ke Tagihan Terbuka</span>
            </button>
          )}

          {openBills.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '30px',
                color: 'var(--text-muted)',
                fontSize: '13px'
              }}
            >
              Tidak ada tagihan yang sedang terbuka.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {openBills.map((bill) => (
                <div
                  key={bill.id}
                  style={{
                    backgroundColor: '#162033',
                    border: '1px solid var(--border-card)',
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: 'var(--text-primary)'
                        }}
                      >
                        {bill.table}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {bill.customer} • {bill.time}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#60a5fa'
                      }}
                    >
                      {formatRupiah(bill.total)}
                    </div>
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {bill.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                    <button
                      className="tambah-bahan-btn"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                      onClick={() => recallOpenBill(bill.id)}
                    >
                      <span>Buka ke Kasir</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="tutup-kasir-btn"
            onClick={() => setShowOpenBillsModal(false)}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
