import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, CheckCircle, Banknote, QrCode, CreditCard, Clock } from 'lucide-react';

export default function PaymentModal() {
  const {
    showPaymentModal,
    setShowPaymentModal,
    total,
    paymentMethod,
    setPaymentMethod,
    completePayment,
    selectedTable,
    orderType,
    showToast
  } = usePos();

  const [cashGiven, setCashGiven] = useState(total);

  if (!showPaymentModal) return null;

  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  const change = Math.max(0, cashGiven - total);

  const quickCashOptions = [
    { label: 'Uang Pas', value: total },
    { label: 'Rp 110.000', value: 110000 },
    { label: 'Rp 120.000', value: 120000 },
    { label: 'Rp 150.000', value: 150000 },
    { label: 'Rp 200.000', value: 200000 }
  ];

  const handlePay = () => {
    if (paymentMethod === 'tunai' && cashGiven < total) {
      showToast('Uang yang dibayarkan kurang dari total tagihan', 'warning');
      return;
    }
    completePayment(paymentMethod === 'tunai' ? cashGiven : total);
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-dialog-box" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div className="modal-title">Pembayaran Pesanan</div>
          <button
            className="modal-close-btn"
            onClick={() => setShowPaymentModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Order info banner */}
          <div
            style={{
              padding: '14px',
              backgroundColor: '#162033',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {orderType} • {selectedTable || 'Kasir'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Total Pembayaran
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#60a5fa' }}>
              {formatRupiah(total)}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Pilih Metode Pembayaran
            </label>
            <div className="payment-methods-grid">
              <button
                className={`payment-method-btn ${paymentMethod === 'tunai' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('tunai')}
              >
                <Banknote size={16} />
                <span>Tunai</span>
              </button>

              <button
                className={`payment-method-btn ${paymentMethod === 'qris' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('qris')}
              >
                <QrCode size={16} />
                <span>QRIS</span>
              </button>

              <button
                className={`payment-method-btn ${paymentMethod === 'debit' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('debit')}
              >
                <CreditCard size={16} />
                <span>Kartu debit</span>
              </button>

              <button
                className={`payment-method-btn ${paymentMethod === 'bayar_nanti' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('bayar_nanti')}
              >
                <Clock size={16} />
                <span>Bayar nanti</span>
              </button>
            </div>
          </div>

          {/* Cash input controls */}
          {paymentMethod === 'tunai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Nominal Diterima (Rp)
                </label>
                <input
                  type="number"
                  className="kasir-search-input"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                />
              </div>

              {/* Quick cash pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {quickCashOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    className="preset-pill"
                    style={{ fontSize: '11.5px', padding: '5px 10px' }}
                    onClick={() => setCashGiven(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Kembalian */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: '#0e1624',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Kembalian
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: change > 0 ? '#10b981' : 'var(--text-primary)'
                  }}
                >
                  {formatRupiah(change)}
                </span>
              </div>
            </div>
          )}

          {/* QRIS Screen */}
          {paymentMethod === 'qris' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                color: '#111827',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>
                QRIS POSA COFFEE
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px' }}>
                NMID: ID1029384756382
              </div>

              {/* Stylized QR Code */}
              <div
                style={{
                  width: '160px',
                  height: '160px',
                  backgroundColor: '#000',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    padding: '6px'
                  }}
                >
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: (i % 2 === 0 || i % 5 === 0) ? '#000' : '#fff'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '12px', fontSize: '12px', color: '#374151' }}>
                Scan dengan GoPay, OVO, Dana, BCA, atau Livin Mandiri
              </div>
            </div>
          )}

          {/* Debit Card Screen */}
          {paymentMethod === 'debit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Nomor Referensi Mesin EDC
                </label>
                <input
                  type="text"
                  className="kasir-search-input"
                  placeholder="Contoh: REF-88992211"
                  defaultValue="BCA-EDC-4421"
                />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Silakan gesek / tap kartu pelanggan pada mesin EDC kasir.
              </div>
            </div>
          )}

          {/* Bayar Nanti Screen */}
          {paymentMethod === 'bayar_nanti' && (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Tagihan akan dicatat sebagai Open Bill dan dapat dibayar sebelum pelanggan
              meninggalkan kafe.
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="tutup-kasir-btn"
            onClick={() => setShowPaymentModal(false)}
          >
            Batal
          </button>
          <button className="buat-laporan-btn" onClick={handlePay}>
            Konfirmasi Bayar ({formatRupiah(total)})
          </button>
        </div>
      </div>
    </div>
  );
}
