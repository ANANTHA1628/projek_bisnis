// Data awal sistem posa - terkalibrasi persis dengan tampilan gambar

export const INITIAL_PRODUCTS = [
  {
    id: 'kentang-goreng',
    name: 'Kentang Goreng',
    category: 'Makanan',
    price: 20000,
    cost: 8000,
    icon: 'fries',
    recipe: [
      { materialId: 'cup-16oz', amount: 1 }
    ]
  },
  {
    id: 'roti-bakar',
    name: 'Roti Bakar',
    category: 'Makanan',
    price: 18000,
    cost: 6500,
    icon: 'toast',
    recipe: [
      { materialId: 'roti-tawar', amount: 2 },
      { materialId: 'bubuk-cokelat', amount: 15 }
    ]
  },
  {
    id: 'croissant',
    name: 'Croissant',
    category: 'Makanan',
    price: 22000,
    cost: 9000,
    icon: 'croissant',
    recipe: [
      { materialId: 'croissant-beku', amount: 1 }
    ]
  },
  {
    id: 'es-teh-melati',
    name: 'Es Teh Melati',
    category: 'Non-Kopi',
    price: 10000,
    cost: 2500,
    icon: 'tea',
    recipe: [
      { materialId: 'teh-melati', amount: 10 },
      { materialId: 'gula-aren-cair', amount: 20 },
      { materialId: 'es-batu', amount: 150 },
      { materialId: 'cup-16oz', amount: 1 }
    ]
  },
  {
    id: 'cokelat',
    name: 'Cokelat',
    category: 'Non-Kopi',
    price: 24000,
    cost: 9500,
    icon: 'chocolate',
    recipe: [
      { materialId: 'bubuk-cokelat', amount: 30 },
      { materialId: 'susu-segar', amount: 150 },
      { materialId: 'cup-16oz', amount: 1 }
    ]
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'Non-Kopi',
    price: 28000,
    cost: 11000,
    icon: 'matcha',
    recipe: [
      { materialId: 'bubuk-matcha', amount: 10 },
      { materialId: 'susu-segar', amount: 150 },
      { materialId: 'cup-16oz', amount: 1 }
    ]
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Kopi',
    price: 25000,
    cost: 8500,
    icon: 'cappuccino',
    recipe: [
      { materialId: 'biji-kopi-arabika', amount: 18 },
      { materialId: 'susu-segar', amount: 140 },
      { materialId: 'cup-16oz', amount: 1 }
    ]
  },
  {
    id: 'americano',
    name: 'Americano',
    category: 'Kopi',
    price: 20000,
    cost: 5000,
    icon: 'americano',
    recipe: [
      { materialId: 'biji-kopi-arabika', amount: 18 },
      { materialId: 'cup-16oz', amount: 1 }
    ]
  },
  {
    id: 'caffe-latte',
    name: 'Caffe Latte',
    category: 'Kopi',
    price: 25000,
    cost: 8500,
    icon: 'latte',
    recipe: [
      { materialId: 'biji-kopi-arabika', amount: 18 },
      { materialId: 'susu-segar', amount: 180 },
      { materialId: 'cup-16oz', amount: 1 }
    ]
  },
  {
    id: 'kopi-susu-aren',
    name: 'Kopi Susu Aren',
    category: 'Kopi',
    price: 22000,
    cost: 7500,
    icon: 'aren',
    recipe: [
      { materialId: 'biji-kopi-arabika', amount: 18 },
      { materialId: 'susu-segar', amount: 120 },
      { materialId: 'gula-aren-cair', amount: 25 },
      { materialId: 'es-batu', amount: 150 },
      { materialId: 'cup-16oz', amount: 1 }
    ]
  }
];

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
    id: 'croissant-beku',
    name: 'Croissant beku',
    stock: 18,
    unit: 'pcs',
    avgPrice: 9000,
    minStock: 10,
    dailyUsage: 1.1
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
    id: 'es-batu',
    name: 'Es batu',
    stock: 18000,
    unit: 'gram',
    avgPrice: 1,
    minStock: 5000,
    dailyUsage: 600
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
    id: 'roti-tawar',
    name: 'Roti tawar',
    stock: 6,
    unit: 'pcs',
    avgPrice: 2500,
    minStock: 20,
    dailyUsage: 2.0
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
    id: 'teh-melati',
    name: 'Teh melati',
    stock: 650,
    unit: 'gram',
    avgPrice: 120,
    minStock: 200,
    dailyUsage: 10.7
  }
];

// Data awal keranjang sesuai dengan Gambar 1
export const INITIAL_CART = [
  {
    productId: 'kopi-susu-aren',
    name: 'Kopi Susu Aren',
    price: 22000,
    quantity: 2,
    notes: 'Normal ice, Normal sugar',
    sugar: '100%',
    ice: 'Normal'
  },
  {
    productId: 'croissant',
    name: 'Croissant',
    price: 22000,
    quantity: 1,
    notes: 'Hangatkan',
    sugar: '-',
    ice: '-'
  },
  {
    productId: 'matcha-latte',
    name: 'Matcha Latte',
    price: 28000,
    quantity: 1,
    notes: 'Less sugar 50%',
    sugar: '50%',
    ice: 'Normal'
  }
];

export const INITIAL_OPEN_BILLS = [
  {
    id: 'BILL-101',
    table: 'Meja 02',
    customer: 'Doni (0812998811)',
    time: '09:42',
    items: [
      { name: 'Americano', price: 20000, quantity: 2 },
      { name: 'Kentang Goreng', price: 20000, quantity: 1 }
    ],
    total: 66000
  },
  {
    id: 'BILL-102',
    table: 'VIP 1',
    customer: 'PT Maju Bersama',
    time: '10:15',
    items: [
      { name: 'Caffe Latte', price: 25000, quantity: 4 },
      { name: 'Croissant', price: 22000, quantity: 3 }
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
    items: [
      { name: 'Cappuccino', quantity: 1, price: 25000 },
      { name: 'Roti Bakar', quantity: 1, price: 18000 }
    ],
    subtotal: 43000,
    tax: 4300,
    total: 47300,
    cost: 15000
  },
  {
    id: 'TRX-20261001-002',
    date: '2026-10-01',
    time: '08:45',
    customer: 'Sarah Wijaya',
    table: '-',
    orderType: 'Bawa pulang',
    method: 'QRIS',
    items: [
      { name: 'Kopi Susu Aren', quantity: 2, price: 22000 },
      { name: 'Es Teh Melati', quantity: 1, price: 10000 }
    ],
    subtotal: 54000,
    tax: 5400,
    total: 59400,
    cost: 17500
  },
  {
    id: 'TRX-20261001-003',
    date: '2026-10-01',
    time: '09:12',
    customer: 'Ahmad Gojek',
    table: '-',
    orderType: 'GoFood',
    method: 'QRIS',
    items: [
      { name: 'Matcha Latte', quantity: 2, price: 28000 },
      { name: 'Croissant', quantity: 2, price: 22000 }
    ],
    subtotal: 100000,
    tax: 10000,
    total: 110000,
    cost: 40000
  }
];
