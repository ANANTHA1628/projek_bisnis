import React from 'react';
import { usePos } from '../context/PosContext';
import ProductIcon from '../components/ProductIcon';
import {
  Search,
  Receipt,
  Wallet,
  Printer,
  Maximize2,
  SlidersHorizontal,
  Plus,
  Minus,
  ShoppingCart,
  Banknote,
  QrCode,
  CreditCard,
  Clock,
  Tag,
  AlertCircle
} from 'lucide-react';

export default function KasirView() {
  const {
    products,
    cart,
    cartItemCount,
    addToCart,
    updateQuantity,
    orderType,
    setOrderType,
    getProductPrice,
    selectedTable,
    setSelectedTable,
    customerPhone,
    setCustomerPhone,
    paymentMethod,
    setPaymentMethod,
    menuSearch,
    setMenuSearch,
    activeCategory,
    setActiveCategory,
    subtotal,
    discount,
    subtotalAfterDiscount,
    taxPb1,
    total,
    currentShift,
    setShowOpenShiftModal,
    setShowCloseCashierModal,
    setCustomizingItem,
    setShowPaymentModal,
    setShowOpenBillsModal,
    openBills,
    toggleFullscreen,
    showToast
  } = usePos();

  const categories = ['Semua', 'Makanan', 'Non-Kopi', 'Kopi'];

  // Filter products by category and search term
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      activeCategory === 'Semua' || item.category === activeCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(menuSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Helper to find quantity in cart for badges
  const getItemQtyInCart = (productId) => {
    const found = cart.find((item) => item.productId === productId);
    return found ? found.quantity : 0;
  };

  const formatRupiah = (num) => {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  };

  const isOjolChannel = orderType === 'GoFood' || orderType === 'GrabFood';

  return (
    <div className="kasir-container">
      {/* Left Menu Section */}
      <div className="kasir-left-section">
        {/* Kasir Header */}
        <div className="kasir-header-row">
          <div className="posa-brand">posa</div>

          <div className="kasir-header-actions">
            <button
              className="kasir-action-pill-btn"
              onClick={() => setShowOpenBillsModal(true)}
              title="Lihat Tagihan Terbuka"
            >
              <Receipt size={16} />
              <span>Tagihan terbuka</span>
              {openBills.length > 0 && (
                <span
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '1px 6px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {openBills.length}
                </span>
              )}
            </button>

            <button
              className="tool-icon-btn"
              onClick={() => showToast('Laci kasir dibuka (Cash Drawer)')}
              title="Buka Laci Kas"
            >
              <Wallet size={16} />
            </button>

            <button
              className="tool-icon-btn"
              onClick={() => showToast('Printer Thermal Siap (Format 58/80mm)')}
              title="Status Printer Thermal"
            >
              <Printer size={16} />
            </button>

            <button
              className="tool-icon-btn"
              onClick={toggleFullscreen}
              title="Layar Penuh"
            >
              <Maximize2 size={16} />
            </button>

            <div className="user-profile-badge">
              <span className="user-profile-name">Rina</span>
              <span className="user-profile-role">Owner</span>
            </div>

            {currentShift.isOpen ? (
              <button
                className="tutup-kasir-btn"
                onClick={() => setShowCloseCashierModal(true)}
              >
                Tutup kasir
              </button>
            ) : (
              <button
                className="buat-laporan-btn"
                style={{ padding: '7px 14px', fontSize: '12px' }}
                onClick={() => setShowOpenShiftModal(true)}
              >
                Buka Kasir
              </button>
            )}
          </div>
        </div>

        {/* Shift banner alert if shift is not opened */}
        {!currentShift.isOpen && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12.5px',
              color: '#f87171'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>Sesi kasir saat ini sedang <strong>Tutup</strong>. Buka sesi untuk mencatat uang modal awal.</span>
            </div>
            <button
              className="buat-laporan-btn"
              style={{ padding: '4px 10px', fontSize: '11.5px' }}
              onClick={() => setShowOpenShiftModal(true)}
            >
              Buka Shift
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="kasir-search-bar">
          <Search size={17} className="kasir-search-icon" />
          <input
            type="text"
            className="kasir-search-input"
            placeholder="Cari menu..."
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
          />
        </div>

        {/* Categories Pills */}
        <div className="kasir-categories-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Channel Pricing Notice Banner */}
        {isOjolChannel && (
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: '6px',
              fontSize: '11.5px',
              color: '#60a5fa',
              marginBottom: '10px'
            }}
          >
            Kanal {orderType} aktif: Menampilkan harga kanal khusus ojol (komisi platform 20% otomatis).
          </div>
        )}

        {/* Menu Cards Grid */}
        <div className="menu-grid">
          {filteredProducts.map((product) => {
            const qtyInCart = getItemQtyInCart(product.id);
            const currentPrice = getProductPrice(product, orderType);

            return (
              <div
                key={product.id}
                className="product-card"
                onClick={() => addToCart(product)}
              >
                {qtyInCart > 0 && (
                  <div className="product-badge-qty">{qtyInCart}</div>
                )}

                <div className="product-icon-container">
                  <ProductIcon type={product.icon} />
                </div>

                <div className="product-name">{product.name}</div>
                <div className="product-category">{product.category}</div>
                <div className="product-price">{formatRupiah(currentPrice)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Cart Sidebar (Pesanan Saat Ini) */}
      <aside className="kasir-cart-panel">
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingCart size={18} />
            <span>Pesanan Saat Ini</span>
          </div>
          <span className="cart-item-count-badge">{cartItemCount} item</span>
        </div>

        {/* Order Type Tabs (Kanal Penjualan POS-01 & 4.2) */}
        <div className="order-type-tabs">
          {['Makan di sini', 'Bawa pulang', 'GoFood', 'GrabFood'].map((type) => (
            <button
              key={type}
              className={`order-type-btn ${orderType === type ? 'active' : ''}`}
              onClick={() => setOrderType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="cart-items-scroll-area">
          {cart.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 10px',
                color: 'var(--text-muted)',
                fontSize: '13px'
              }}
            >
              Keranjang masih kosong. Pilih menu di sebelah kiri untuk menambahkan.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="cart-item-card">
                <div className="cart-item-top-row">
                  <div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">
                      {formatRupiah(item.price * item.quantity)}
                    </div>
                  </div>

                  <button
                    className="cart-item-customize-btn"
                    onClick={() => setCustomizingItem(item)}
                  >
                    <SlidersHorizontal size={13} />
                    <span>Sesuaikan</span>
                  </button>
                </div>

                <div className="cart-item-controls-row">
                  <span className="cart-item-notes" title={item.notes}>
                    {item.notes || 'Normal'}
                  </span>

                  <div className="qty-counter-group">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.productId, -1)}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="qty-number">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.productId, 1)}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        <div className="cart-footer">
          <div className="cart-detail-heading">Detail Pesanan</div>

          <div className="cart-inputs-grid">
            <div style={{ position: 'relative' }}>
              <select
                className="cart-select-field"
                style={{ width: '100%' }}
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
              >
                <option value="">Pilih Meja</option>
                <option value="Meja 01">Meja 01</option>
                <option value="Meja 02">Meja 02</option>
                <option value="Meja 03">Meja 03</option>
                <option value="Meja 04">Meja 04</option>
                <option value="VIP 1">VIP 1</option>
                <option value="Outdoor 01">Outdoor 01</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                className="cart-input-field"
                style={{ width: '100%' }}
                placeholder="No. HP"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Subtotal, Diskon, PB1, Total */}
          <div className="cart-summary-breakdown">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row" style={{ color: '#ef4444' }}>
                <span>Diskon</span>
                <span>-{formatRupiah(discount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>PB1 (10%)</span>
              <span>{formatRupiah(taxPb1)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span className="total-amount">{formatRupiah(total)}</span>
            </div>
          </div>

          {/* Payment Methods */}
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

          {/* Main Action Button */}
          <button
            className="bayar-action-btn"
            disabled={cart.length === 0}
            style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
            onClick={() => setShowPaymentModal(true)}
          >
            Bayar {paymentMethod === 'tunai' ? 'tunai' : paymentMethod.toUpperCase()}{' '}
            {formatRupiah(total)}
          </button>
        </div>
      </aside>
    </div>
  );
}
