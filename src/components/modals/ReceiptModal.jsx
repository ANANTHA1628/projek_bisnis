import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, Printer, CheckCircle, Sliders } from 'lucide-react';

export default function ReceiptModal() {
  const { lastReceipt, setLastReceipt, printerSize, setPrinterSize, showToast } = usePos();

  if (!lastReceipt) return null;

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const handlePrint = () => {
    window.print();
    showToast(`Struk (${printerSize}) berhasil dicetak`);
  };

  const is80mm = printerSize === '80mm';

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: is80mm ? '420px' : '360px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} color="#10b981" />
            <span className="modal-title">Transaksi Berhasil</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Toggle Printer 58mm / 80mm (D6) */}
            <div className="lang-switch-group" style={{ marginRight: '6px' }}>
              <button
                className={`lang-btn ${printerSize === '58mm' ? 'active' : ''}`}
                onClick={() => setPrinterSize('58mm')}
                title="Format Lebar Kertas 58mm"
              >
                58mm
              </button>
              <button
                className={`lang-btn ${printerSize === '80mm' ? 'active' : ''}`}
                onClick={() => setPrinterSize('80mm')}
                title="Format Lebar Kertas 80mm"
              >
                80mm
              </button>
            </div>

            <button
              className="modal-close-btn"
              onClick={() => setLastReceipt(null)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '16px' }}>
          {/* Thermal Receipt Paper */}
          <div
            className="thermal-receipt"
            style={{ width: is80mm ? '360px' : '280px', margin: '0 auto', fontSize: is80mm ? '12px' : '11px' }}
          >
            <div className="receipt-header">
              <div style={{ fontSize: is80mm ? '18px' : '16px', fontWeight: 800 }}>posa</div>
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
              <div>Kanal: {lastReceipt.orderType} • {lastReceipt.table}</div>
            </div>

            <div className="receipt-divider" />

            {/* Items */}
            <div>
              {lastReceipt.items.map((item, idx) => (
                <div key={idx} className="receipt-item-row" style={{ marginBottom: '4px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>
                      {item.quantity}x @ {formatRupiah(item.price)}
                      {item.notes ? ` (${item.notes})` : ''}
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

            {lastReceipt.discount > 0 && (
              <div className="receipt-item-row" style={{ color: '#ef4444' }}>
                <span>Diskon:</span>
                <span>-{formatRupiah(lastReceipt.discount)}</span>
              </div>
            )}

            <div className="receipt-item-row">
              <span>PB1 (10%):</span>
              <span>{formatRupiah(lastReceipt.tax)}</span>
            </div>

            <div className="receipt-item-row" style={{ fontWeight: 800, fontSize: is80mm ? '14px' : '13px' }}>
              <span>Total Tagihan:</span>
              <span>{formatRupiah(lastReceipt.total)}</span>
            </div>

            <div className="receipt-divider" />

            <div className="receipt-item-row">
              <span>Metode Pembayaran:</span>
              <span>{lastReceipt.method}</span>
            </div>
            <div className="receipt-item-row">
              <span>Diterima:</span>
              <span>{formatRupiah(lastReceipt.paidAmount || lastReceipt.total)}</span>
            </div>
            {lastReceipt.change > 0 && (
              <div className="receipt-item-row">
                <span>Kembalian:</span>
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
            Cetak ({printerSize})
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
