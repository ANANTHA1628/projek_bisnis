import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_CART,
  INITIAL_OPEN_BILLS,
  INITIAL_TRANSACTIONS,
  INITIAL_MODIFIERS,
  INITIAL_SETTINGS,
  INITIAL_SHIFT,
  INITIAL_EXPENSES,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_STAFF,
  INITIAL_CUSTOMERS
} from '../data/initialData';
import confetti from 'canvas-confetti';

const PosContext = createContext();

export function PosProvider({ children }) {
  // Navigation & UI Settings
  const [activeTab, setActiveTab] = useState('kasir'); // 'kasir' | 'dasbor' | 'stok' | 'laporan'
  const [stokSubTab, setStokSubTab] = useState('bahan'); // 'bahan' | 'resep' | 'simulator' | 'restock' | 'opname' | 'ledger'
  const [laporanSubTab, setLaporanSubTab] = useState('pendapatan'); // 'pendapatan' | 'item' | 'labarugi' | 'ledger' | 'shift' | 'topmargin' | 'biaya'
  const [language, setLanguage] = useState('ID');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [printerSize, setPrinterSize] = useState('58mm'); // '58mm' | '80mm' (D6)

  // Master Data & Configuration
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [rawMaterials, setRawMaterials] = useState(INITIAL_RAW_MATERIALS);
  const [modifiers] = useState(INITIAL_MODIFIERS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [stockMovements, setStockMovements] = useState(INITIAL_STOCK_MOVEMENTS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [customerList, setCustomerList] = useState(INITIAL_CUSTOMERS);

  // Staf & Customer CRUD Handlers
  const addStaff = (newStaff) => {
    const staffWithId = {
      ...newStaff,
      id: 'staff-' + Date.now(),
      joinedDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setStaffList((prev) => [staffWithId, ...prev]);
    showToast(`Staf ${newStaff.name} berhasil ditambahkan!`);
  };

  const updateStaff = (id, updatedData) => {
    setStaffList((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)));
    showToast('Data staf berhasil diperbarui');
  };

  const deleteStaff = (id) => {
    const target = staffList.find((s) => s.id === id);
    if (target?.role === 'Owner') {
      showToast('Akun Owner utama tidak dapat dihapus', 'warning');
      return;
    }
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    showToast('Staf berhasil dihapus');
  };

  const addCustomer = (newCustomer) => {
    const custWithId = {
      ...newCustomer,
      id: 'cust-' + Date.now(),
      totalVisits: 1,
      totalSpent: 0,
      points: 10,
      lastVisit: 'Baru saja'
    };
    setCustomerList((prev) => [custWithId, ...prev]);
    showToast(`Pelanggan ${newCustomer.name} berhasil didaftarkan!`);
  };

  const updateCustomer = (id, updatedData) => {
    setCustomerList((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c)));
    showToast('Data pelanggan berhasil disimpan');
  };

  const deleteCustomer = (id) => {
    setCustomerList((prev) => prev.filter((c) => c.id !== id));
    showToast('Data pelanggan telah dihapus');
  };

  // POS State
  const [orderType, setOrderType] = useState('Makan di sini'); // 'Makan di sini' | 'Bawa pulang' | 'GoFood' | 'GrabFood'
  const [selectedTable, setSelectedTable] = useState('Meja 04');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('tunai');
  const [menuSearch, setMenuSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [cart, setCart] = useState(INITIAL_CART);
  const [discount, setDiscount] = useState(0); // Diskon manual (rupiah)

  // Sesi Kasir / Shift (PRD 5.2)
  const [currentShift, setCurrentShift] = useState(INITIAL_SHIFT);

  // Inventory filter state
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialFilter, setMaterialFilter] = useState('all'); // 'all' | 'low' | 'out'

  // Transactions & Bills
  const [openBills, setOpenBills] = useState(INITIAL_OPEN_BILLS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Modals state
  const [customizingItem, setCustomizingItem] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [showOpenBillsModal, setShowOpenBillsModal] = useState(false);
  const [showCloseCashierModal, setShowCloseCashierModal] = useState(false);
  const [showOpenShiftModal, setShowOpenShiftModal] = useState(false);
  const [materialModalData, setMaterialModalData] = useState(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showOpnameModal, setShowOpnameModal] = useState(false);
  const [showWasteModal, setShowWasteModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPinConfig, setAdminPinConfig] = useState(null); // { title, onSuccess }
  const [toast, setToast] = useState(null);

  // Trigger Toast Notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
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

  // Channel Price Resolver: sesuaikan harga produk berdasarkan kanal terpilih (POS-01 & 4.2)
  const getProductPrice = (product, channel = orderType) => {
    if (product.channelPrices && product.channelPrices[channel]) {
      return product.channelPrices[channel];
    }
    return product.price;
  };

  // Hitung HPP menu otomatis dari takaran bahan & biaya kemasan (INV-03)
  const calculateMenuHpp = (product) => {
    let ingredientsCost = 0;
    if (product.recipe) {
      product.recipe.forEach((r) => {
        const mat = rawMaterials.find((m) => m.id === r.materialId);
        if (mat) {
          ingredientsCost += Math.round(r.amount * mat.avgPrice);
        }
      });
    }
    return ingredientsCost + (product.packagingCost || 0);
  };

  // Update harga item di keranjang saat tipe pesanan (kanal) berubah
  useEffect(() => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        const prod = products.find((p) => p.id === item.productId);
        if (!prod) return item;
        const newBasePrice = getProductPrice(prod, orderType);
        const modPrice = (item.modifiers || []).reduce((acc, m) => acc + (m.priceDelta || 0), 0);
        return {
          ...item,
          price: newBasePrice + modPrice
        };
      })
    );
  }, [orderType]);

  // Financial Calculations for Cart (Aturan Bisnis 4.1: Integer Rupiah, PB1 10%)
  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const subtotalAfterDiscount = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  const taxPb1 = useMemo(() => {
    // PB1 10% dihitung dari subtotal setelah diskon
    return Math.round(subtotalAfterDiscount * 0.10);
  }, [subtotalAfterDiscount]);

  const total = useMemo(() => {
    return subtotalAfterDiscount + taxPb1;
  }, [subtotalAfterDiscount, taxPb1]);

  // Total stock inventory value real-time (INV-06)
  const totalStockValue = useMemo(() => {
    return rawMaterials.reduce((acc, item) => acc + Math.max(0, item.stock) * item.avgPrice, 0);
  }, [rawMaterials]);

  // Cart Management
  const addToCart = (product) => {
    const basePrice = getProductPrice(product, orderType);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && (!item.modifiers || item.modifiers.length === 0)
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
            price: basePrice,
            quantity: 1,
            notes: 'Normal ice, Normal sugar',
            sugar: '100%',
            ice: 'Normal',
            modifiers: []
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
      prevCart.map((item) => {
        if (item.productId === productId) {
          const prod = products.find((p) => p.id === productId);
          const basePrice = prod ? getProductPrice(prod, orderType) : item.price;
          const modPrice = (customizations.modifiers || []).reduce((acc, m) => acc + (m.priceDelta || 0), 0);
          return {
            ...item,
            ...customizations,
            price: basePrice + modPrice
          };
        }
        return item;
      })
    );
    showToast('Preferensi & modifier menu diperbarui');
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
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

  // Sesi Kasir / Shift (PRD 5.2)
  const openShift = (openingCash, notes = 'Buka Shift') => {
    const newShift = {
      isOpen: true,
      openedAt: new Date().toLocaleString('id-ID'),
      cashierName: 'Rina (Owner)',
      openingCash: Number(openingCash),
      expectedCash: Number(openingCash),
      actualCash: null,
      difference: 0,
      notes
    };
    setCurrentShift(newShift);
    setShowOpenShiftModal(false);
    showToast(`Sesi kasir berhasil dibuka dengan modal Rp ${Number(openingCash).toLocaleString('id-ID')}`);
  };

  const closeShift = (actualCash, notes = '') => {
    // Validasi pembatas PRD 5.2: Tagihan terbuka harus 0
    if (openBills.length > 0) {
      showToast(`Peringatan: Terdapat ${openBills.length} tagihan terbuka yang belum diselesaikan!`, 'warning');
      return false;
    }

    const physical = Number(actualCash);
    const expected = currentShift.expectedCash;
    const diff = physical - expected;

    setCurrentShift((prev) => ({
      ...prev,
      isOpen: false,
      closedAt: new Date().toLocaleString('id-ID'),
      actualCash: physical,
      difference: diff,
      notes
    }));

    setShowCloseCashierModal(false);
    showToast(`Sesi kasir ditutup. ${diff === 0 ? 'Kas seimbang!' : 'Terdapat selisih kas: Rp ' + diff.toLocaleString('id-ID')}`);
    return true;
  };

  // Checkout and Stock deduction (INV-04 & PRD 4.4)
  const completePayment = (paidAmount = total, paymentNotes = '') => {
    if (cart.length === 0) return;

    // Komisi ojol jika GoFood / GrabFood
    const isOjol = orderType === 'GoFood' || orderType === 'GrabFood';
    const commPercent = isOjol ? settings.ojol_commission_percent : 0;
    const commAmount = isOjol ? Math.round(subtotalAfterDiscount * (commPercent / 100)) : 0;

    // Deduct stock for each item based on its recipe and modifiers
    setRawMaterials((prevMaterials) => {
      const updatedMaterials = [...prevMaterials];
      const newMovements = [];

      cart.forEach((cartItem) => {
        const product = products.find((p) => p.id === cartItem.productId);
        if (product && product.recipe) {
          product.recipe.forEach((recipeItem) => {
            const matIndex = updatedMaterials.findIndex((m) => m.id === recipeItem.materialId);
            if (matIndex > -1) {
              const currentStock = updatedMaterials[matIndex].stock;
              const deductAmount = recipeItem.amount * cartItem.quantity;
              updatedMaterials[matIndex] = {
                ...updatedMaterials[matIndex],
                stock: currentStock - deductAmount // Boleh negatif sesuai PRD 4.4
              };

              newMovements.push({
                id: Date.now() + Math.random(),
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                materialName: updatedMaterials[matIndex].name,
                type: 'sale',
                qty: -deductAmount,
                unitCost: updatedMaterials[matIndex].avgPrice,
                note: `Order ${cartItem.name} x${cartItem.quantity}`
              });
            }
          });
        }
      });

      if (newMovements.length > 0) {
        setStockMovements((prev) => [...newMovements, ...prev]);
      }

      return updatedMaterials;
    });

    // Hitung total HPP transaksi
    const transactionHpp = cart.reduce((acc, item) => {
      const prod = products.find((p) => p.id === item.productId);
      const baseCost = prod ? calculateMenuHpp(prod) : 0;
      const modCost = (item.modifiers || []).reduce((mAcc, m) => mAcc + (m.costDelta || 0), 0);
      return acc + (baseCost + modCost) * item.quantity;
    }, 0);

    const newTransaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      orderType: orderType,
      table: selectedTable || 'Takeaway',
      customer: customerPhone || 'Tamu Kasir',
      method: paymentMethod.toUpperCase(),
      status: 'paid',
      items: [...cart],
      subtotal,
      discount,
      tax: taxPb1,
      total,
      paidAmount,
      change: paidAmount - total,
      cost: transactionHpp,
      commissionPercent: commPercent,
      commissionAmount: commAmount
    };

    // Update expected cash shift jika bayar tunai
    if (paymentMethod === 'tunai') {
      setCurrentShift((prev) => ({
        ...prev,
        expectedCash: prev.expectedCash + total
      }));
    }

    setTransactions((prev) => [newTransaction, ...prev]);
    setLastReceipt(newTransaction);
    clearCart();
    setShowPaymentModal(false);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Void Transaction (POS-10 & PRD 4.4)
  const voidTransaction = (transactionId, adminPin, reason, isWaste = false) => {
    if (adminPin !== settings.admin_pin) {
      showToast('PIN Admin salah!', 'warning');
      return false;
    }

    const trx = transactions.find((t) => t.id === transactionId);
    if (!trx) return false;

    // Jika bukan waste, kembalikan stok ke raw materials
    if (!isWaste) {
      setRawMaterials((prevMaterials) => {
        const updated = [...prevMaterials];
        const returnMovements = [];

        trx.items.forEach((cartItem) => {
          const product = products.find((p) => p.id === cartItem.productId);
          if (product && product.recipe) {
            product.recipe.forEach((recipeItem) => {
              const matIndex = updated.findIndex((m) => m.id === recipeItem.materialId);
              if (matIndex > -1) {
                const qtyToReturn = recipeItem.amount * cartItem.quantity;
                updated[matIndex] = {
                  ...updated[matIndex],
                  stock: updated[matIndex].stock + qtyToReturn
                };

                returnMovements.push({
                  id: Date.now() + Math.random(),
                  time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                  materialName: updated[matIndex].name,
                  type: 'void_return',
                  qty: qtyToReturn,
                  unitCost: updated[matIndex].avgPrice,
                  note: `Void Order #${trx.id}: ${reason}`
                });
              }
            });
          }
        });

        if (returnMovements.length > 0) {
          setStockMovements((prev) => [...returnMovements, ...prev]);
        }
        return updated;
      });
    } else {
      // Ditandai sebagai waste
      setStockMovements((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          materialName: 'Semua Bahan Menu',
          type: 'waste',
          qty: 0,
          unitCost: trx.cost,
          note: `Void Waste Order #${trx.id} (sudah dibuat lalu dibuang): ${reason}`
        },
        ...prev
      ]);
    }

    // Update status transaksi menjadi void
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'void', voidReason: reason } : t))
    );

    showToast(`Transaksi #${trx.id} berhasil di-void`);
    return true;
  };

  // Raw Materials CRUD (INV-01)
  const saveRawMaterial = (materialData) => {
    if (materialData.id) {
      setRawMaterials((prev) =>
        prev.map((m) => (m.id === materialData.id ? { ...m, ...materialData } : m))
      );
      showToast(`Bahan "${materialData.name}" berhasil diperbarui`);
    } else {
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

  // Restock dengan Moving Average Formula (INV-07 & PRD 4.3)
  const restockRawMaterial = (id, amount, unitPrice, invoiceNo = '') => {
    setRawMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const incomingQty = Number(amount);
          const incomingPrice = Number(unitPrice || m.avgPrice);
          const currentStock = Math.max(0, m.stock);
          const currentCost = m.avgPrice;

          // Formula Moving Average
          const newAvgPrice =
            currentStock + incomingQty > 0
              ? Math.round((currentStock * currentCost + incomingQty * incomingPrice) / (currentStock + incomingQty))
              : incomingPrice;

          // Record movement
          setStockMovements((sPrev) => [
            {
              id: Date.now(),
              time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              materialName: m.name,
              type: 'restock',
              qty: incomingQty,
              unitCost: incomingPrice,
              note: `Restock faktur #${invoiceNo || 'INV-' + Date.now().toString().slice(-4)}`
            },
            ...sPrev
          ]);

          return {
            ...m,
            stock: m.stock + incomingQty,
            avgPrice: newAvgPrice
          };
        }
        return m;
      })
    );
    showToast(`Stok berhasil ditambah dan harga rata-rata diperbarui!`);
  };

  // Stok Opname (INV-08)
  const recordOpname = (id, physicalQty, reason) => {
    setRawMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const diff = Number(physicalQty) - m.stock;
          setStockMovements((sPrev) => [
            {
              id: Date.now(),
              time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              materialName: m.name,
              type: 'opname',
              qty: diff,
              unitCost: m.avgPrice,
              note: `Opname: Fisik ${physicalQty} ${m.unit} (Selisih: ${diff > 0 ? '+' : ''}${diff}). Alasan: ${reason}`
            },
            ...sPrev
          ]);
          return { ...m, stock: Number(physicalQty) };
        }
        return m;
      })
    );
    showToast('Stok opname berhasil dicatat');
  };

  // Catat Buang / Waste (INV-08)
  const recordWaste = (id, qty, reason) => {
    setRawMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const deduct = Number(qty);
          setStockMovements((sPrev) => [
            {
              id: Date.now(),
              time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              materialName: m.name,
              type: 'waste',
              qty: -deduct,
              unitCost: m.avgPrice,
              note: `Barang Rusak / Waste: ${reason}`
            },
            ...sPrev
          ]);
          return { ...m, stock: m.stock - deduct };
        }
        return m;
      })
    );
    showToast('Barang buang (waste) berhasil dicatat');
  };

  // Biaya Operasional (Expenses)
  const addExpense = (newExp) => {
    setExpenses((prev) => [{ ...newExp, id: Date.now() }, ...prev]);
    showToast('Biaya operasional berhasil dicatat');
  };

  const value = {
    activeTab,
    setActiveTab,
    stokSubTab,
    setStokSubTab,
    laporanSubTab,
    setLaporanSubTab,
    language,
    setLanguage,
    isFullscreen,
    toggleFullscreen,
    printerSize,
    setPrinterSize,
    settings,
    setSettings,
    products,
    rawMaterials,
    modifiers,
    expenses,
    addExpense,
    stockMovements,
    cart,
    cartItemCount,
    addToCart,
    updateQuantity,
    updateItemCustomization,
    clearCart,
    orderType,
    setOrderType,
    getProductPrice,
    calculateMenuHpp,
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
    setDiscount,
    subtotalAfterDiscount,
    taxPb1,
    total,
    currentShift,
    openShift,
    closeShift,
    materialSearch,
    setMaterialSearch,
    materialFilter,
    setMaterialFilter,
    totalStockValue,
    saveRawMaterial,
    deleteRawMaterial,
    restockRawMaterial,
    recordOpname,
    recordWaste,
    openBills,
    saveAsOpenBill,
    recallOpenBill,
    transactions,
    completePayment,
    voidTransaction,
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
    showOpenShiftModal,
    setShowOpenShiftModal,
    materialModalData,
    setMaterialModalData,
    showRestockModal,
    setShowRestockModal,
    showOpnameModal,
    setShowOpnameModal,
    showWasteModal,
    setShowWasteModal,
    showWhatsAppModal,
    setShowWhatsAppModal,
    showAdminPinModal,
    setShowAdminPinModal,
    adminPinConfig,
    setAdminPinConfig,
    staffList,
    setStaffList,
    addStaff,
    updateStaff,
    deleteStaff,
    customerList,
    setCustomerList,
    addCustomer,
    updateCustomer,
    deleteCustomer,
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
