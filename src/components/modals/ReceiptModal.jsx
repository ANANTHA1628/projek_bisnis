import React from 'react';
import { usePos } from '../../context/PosContext';
import { X, Printer, CheckCircle } from 'lucide-react';

export default function ReceiptModal() {
  const { lastReceipt, setLastReceipt, showToast } = usePos();

  if (!lastReceipt) return null;

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const handlePrint = () => {
    window.print();
    showToast('Struk berhasil dikirim ke printer');
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '380px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} color="#10b981" />
            <span className="modal-title">Transaksi Berhasil</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setLastReceipt(null)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '16px' }}>
          {/* Thermal Receipt Paper */}
          <div className="thermal-receipt">
            <div className="receipt-header">
              <div style={{ fontSize: '16px', fontWeight: 800 }}>posa</div>
              <div style={{ fontSize: '11px', color: '#4b5563' }}>
                Coffee & Eatery
              </div>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>
                Jl. Bisnis No. 16, Jakarta Selatan
              </div>
            </div>

            <div style={{ fontSize: '10px', color: '#4b5563', marginBottom: '8px' }}>
              <div>Trx: {lastReceipt.id}</div>
              <div>Waktu: {lastReceipt.date} {lastReceipt.time}</div>
              <div>Kasir: Rina (Owner)</div>
              <div>Pesanan: {lastReceipt.orderType} • {lastReceipt.table}</div>
            </div>

            <div className="receipt-divider" />

            {/* Items */}
            <div>
              {lastReceipt.items.map((item, idx) => (
                <div key={idx} className="receipt-item-row">
                  <div>
                    <div>{item.name}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>
                      {item.quantity}x @ {formatRupiah(item.price)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {formatRupiah(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="receipt-divider" />

            {/* Calculations */}
            <div className="receipt-item-row">
              <span>Subtotal:</span>
              <span>{formatRupiah(lastReceipt.subtotal)}</span>
            </div>
            <div className="receipt-item-row">
              <span>PB1 (10%):</span>
              <span>{formatRupiah(lastReceipt.tax)}</span>
            </div>
            <div className="receipt-item-row" style={{ fontWeight: 800, fontSize: '13px' }}>
              <span>Total:</span>
              <span>{formatRupiah(lastReceipt.total)}</span>
            </div>

            <div className="receipt-divider" />

            <div className="receipt-item-row">
              <span>Metode:</span>
              <span>{lastReceipt.method}</span>
            </div>
            <div className="receipt-item-row">
              <span>Bayar:</span>
              <span>{formatRupiah(lastReceipt.paidAmount || lastReceipt.total)}</span>
            </div>
            {lastReceipt.change > 0 && (
              <div className="receipt-item-row">
                <span>Kembali:</span>
                <span>{formatRupiah(lastReceipt.change)}</span>
              </div>
            )}

            <div
              style={{
                textAlign: 'center',
                marginTop: '14px',
                fontSize: '10px',
                color: '#6b7280'
              }}
            >
              Terima Kasih atas Kunjungan Anda!
              <br />
              WiFi: posa_guest / posacoffee2026
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="tutup-kasir-btn" onClick={handlePrint}>
            <Printer size={15} style={{ marginRight: '6px' }} />
            Cetak Struk
          </button>
          <button
            className="buat-laporan-btn"
            onClick={() => setLastReceipt(null)}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
