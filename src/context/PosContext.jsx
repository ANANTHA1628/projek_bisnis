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
  INITIAL_STAFF_ACTIVITY,
  INITIAL_CUSTOMERS
} from '../data/initialData';
import confetti from 'canvas-confetti';

const PosContext = createContext();

export function PosProvider({ children }) {
  // Navigation & UI Settings - Default ke Layar Login PIN Kiosk saat web dibuka
  const [activeTab, setActiveTab] = useState('kasir'); // 'admin' | 'kasir'
  const [adminView, setAdminView] = useState('raw-materials'); // Matches example screenshots
  const [isKioskMode, setIsKioskMode] = useState(true);
  const [isKioskLocked, setIsKioskLocked] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // Terkunci sebelum input PIN
  const [masterAccount, setMasterAccount] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_master_account');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [showMasterAuthScreen, setShowMasterAuthScreen] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_master_account');
      return !saved; // Jika belum pernah ada master account, buka layar register master pertama
    } catch {
      return true;
    }
  });
  const [displayMode, setDisplayMode] = useState('none'); // 'none' | 'kitchen' | 'customer'
  const [showDisplayModeModal, setShowDisplayModeModal] = useState(false);
  const [showLeaveDisplayModal, setShowLeaveDisplayModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutTarget, setLogoutTarget] = useState(null); // 'admin' | 'kiosk'
  const [kioskPin, setKioskPin] = useState('');
  const [stokSubTab, setStokSubTab] = useState('bahan'); // 'bahan' | 'resep' | 'simulator' | 'restock' | 'opname' | 'ledger'
  const [laporanSubTab, setLaporanSubTab] = useState('pendapatan'); // 'pendapatan' | 'item' | 'labarugi' | 'ledger' | 'shift' | 'topmargin' | 'biaya'
  const [language, setLanguage] = useState('EN'); // Matches example screenshots
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [printerSize, setPrinterSize] = useState('58mm'); // '58mm' | '80mm' (D6)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('posa_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('posa_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Default Theme Configuration - Modern Emerald Mint (Non-Blue)
  const DEFAULT_THEME = {
    theme: 'dark', // 'dark' | 'oled' | 'coffee' | 'forest' | 'violet' | 'light'
    accentColor: '#10b981', // Emerald Mint
    userNameColor: '#10b981', // Custom warna nama kasir
    cashierBadgeStyle: 'pill-avatar', // 'pill-avatar' | 'glass-card' | 'cyber-neon' | 'minimal-clean' | 'gradient-badge' | 'tag-outline'
    fontScale: 'normal', // 'compact' | 'normal' | 'large'
    soundEnabled: true,
    animationsEnabled: true,
    cardDensity: 'standard' // 'standard' | 'compact'
  };

  // Master Data & Configuration with LocalStorage persistence
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_settings');
      if (saved) return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return INITIAL_SETTINGS;
  });

  const [themeSettings, setThemeSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_theme');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Otomatis migrasi warna lama yang biru ke emerald mint modern
        if (parsed.accentColor === '#2563eb' || parsed.accentColor === '#3b82f6') {
          parsed.accentColor = '#10b981';
          localStorage.setItem('posa_theme', JSON.stringify(parsed));
        }
        return { ...DEFAULT_THEME, ...parsed };
      }
    } catch {
      // fallback
    }
    return DEFAULT_THEME;
  });

  const updateSettings = (newPartialSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartialSettings };
      try {
        localStorage.setItem('posa_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Pengaturan sistem berhasil disimpan!');
  };

  const updateThemeSettings = (newPartialTheme) => {
    setThemeSettings((prev) => {
      const updated = { ...prev, ...newPartialTheme };
      try {
        localStorage.setItem('posa_theme', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Web Audio API Cashier Chime Synthesizer
  const playSound = (type = 'click') => {
    if (!themeSettings.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch {}
  };

  // Synchronize Theme & CSS Variables to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeSettings.theme || 'dark');
    root.setAttribute('data-cashier-style', themeSettings.cashierBadgeStyle || 'pill-avatar');

    if (themeSettings.accentColor) {
      root.style.setProperty('--accent-blue', themeSettings.accentColor);
      root.style.setProperty('--border-active', themeSettings.accentColor);
      root.style.setProperty('--shadow-glow', `0 0 15px ${themeSettings.accentColor}4d`);
    }

    if (themeSettings.userNameColor) {
      const isLight = themeSettings.theme === 'light';
      const isWhite = themeSettings.userNameColor.toLowerCase() === '#ffffff' || themeSettings.userNameColor.toLowerCase() === '#fff';
      const effectiveNameColor = (isLight && isWhite) ? '#0f172a' : themeSettings.userNameColor;
      root.style.setProperty('--cashier-name-color', effectiveNameColor);
    } else {
      root.style.setProperty('--cashier-name-color', themeSettings.accentColor || '#10b981');
    }

    if (themeSettings.fontScale === 'large') {
      root.style.setProperty('--font-scale-factor', '1.08');
    } else if (themeSettings.fontScale === 'compact') {
      root.style.setProperty('--font-scale-factor', '0.94');
    } else {
      root.style.setProperty('--font-scale-factor', '1');
    }
  }, [themeSettings]);

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRODUCTS;
  });

  const [rawMaterials, setRawMaterials] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_materials');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_RAW_MATERIALS;
  });

  const [modifiers, setModifiers] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_modifiers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MODIFIERS;
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_expenses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EXPENSES;
  });

  const [stockMovements, setStockMovements] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_movements');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STOCK_MOVEMENTS;
  });

  const [staffList, setStaffList] = useState(() => {
    try {
      if (!localStorage.getItem('posa_auth_v4_clean')) {
        localStorage.removeItem('posa_staff_list');
        localStorage.setItem('posa_auth_v4_clean', 'true');
        return INITIAL_STAFF; // []
      }
      const saved = localStorage.getItem('posa_staff_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STAFF; // []
  });

  const [customerList, setCustomerList] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_customers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CUSTOMERS;
  });

  const [staffActivityLogs, setStaffActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_staff_activity');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STAFF_ACTIVITY;
  });

  // LocalStorage sync effects for persistent changes
  useEffect(() => {
    try {
      localStorage.setItem('posa_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('posa_materials', JSON.stringify(rawMaterials));
    } catch {}
  }, [rawMaterials]);

  useEffect(() => {
    try {
      localStorage.setItem('posa_staff_list', JSON.stringify(staffList));
    } catch {}
  }, [staffList]);

  useEffect(() => {
    try {
      localStorage.setItem('posa_customers', JSON.stringify(customerList));
    } catch {}
  }, [customerList]);

  useEffect(() => {
    try {
      localStorage.setItem('posa_expenses', JSON.stringify(expenses));
    } catch {}
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('posa_movements', JSON.stringify(stockMovements));
    } catch {}
  }, [stockMovements]);

  const recordStaffActivity = (userName, userRole, action, details) => {
    const newLog = {
      id: Date.now(),
      name: userName || 'Staff',
      role: userRole || 'Cashier',
      action, // 'SIGNED IN' | 'SIGNED OUT'
      details: details || (action === 'SIGNED IN' ? 'Logged into POS system' : 'Logged out'),
      time: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', '')
    };

    setStaffActivityLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('posa_staff_activity', JSON.stringify(updated.slice(0, 50)));
      } catch {}
      return updated;
    });
  };

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

  // Master Account Handlers (Owner Register, Login, & Logout)
  const registerMasterAccount = ({ name, storeName, email, password, pin }) => {
    const newMaster = {
      id: 'staff-owner-' + Date.now(),
      name,
      email,
      role: 'Owner',
      pin,
      phone: '',
      status: 'Aktif',
      active: 'Yes',
      permissions: 'Manage All',
      shift: 'Semua Shift',
      joinedDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setMasterAccount(newMaster);
    try {
      localStorage.setItem('posa_master_account', JSON.stringify(newMaster));
      localStorage.setItem('posa_master_password', password);
    } catch {}

    const updatedStaff = [newMaster];
    setStaffList(updatedStaff);
    try {
      localStorage.setItem('posa_staff_list', JSON.stringify(updatedStaff));
    } catch {}

    updateSettings({
      store_name: storeName || 'posa',
      store_email: email,
      admin_pin: pin,
      account_password: password
    });

    setCurrentUser(newMaster);
    setIsKioskMode(false);
    setIsKioskLocked(false);
    setShowMasterAuthScreen(false);
    showToast(`Selamat datang ${name}! Akun bisnis Anda berhasil didaftarkan.`, 'success');
  };

  const loginMasterAccount = (email, password) => {
    const savedPassword = localStorage.getItem('posa_master_password') || settings.account_password;
    if (!masterAccount) {
      return { success: false, message: 'Belum ada akun master yang terdaftar di perangkat ini. Silakan daftar terlebih dahulu.' };
    }
    if (
      masterAccount.email?.toLowerCase() === email?.trim().toLowerCase() &&
      (!savedPassword || savedPassword === password)
    ) {
      setCurrentUser(masterAccount);
      setIsKioskMode(false);
      setIsKioskLocked(false);
      setShowMasterAuthScreen(false);
      showToast(`Login berhasil sebagai Owner: ${masterAccount.name}`, 'success');
      return { success: true };
    }
    return { success: false, message: 'Email atau kata sandi master tidak cocok.' };
  };

  const logoutMasterAccount = () => {
    setCurrentUser(null);
    setIsKioskMode(true);
    setIsKioskLocked(true);
    setShowMasterAuthScreen(true);
    showToast('Anda telah keluar dari Akun Master.', 'info');
  };

  const lockKioskToPin = () => {
    setCurrentUser(null);
    setIsKioskMode(true);
    setIsKioskLocked(true);
    setShowMasterAuthScreen(false);
    showToast('Sesi kasir dikunci. Masukkan PIN shift kasir.', 'info');
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
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_cart');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CART;
  });
  const [discount, setDiscount] = useState(0); // Diskon manual (rupiah)

  // Sesi Kasir / Shift (PRD 5.2)
  const [currentShift, setCurrentShift] = useState(() => {
    try {
      // Migrasi pembersihan cache: hapus cache shift demo lama agar kasir default berstatus TUTUP
      const migrationKey = 'posa_shift_v4_closed';
      if (!localStorage.getItem(migrationKey)) {
        localStorage.removeItem('posa_shift');
        localStorage.setItem(migrationKey, 'true');
        return INITIAL_SHIFT;
      }
      const saved = localStorage.getItem('posa_shift');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch {}
    return INITIAL_SHIFT;
  });

  // Inventory filter state
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialFilter, setMaterialFilter] = useState('all'); // 'all' | 'low' | 'out'

  // Transactions & Bills
  const [openBills, setOpenBills] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_open_bills');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_OPEN_BILLS;
  });
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('posa_transactions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('posa_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('posa_shift', JSON.stringify(currentShift));
    } catch {}
  }, [currentShift]);

  useEffect(() => {
    try {
      localStorage.setItem('posa_open_bills', JSON.stringify(openBills));
    } catch {}
  }, [openBills]);

  useEffect(() => {
    try {
      localStorage.setItem('posa_transactions', JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

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

  // Modals for Tampilan, Pengaturan, and Bantuan PRD v3.0
  const [showTampilanModal, setShowTampilanModal] = useState(false);
  const [showPengaturanModal, setShowPengaturanModal] = useState(false);
  const [showBantuanModal, setShowBantuanModal] = useState(false);

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
    const rate = Number(settings.tax_pb1_rate ?? 10) / 100;
    if (settings.tax_mode === 'inclusive') {
      // Inklusif: Pajak sudah termasuk di dalam subtotal (D1)
      return Math.round(subtotalAfterDiscount - (subtotalAfterDiscount / (1 + rate)));
    }
    // Eksklusif: PB1 dihitung dari subtotal setelah diskon (Aturan Bisnis 4.1 & D1)
    return Math.round(subtotalAfterDiscount * rate);
  }, [subtotalAfterDiscount, settings.tax_pb1_rate, settings.tax_mode]);

  const total = useMemo(() => {
    if (settings.tax_mode === 'inclusive') {
      return subtotalAfterDiscount;
    }
    return subtotalAfterDiscount + taxPb1;
  }, [subtotalAfterDiscount, taxPb1, settings.tax_mode]);

  // Total stock inventory value real-time (INV-06)
  const totalStockValue = useMemo(() => {
    return rawMaterials.reduce((acc, item) => acc + Math.max(0, item.stock) * item.avgPrice, 0);
  }, [rawMaterials]);

  // Cart Management
  const addToCart = (product) => {
    if (!currentShift.isOpen) {
      showToast('Sesi kasir masih TUTUP! Harap Buka Kasir terlebih dahulu untuk memulai pesanan.', 'warning');
      setShowOpenShiftModal(true);
      return;
    }

    playSound('beep');
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
      cashierName: currentUser?.name || 'Ahmad Rafi (Owner)',
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

    playSound('success');

    if (themeSettings.animationsEnabled) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
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

  // Products / Menus CRUD
  const saveProduct = (productData) => {
    if (productData.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? { ...p, ...productData } : p))
      );
      showToast(`Menu "${productData.name}" berhasil diperbarui`);
    } else {
      const newId = productData.id || productData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);
      const newProd = {
        ...productData,
        id: newId,
        channelPrices: productData.channelPrices || {
          'Makan di sini': productData.price,
          'Bawa pulang': productData.price,
          'GoFood': Math.round(productData.price * 1.2),
          'GrabFood': Math.round(productData.price * 1.2)
        },
        recipe: productData.recipe || []
      };
      setProducts((prev) => [...prev, newProd]);
      showToast(`Menu "${productData.name}" berhasil ditambahkan`);
    }
  };

  const deleteProduct = (id) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;
    if (window.confirm(`Yakin ingin menghapus menu "${item.name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(`Menu "${item.name}" telah dihapus`);
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

  // Reset Semua Data Contoh Menjadi Kosongan Bersih
  const clearAllSampleData = () => {
    setProducts([]);
    setRawMaterials([]);
    setCart([]);
    setTransactions([]);
    setOpenBills([]);
    setExpenses([]);
    setStockMovements([]);
    setCustomerList([]);
    setStaffActivityLogs([]);
    setCurrentShift({
      isOpen: false,
      openedAt: null,
      closedAt: null,
      cashierName: currentUser?.name || 'Ahmad Rafi (Owner)',
      openingCash: 0,
      expectedCash: 0,
      actualCash: null,
      difference: 0
    });

    try {
      localStorage.removeItem('posa_products');
      localStorage.removeItem('posa_materials');
      localStorage.removeItem('posa_cart');
      localStorage.removeItem('posa_transactions');
      localStorage.removeItem('posa_open_bills');
      localStorage.removeItem('posa_expenses');
      localStorage.removeItem('posa_movements');
      localStorage.removeItem('posa_customers');
      localStorage.removeItem('posa_staff_activity');
      localStorage.removeItem('posa_shift');
    } catch {}

    showToast('Seluruh data contoh berhasil dikosongkan. Sistem siap diisi data baru!', 'success');
  };

  const value = {
    activeTab,
    setActiveTab,
    adminView,
    setAdminView,
    isKioskMode,
    setIsKioskMode,
    isKioskLocked,
    setIsKioskLocked,
    currentUser,
    setCurrentUser,
    displayMode,
    setDisplayMode,
    showDisplayModeModal,
    setShowDisplayModeModal,
    showLeaveDisplayModal,
    setShowLeaveDisplayModal,
    showLogoutModal,
    setShowLogoutModal,
    logoutTarget,
    setLogoutTarget,
    kioskPin,
    setKioskPin,
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
    mobileSidebarOpen,
    setMobileSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
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
    saveProduct,
    deleteProduct,
    restockRawMaterial,
    recordOpname,
    recordWaste,
    clearAllSampleData,
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
    // 3 Fitur Baru: Tampilan, Pengaturan, Bantuan PRD v3.0
    showTampilanModal,
    setShowTampilanModal,
    showPengaturanModal,
    setShowPengaturanModal,
    showBantuanModal,
    setShowBantuanModal,
    themeSettings,
    setThemeSettings,
    updateThemeSettings,
    updateSettings,
    playSound,
    staffList,
    setStaffList,
    staffActivityLogs,
    setStaffActivityLogs,
    recordStaffActivity,
    addStaff,
    updateStaff,
    deleteStaff,
    customerList,
    setCustomerList,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    masterAccount,
    setMasterAccount,
    showMasterAuthScreen,
    setShowMasterAuthScreen,
    registerMasterAccount,
    loginMasterAccount,
    logoutMasterAccount,
    lockKioskToPin,
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
