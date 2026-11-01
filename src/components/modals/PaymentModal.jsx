import React, { useState, useEffect, useMemo } from 'react';
import { usePos } from '../../context/PosContext';
import { X, Banknote, QrCode, CreditCard, Clock, Tag } from 'lucide-react';

export default function PaymentModal() {
  const {
    showPaymentModal,
    setShowPaymentModal,
    subtotal,
    discount,
    setDiscount,
    taxPb1,
    total,
    paymentMethod,
    setPaymentMethod,
    completePayment,
    selectedTable,
    orderType,
    setShowAdminPinModal,
    setAdminPinConfig,
    currentUser,
    showToast
  } = usePos();

  const [cashGiven, setCashGiven] = useState(total);
  const [showDiscountPanel, setShowDiscountPanel] = useState(false);
  const [discountMode, setDiscountMode] = useState('target_price'); // 'target_price' | 'nominal' | 'percent'
  const [discountInputVal, setDiscountInputVal] = useState('');

  // Sinkronisasi otomatis nilai pembayaran tunai setiap kali total / diskon berubah
  useEffect(() => {
    if (showPaymentModal) {
      setCashGiven(total);
    }
  }, [total, showPaymentModal]);

  const calculatedDiscount = useMemo(() => {
    const val = Number(discountInputVal) || 0;
    if (val <= 0) return 0;
    if (discountMode === 'target_price') {
      // Input harga baru / kesepakatan (contoh subtotal 50.000, input 40.000 -> diskon 10.000)
      return Math.max(0, subtotal - val);
    }
    if (discountMode === 'nominal') {
      // Input potongan nominal rupiah langsung
      return Math.min(subtotal, val);
    }
    if (discountMode === 'percent') {
      // Input persentase potongan (%)
      return Math.round((subtotal * Math.min(100, val)) / 100);
    }
    return 0;
  }, [discountInputVal, discountMode, subtotal]);

  if (!showPaymentModal) return null;

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const change = Math.max(0, cashGiven - total);

  const quickCashOptions = [
    { label: 'Uang Pas', value: total },
    { label: formatRupiah(Math.ceil(total / 10000) * 10000), value: Math.ceil(total / 10000) * 10000 },
    { label: formatRupiah(Math.ceil(total / 50000) * 50000), value: Math.ceil(total / 50000) * 50000 },
    { label: 'Rp 100.000', value: 100000 },
    { label: 'Rp 200.000', value: 200000 }
  ].filter((opt, idx, arr) => opt.value >= total && arr.findIndex((x) => x.value === opt.value) === idx);

  const handlePay = () => {
    if (paymentMethod === 'tunai' && cashGiven < total) {
      showToast('Uang yang dibayarkan kurang dari total tagihan', 'warning');
      return;
    }
    completePayment(paymentMethod === 'tunai' ? cashGiven : total);
  };

  const handleOpenDiscountPanel = () => {
    // Jika Owner atau Supervisor, bisa langsung buka panel diskon tanpa PIN
    if (currentUser?.role === 'Owner' || currentUser?.role === 'Supervisor') {
      setShowDiscountPanel(!showDiscountPanel);
    } else {
      setAdminPinConfig({
        title: 'Otorisasi Diskon Manual (Admin)',
        requireReason: true,
        onSuccess: () => {
          setShowDiscountPanel(true);
        }
      });
      setShowAdminPinModal(true);
    }
  };

  const handleApplyDiscount = () => {
    if (calculatedDiscount > 0) {
      setDiscount(calculatedDiscount);
      setShowDiscountPanel(false);
      setDiscountInputVal('');
      showToast(`Diskon Rp ${calculatedDiscount.toLocaleString('id-ID')} berhasil diterapkan`);
    }
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
                Total Tagihan (Setelah Diskon)
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#60a5fa' }}>
              {formatRupiah(total)}
            </div>
          </div>

          {/* Breakdown & Diskon button */}
          <div style={{ padding: '10px 14px', backgroundColor: '#0e1624', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div className="summary-row" style={{ fontSize: '12px' }}>
              <span>Harga Awal (Subtotal)</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row" style={{ fontSize: '12px', color: '#ef4444' }}>
                <span>Diskon Diterapkan</span>
                <span>-{formatRupiah(discount)}</span>
              </div>
            )}
            <div className="summary-row" style={{ fontSize: '12px' }}>
              <span>PB1 (10%)</span>
              <span>{formatRupiah(taxPb1)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              {discount > 0 && (
                <button
                  type="button"
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    color: '#f87171',
                    background: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px'
                  }}
                  onClick={() => {
                    setDiscount(0);
                    showToast('Diskon telah dihapus');
                  }}
                >
                  Hapus Diskon
                </button>
              )}
              <button
                type="button"
                className="tambah-bahan-btn"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={handleOpenDiscountPanel}
              >
                <Tag size={12} />
                <span>{discount > 0 ? 'Ubah Diskon' : '+ Diskon / Nego Harga'}</span>
              </button>
            </div>

            {/* Panel Input Diskon / Nego Harga */}
            {showDiscountPanel && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#111726',
                  border: '1.5px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '10px',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                    Atur Diskon / Harga Khusus
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Harga Awal: <strong style={{ color: '#ffffff' }}>{formatRupiah(subtotal)}</strong>
                  </span>
                </div>

                {/* Mode Tabs */}
                <div style={{ display: 'flex', gap: '6px', background: '#0b0f19', padding: '3px', borderRadius: '8px' }}>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      fontSize: '11px',
                      fontWeight: discountMode === 'target_price' ? 700 : 500,
                      color: discountMode === 'target_price' ? '#ffffff' : '#94a3b8',
                      backgroundColor: discountMode === 'target_price' ? 'var(--accent-blue, #10b981)' : 'transparent',
                      borderRadius: '6px'
                    }}
                    onClick={() => { setDiscountMode('target_price'); setDiscountInputVal(''); }}
                  >
                    Target Harga Baru
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      fontSize: '11px',
                      fontWeight: discountMode === 'nominal' ? 700 : 500,
                      color: discountMode === 'nominal' ? '#ffffff' : '#94a3b8',
                      backgroundColor: discountMode === 'nominal' ? 'var(--accent-blue, #10b981)' : 'transparent',
                      borderRadius: '6px'
                    }}
                    onClick={() => { setDiscountMode('nominal'); setDiscountInputVal(''); }}
                  >
                    Potongan (Rp)
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      fontSize: '11px',
                      fontWeight: discountMode === 'percent' ? 700 : 500,
                      color: discountMode === 'percent' ? '#ffffff' : '#94a3b8',
                      backgroundColor: discountMode === 'percent' ? 'var(--accent-blue, #10b981)' : 'transparent',
                      borderRadius: '6px'
                    }}
                    onClick={() => { setDiscountMode('percent'); setDiscountInputVal(''); }}
                  >
                    Persen (%)
                  </button>
                </div>

                {/* Input field */}
                <div>
                  <label style={{ fontSize: '11.5px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    {discountMode === 'target_price' && 'Ketik Harga Baru yang Harus Dibayar (Rp):'}
                    {discountMode === 'nominal' && 'Ketik Nominal Potongan Diskon (Rp):'}
                    {discountMode === 'percent' && 'Ketik Persentase Diskon (%):'}
                  </label>
                  <input
                    type="number"
                    className="kasir-search-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '14px', fontWeight: 600 }}
                    placeholder={
                      discountMode === 'target_price' ? `Contoh: ${Math.round(subtotal * 0.8)}` :
                      discountMode === 'nominal' ? 'Contoh: 10000' : 'Contoh: 10'
                    }
                    value={discountInputVal}
                    onChange={(e) => setDiscountInputVal(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Quick % buttons */}
                {discountMode === 'percent' && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[5, 10, 15, 20, 25, 50].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className="preset-pill"
                        style={{ fontSize: '11px', padding: '3px 8px' }}
                        onClick={() => setDiscountInputVal(String(p))}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                )}

                {/* Live Preview */}
                {calculatedDiscount > 0 && (
                  <div
                    style={{
                      padding: '8px 10px',
                      backgroundColor: '#0a101d',
                      borderRadius: '6px',
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ color: '#94a3b8' }}>
                      Potongan: <strong style={{ color: '#f87171' }}>-{formatRupiah(calculatedDiscount)}</strong>
                    </span>
                    <span style={{ color: '#94a3b8' }}>
                      Harga Baru: <strong style={{ color: '#60a5fa' }}>{formatRupiah(Math.max(0, subtotal - calculatedDiscount))}</strong>
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    style={{ padding: '6px 12px', fontSize: '12px', color: '#94a3b8', background: 'transparent' }}
                    onClick={() => {
                      setShowDiscountPanel(false);
                      setDiscountInputVal('');
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="buat-laporan-btn"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                    disabled={calculatedDiscount <= 0}
                    onClick={handleApplyDiscount}
                  >
                    Terapkan Diskon
                  </button>
                </div>
              </div>
            )}
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
              <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>
                QRIS NAMA TOKO ANDA
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px' }}>
                NMID: ID1234567890123
              </div>

              {/* Tampilkan gambar QRIS Anda */}
              <img
                src="/QRIS.jpeg"
                alt="QRIS Pembayaran"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />

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
