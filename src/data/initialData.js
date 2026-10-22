// Data awal sistem posa v3.0 - terkalibrasi persis dengan PRD posa v3.0

export const INITIAL_SETTINGS = {
  tax_pb1_rate: 10,
  tax_mode: 'exclusive', // 'exclusive' | 'inclusive' (D1)
  ojol_commission_percent: 20, // 20% potongan platform ojol (D8)
  max_food_cost_threshold: 35, // threshold peringatan food cost 35%
  receipt_printer_size: '58mm', // '58mm' | '80mm' (D6)
  admin_pin: '1234',
  cashier_pin: '0000',
  store_name: 'posa Coffee & Eatery',
  store_address: 'Jl. Bisnis No. 16, Jakarta Selatan',
  store_wifi: 'posa_guest / posacoffee2026'
};

export const INITIAL_MODIFIERS = [
  {
    id: 'extra-shot',
    name: 'Extra Espresso Shot',
    priceDelta: 5000,
    costDelta: 1500,
    group: 'addon'
  },
  {
    id: 'susu-oat',
    name: 'Ganti Susu Oat',
    priceDelta: 6000,
    costDelta: 2000,
    group: 'milk'
  },
  {
    id: 'extra-aren',
    name: 'Extra Gula Aren',
    priceDelta: 4000,
    costDelta: 1000,
    group: 'syrup'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'kentang-goreng',
    sku: 'MK-001',
    name: 'Kentang Goreng',
    category: 'Makanan',
    price: 20000,
    channelPrices: {
      'Makan di sini': 20000,
      'Bawa pulang': 20000,
      'GoFood': 24000,
      'GrabFood': 24000
    },
    packagingCost: 1000,
    icon: 'fries',
    recipe: [
      { materialId: 'kentang-beku', amount: 150 }
    ]
  },
  {
    id: 'roti-bakar',
    sku: 'MK-002',
    name: 'Roti Bakar',
    category: 'Makanan',
    price: 18000,
    channelPrices: {
      'Makan di sini': 18000,
      'Bawa pulang': 18000,
      'GoFood': 22000,
      'GrabFood': 22000
    },
    packagingCost: 800,
    icon: 'toast',
    recipe: [
      { materialId: 'roti-tawar', amount: 2 },
      { materialId: 'bubuk-cokelat', amount: 15 }
    ]
  },
  {
    id: 'croissant',
    sku: 'MK-003',
    name: 'Croissant',
    category: 'Makanan',
    price: 22000,
    channelPrices: {
      'Makan di sini': 22000,
      'Bawa pulang': 22000,
      'GoFood': 26000,
      'GrabFood': 26000
    },
    packagingCost: 1000,
    icon: 'croissant',
    recipe: [
      { materialId: 'croissant-beku', amount: 1 }
    ]
  },
  {
    id: 'es-teh-melati',
    sku: 'NK-001',
    name: 'Es Teh Melati',
    category: 'Non-Kopi',
    price: 10000,
    channelPrices: {
      'Makan di sini': 10000,
      'Bawa pulang': 10000,
      'GoFood': 12000,
      'GrabFood': 12000
    },
    packagingCost: 1000,
    icon: 'tea',
    recipe: [
      { materialId: 'teh-melati', amount: 10 },
      { materialId: 'gula-aren-cair', amount: 20 },
      { materialId: 'es-batu', amount: 150 },
      { materialId: 'cup-16oz', amount: 1 },
      { materialId: 'tutup-sedotan', amount: 1 }
    ]
  },
  {
    id: 'cokelat',
    sku: 'NK-002',
    name: 'Cokelat',
    category: 'Non-Kopi',
    price: 24000,
    channelPrices: {
      'Makan di sini': 24000,
      'Bawa pulang': 24000,
      'GoFood': 28000,
      'GrabFood': 28000
    },
    packagingCost: 1000,
    icon: 'chocolate',
    recipe: [
      { materialId: 'bubuk-cokelat', amount: 30 },
      { materialId: 'susu-segar', amount: 150 },
      { materialId: 'cup-16oz', amount: 1 },
      { materialId: 'tutup-sedotan', amount: 1 }
    ]
  },
  {
    id: 'matcha-latte',
    sku: 'NK-003',
    name: 'Matcha Latte',
    category: 'Non-Kopi',
    price: 28000,
    channelPrices: {
      'Makan di sini': 28000,
      'Bawa pulang': 28000,
      'GoFood': 33000,
      'GrabFood': 33000
    },
    packagingCost: 1000,
    icon: 'matcha',
    recipe: [
      { materialId: 'bubuk-matcha', amount: 10 },
      { materialId: 'susu-segar', amount: 150 },
      { materialId: 'cup-16oz', amount: 1 },
      { materialId: 'tutup-sedotan', amount: 1 }
    ]
  },
  {
    id: 'cappuccino',
    sku: 'KP-001',
    name: 'Cappuccino',
    category: 'Kopi',
    price: 25000,
    channelPrices: {
      'Makan di sini': 25000,
      'Bawa pulang': 25000,
      'GoFood': 30000,
      'GrabFood': 30000
    },
    packagingCost: 1000,
    icon: 'cappuccino',
    recipe: [
      { materialId: 'biji-kopi-arabika', amount: 18 },
      { materialId: 'susu-segar', amount: 140 },
      { materialId: 'cup-16oz', amount: 1 },
      { materialId: 'tutup-sedotan', amount: 1 }
    ]
  },
  {
    id: 'americano',
    sku: 'KP-002',
    name: 'Americano',
    category: 'Kopi',
    price: 20000,
    channelPrices: {
      'Makan di sini': 20000,
      'Bawa pulang': 20000,
      'GoFood': 24000,
      'GrabFood': 24000
    },
    packagingCost: 1000,
    icon: 'americano',
    recipe: [
      { materialId: 'biji-kopi-arabika', amount: 18 },
      { materialId: 'cup-16oz', amount: 1 },
      { materialId: 'tutup-sedotan', amount: 1 }
    ]
  },
  {
    id: 'caffe-latte',
    sku: 'KP-003',
    name: 'Caffe Latte',
    category: 'Kopi',
    price: 25000,
    channelPrices: {
      'Makan di sini': 25000,
      'Bawa pulang': 25000,
      'GoFood': 30000,
      'GrabFood': 30000
    },
    packagingCost: 1000,
    icon: 'latte',
    recipe: [
      { materialId: 'biji-kopi-arabika', amount: 18 },
      { materialId: 'susu-segar', amount: 180 },
      { materialId: 'cup-16oz', amount: 1 },
      { materialId: 'tutup-sedotan', amount: 1 }
    ]
  },
  {
    id: 'kopi-susu-aren',
    sku: 'KP-004',
    name: 'Kopi Susu Aren',
    category: 'Kopi',
    price: 22000,
    channelPrices: {
      'Makan di sini': 22000,
      'Bawa pulang': 22000,
      'GoFood': 26000,
      'GrabFood': 26000
    },
    packagingCost: 1000,
    icon: 'aren',
    recipe: [
      { materialId: 'biji-kopi-arabika', amount: 18 },
      { materialId: 'susu-segar', amount: 120 },
      { materialId: 'gula-aren-cair', amount: 25 },
      { materialId: 'es-batu', amount: 150 },
      { materialId: 'cup-16oz', amount: 1 },
      { materialId: 'tutup-sedotan', amount: 1 }
    ]
  }
];

// 15 Bahan Baku Lengkap sesuai PRD posa v3.0
export const INITIAL_RAW_MATERIALS = [
  {
    id: 'biji-kopi-arabika',
    name: 'Biji kopi arabika',
    stock: 3200,
    unit: 'gram',
    avgPrice: 220,
    minStock: 1000,
    dailyUsage: 120.9
  },
  {
    id: 'susu-segar',
    name: 'Susu segar',
    stock: 7400,
    unit: 'ml',
    avgPrice: 22,
    minStock: 3000,
    dailyUsage: 1350
  },
  {
    id: 'gula-aren-cair',
    name: 'Gula aren cair',
    stock: 420,
    unit: 'ml',
    avgPrice: 40,
    minStock: 1000,
    dailyUsage: 46.4
  },
  {
    id: 'bubuk-cokelat',
    name: 'Bubuk cokelat',
    stock: 900,
    unit: 'gram',
    avgPrice: 180,
    minStock: 300,
    dailyUsage: 39.3
  },
  {
    id: 'bubuk-matcha',
    name: 'Bubuk matcha',
    stock: 310,
    unit: 'gram',
    avgPrice: 900,
    minStock: 200,
    dailyUsage: 6.9
  },
  {
    id: 'teh-melati',
    name: 'Teh melati',
    stock: 650,
    unit: 'gram',
    avgPrice: 120,
    minStock: 200,
    dailyUsage: 10.7
  },
  {
    id: 'croissant-beku',
    name: 'Croissant beku',
    stock: 18,
    unit: 'pcs',
    avgPrice: 9000,
    minStock: 10,
    dailyUsage: 1.1
  },
  {
    id: 'roti-tawar',
    name: 'Roti tawar',
    stock: 6,
    unit: 'pcs',
    avgPrice: 2500,
    minStock: 20,
    dailyUsage: 2.0
  },
  {
    id: 'kentang-beku',
    name: 'Kentang beku',
    stock: 4500,
    unit: 'gram',
    avgPrice: 35,
    minStock: 2000,
    dailyUsage: 450
  },
  {
    id: 'es-batu',
    name: 'Es batu',
    stock: 18000,
    unit: 'gram',
    avgPrice: 1,
    minStock: 5000,
    dailyUsage: 600
  },
  {
    id: 'cup-16oz',
    name: 'Cup plastik 16oz',
    stock: 260,
    unit: 'pcs',
    avgPrice: 700,
    minStock: 100,
    dailyUsage: 4.0
  },
  {
    id: 'tutup-sedotan',
    name: 'Tutup & sedotan',
    stock: 280,
    unit: 'pcs',
    avgPrice: 300,
    minStock: 100,
    dailyUsage: 4.0
  },
  {
    id: 'sirup-karamel',
    name: 'Sirup karamel',
    stock: 850,
    unit: 'ml',
    avgPrice: 85,
    minStock: 300,
    dailyUsage: 15.0
  },
  {
    id: 'susu-oat-barista',
    name: 'Susu oat barista',
    stock: 1800,
    unit: 'ml',
    avgPrice: 45,
    minStock: 1000,
    dailyUsage: 200
  },
  {
    id: 'kantong-takeaway',
    name: 'Kantong takeaway',
    stock: 240,
    unit: 'pcs',
    avgPrice: 500,
    minStock: 100,
    dailyUsage: 5.0
  }
];

// Data awal keranjang
export const INITIAL_CART = [
  {
    productId: 'kopi-susu-aren',
    name: 'Kopi Susu Aren',
    price: 22000,
    quantity: 2,
    notes: 'Normal ice, Normal sugar',
    sugar: '100%',
    ice: 'Normal',
    modifiers: []
  },
  {
    productId: 'croissant',
    name: 'Croissant',
    price: 22000,
    quantity: 1,
    notes: 'Hangatkan',
    sugar: '-',
    ice: '-',
    modifiers: []
  },
  {
    productId: 'matcha-latte',
    name: 'Matcha Latte',
    price: 28000,
    quantity: 1,
    notes: 'Less sugar 50%',
    sugar: '50%',
    ice: 'Normal',
    modifiers: []
  }
];

export const INITIAL_OPEN_BILLS = [
  {
    id: 'BILL-101',
    table: 'Meja 02',
    customer: 'Doni (0812998811)',
    time: '09:42',
    items: [
      { productId: 'americano', name: 'Americano', price: 20000, quantity: 2, modifiers: [] },
      { productId: 'kentang-goreng', name: 'Kentang Goreng', price: 20000, quantity: 1, modifiers: [] }
    ],
    total: 66000
  },
  {
    id: 'BILL-102',
    table: 'VIP 1',
    customer: 'PT Maju Bersama',
    time: '10:15',
    items: [
      { productId: 'caffe-latte', name: 'Caffe Latte', price: 25000, quantity: 4, modifiers: [] },
      { productId: 'croissant', name: 'Croissant', price: 22000, quantity: 3, modifiers: [] }
    ],
    total: 182600
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'TRX-20261001-001',
    date: '2026-10-01',
    time: '08:15',
    customer: 'Budi Santoso',
    table: 'Meja 01',
    orderType: 'Makan di sini',
    method: 'Tunai',
    status: 'paid',
    discount: 0,
    items: [
      { productId: 'cappuccino', name: 'Cappuccino', quantity: 1, price: 25000, cost: 8500, modifiers: [] },
      { productId: 'roti-bakar', name: 'Roti Bakar', quantity: 1, price: 18000, cost: 6500, modifiers: [] }
    ],
    subtotal: 43000,
    tax: 4300,
    total: 47300,
    cost: 15000,
    commissionPercent: 0,
    commissionAmount: 0
  },
  {
    id: 'TRX-20261001-002',
    date: '2026-10-01',
    time: '08:45',
    customer: 'Sarah Wijaya',
    table: '-',
    orderType: 'Bawa pulang',
    method: 'QRIS',
    status: 'paid',
    discount: 0,
    items: [
      { productId: 'kopi-susu-aren', name: 'Kopi Susu Aren', quantity: 2, price: 22000, cost: 7500, modifiers: [] },
      { productId: 'es-teh-melati', name: 'Es Teh Melati', quantity: 1, price: 10000, cost: 2500, modifiers: [] }
    ],
    subtotal: 54000,
    tax: 5400,
    total: 59400,
    cost: 17500,
    commissionPercent: 0,
    commissionAmount: 0
  },
  {
    id: 'TRX-20261001-003',
    date: '2026-10-01',
    time: '09:12',
    customer: 'Driver Gojek #884',
    table: '-',
    orderType: 'GoFood',
    method: 'QRIS',
    status: 'paid',
    discount: 0,
    items: [
      { productId: 'matcha-latte', name: 'Matcha Latte', quantity: 2, price: 33000, cost: 11000, modifiers: [] },
      { productId: 'croissant', name: 'Croissant', quantity: 2, price: 26000, cost: 9000, modifiers: [] }
    ],
    subtotal: 118000,
    tax: 11800,
    total: 129800,
    cost: 40000,
    commissionPercent: 20,
    commissionAmount: 23600
  }
];

export const INITIAL_SHIFT = {
  isOpen: true,
  openedAt: '2026-10-01 07:30',
  cashierName: 'Rina (Owner)',
  openingCash: 500000,
  expectedCash: 547300,
  actualCash: null,
  difference: 0
};

export const INITIAL_EXPENSES = [
  { id: 1, date: '2026-10-01', category: 'Listrik & Air', amount: 75000, note: 'Token listrik toko harian' },
  { id: 2, date: '2026-10-01', category: 'Bahan Habis Pakai', amount: 35000, note: 'Gas elpiji & tissue bar' },
  { id: 3, date: '2026-10-01', category: 'Gaji / Upah Shift', amount: 150000, note: 'Uang makan & transport shift pagi' }
];

export const INITIAL_STOCK_MOVEMENTS = [
  { id: 1, time: '07:45', materialName: 'Biji kopi arabika', type: 'restock', qty: 2000, unitCost: 220, note: 'Restock mingguan CV Kopi Nusantara' },
  { id: 2, time: '08:15', materialName: 'Biji kopi arabika', type: 'sale', qty: -18, unitCost: 220, note: 'Order #TRX-20261001-001' },
  { id: 3, time: '08:15', materialName: 'Susu segar', type: 'sale', qty: -140, unitCost: 22, note: 'Order #TRX-20261001-001' },
  { id: 4, time: '08:45', materialName: 'Biji kopi arabika', type: 'sale', qty: -36, unitCost: 220, note: 'Order #TRX-20261001-002' },
  { id: 5, time: '09:00', materialName: 'Roti tawar', type: 'waste', qty: -2, unitCost: 2500, note: 'Roti berjamur (catat buang)' }
];
