import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_CART,
  INITIAL_OPEN_BILLS,
  INITIAL_TRANSACTIONS
} from '../data/initialData';
import confetti from 'canvas-confetti';

const PosContext = createContext();

export function PosProvider({ children }) {
  // Navigation & UI Settings
  const [activeTab, setActiveTab] = useState('kasir'); // 'kasir' | 'dasbor' | 'stok' | 'laporan'
  const [language, setLanguage] = useState('ID'); // 'ID' | 'EN'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // POS State
  const [products] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState(INITIAL_CART);
  const [orderType, setOrderType] = useState('Makan di sini');
  const [selectedTable, setSelectedTable] = useState('Meja 04');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('tunai');
  const [menuSearch, setMenuSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Inventory / Stok State
  const [rawMaterials, setRawMaterials] = useState(INITIAL_RAW_MATERIALS);
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialFilter, setMaterialFilter] = useState('all'); // 'all' | 'low'

  // Transactions & Bills
  const [openBills, setOpenBills] = useState(INITIAL_OPEN_BILLS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Modals state
  const [customizingItem, setCustomizingItem] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [showOpenBillsModal, setShowOpenBillsModal] = useState(false);
  const [showCloseCashierModal, setShowCloseCashierModal] = useState(false);
  const [materialModalData, setMaterialModalData] = useState(null); // null = closed, {} = add, obj = edit
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Trigger Toast Notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Fullscreen toggle helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Financial Calculations for Cart
  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const taxPb1 = useMemo(() => {
    return Math.round(subtotal * 0.10); // 10% PB1
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + taxPb1;
  }, [subtotal, taxPb1]);

  // Total stock inventory value
  const totalStockValue = useMemo(() => {
    return rawMaterials.reduce((acc, item) => acc + item.stock * item.avgPrice, 0);
  }, [rawMaterials]);

  // Cart Management
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1
        };
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            notes: 'Normal ice, Normal sugar',
            sugar: '100%',
            ice: 'Normal'
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const updateItemCustomization = (productId, customizations) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, ...customizations } : item
      )
    );
    showToast('Preferensi pesanan diperbarui');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Open Bills Management (Tagihan Terbuka)
  const saveAsOpenBill = () => {
    if (cart.length === 0) {
      showToast('Keranjang masih kosong', 'warning');
      return;
    }
    const newBill = {
      id: `BILL-${Date.now().toString().slice(-4)}`,
      table: selectedTable || 'Meja Bar',
      customer: customerPhone ? `Pelanggan (${customerPhone})` : 'Tamu Kafe',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      total: total
    };
    setOpenBills((prev) => [newBill, ...prev]);
    clearCart();
    showToast(`Tagihan disimpan untuk ${newBill.table}`);
  };

  const recallOpenBill = (billId) => {
    const bill = openBills.find((b) => b.id === billId);
    if (!bill) return;

    setCart(bill.items);
    setSelectedTable(bill.table);
    setOpenBills((prev) => prev.filter((b) => b.id !== billId));
    setShowOpenBillsModal(false);
    showToast(`Tagihan ${bill.table} dimuat ke kasir`);
  };

  // Checkout and Stock deduction
  const completePayment = (paidAmount = total, paymentNotes = '') => {
    if (cart.length === 0) return;

    // Deduct stock for each item based on its recipe
    setRawMaterials((prevMaterials) => {
      const updatedMaterials = [...prevMaterials];
      cart.forEach((cartItem) => {
        const product = products.find((p) => p.id === cartItem.productId);
        if (product && product.recipe) {
          product.recipe.forEach((recipeItem) => {
            const matIndex = updatedMaterials.findIndex(
              (m) => m.id === recipeItem.materialId
            );
            if (matIndex > -1) {
              const currentStock = updatedMaterials[matIndex].stock;
              const deductAmount = recipeItem.amount * cartItem.quantity;
              updatedMaterials[matIndex] = {
                ...updatedMaterials[matIndex],
                stock: Math.max(0, currentStock - deductAmount)
              };
            }
          });
        }
      });
      return updatedMaterials;
    });

    const newTransaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      orderType: orderType,
      table: selectedTable || 'Takeaway',
      customer: customerPhone || 'Tamu Kasir',
      method: paymentMethod.toUpperCase(),
      items: [...cart],
      subtotal,
      tax: taxPb1,
      total,
      paidAmount,
      change: paidAmount - total,
      cost: cart.reduce((acc, item) => {
        const prod = products.find((p) => p.id === item.productId);
        return acc + (prod ? prod.cost * item.quantity : 0);
      }, 0)
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setLastReceipt(newTransaction);
    clearCart();
    setShowPaymentModal(false);

    // Confetti effect on success
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Raw Materials CRUD
  const saveRawMaterial = (materialData) => {
    if (materialData.id) {
      // Edit
      setRawMaterials((prev) =>
        prev.map((m) => (m.id === materialData.id ? { ...m, ...materialData } : m))
      );
      showToast(`Bahan "${materialData.name}" berhasil diperbarui`);
    } else {
      // Add new
      const newId = materialData.name.toLowerCase().replace(/\s+/g, '-');
      const newMaterial = {
        ...materialData,
        id: newId,
        dailyUsage: 5.0
      };
      setRawMaterials((prev) => [...prev, newMaterial]);
      showToast(`Bahan "${materialData.name}" berhasil ditambahkan`);
    }
    setMaterialModalData(null);
  };

  const deleteRawMaterial = (id) => {
    const item = rawMaterials.find((m) => m.id === id);
    if (!item) return;
    if (window.confirm(`Yakin ingin menghapus bahan "${item.name}"?`)) {
      setRawMaterials((prev) => prev.filter((m) => m.id !== id));
      showToast(`Bahan "${item.name}" telah dihapus`);
    }
  };

  const restockRawMaterial = (id, amount) => {
    setRawMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return { ...m, stock: m.stock + Number(amount) };
        }
        return m;
      })
    );
    showToast(`Stok berhasil ditambah!`);
  };

  const value = {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    isFullscreen,
    toggleFullscreen,
    products,
    cart,
    cartItemCount,
    addToCart,
    updateQuantity,
    updateItemCustomization,
    clearCart,
    orderType,
    setOrderType,
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
    taxPb1,
    total,
    rawMaterials,
    materialSearch,
    setMaterialSearch,
    materialFilter,
    setMaterialFilter,
    totalStockValue,
    saveRawMaterial,
    deleteRawMaterial,
    restockRawMaterial,
    openBills,
    saveAsOpenBill,
    recallOpenBill,
    transactions,
    completePayment,
    customizingItem,
    setCustomizingItem,
    showPaymentModal,
    setShowPaymentModal,
    lastReceipt,
    setLastReceipt,
    showOpenBillsModal,
    setShowOpenBillsModal,
    showCloseCashierModal,
    setShowCloseCashierModal,
    materialModalData,
    setMaterialModalData,
    showRestockModal,
    setShowRestockModal,
    showWhatsAppModal,
    setShowWhatsAppModal,
    toast,
    showToast
  };

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}

export function usePos() {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePos must be used within a PosProvider');
  }
  return context;
}
