export const orders = [
  {
    id: "KBF-20260001",
    customerName: "Aisha Mohammed",
    customerEmail: "aisha.m@email.com",
    customerPhone: "+2348012345678",
    shippingAddress: {
      street: "15 Bourdillon Road",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    items: [
      { productId: "KBF-001", name: "Emerald Grace Abaya", size: "M", qty: 1, price: 18500 },
    ],
    subtotal: 18500,
    shippingFee: 2000,
    total: 20500,
    paymentReference: "paystack_ref_001",
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    trackingNumber: "SEND-BOX-001",
    createdAt: "2026-06-01T10:30:00Z",
  },
  {
    id: "KBF-20260002",
    customerName: "Fatima Usman",
    customerEmail: "fatima.u@email.com",
    customerPhone: "+2348098765432",
    shippingAddress: {
      street: "42 Ahmadu Bello Way",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
    },
    items: [
      { productId: "KBF-003", name: "Silk Touch Hijab Set", size: "One Size", qty: 2, price: 8500 },
      { productId: "KBF-006", name: "Pashmina Hijab - Emerald", size: "One Size", qty: 1, price: 4500 },
    ],
    subtotal: 21500,
    shippingFee: 3500,
    total: 25000,
    paymentReference: "paystack_ref_002",
    paymentStatus: "paid",
    fulfillmentStatus: "processing",
    trackingNumber: "",
    createdAt: "2026-06-02T14:15:00Z",
  },
  {
    id: "KBF-20260003",
    customerName: "Zainab Okafor",
    customerEmail: "zainab.o@email.com",
    customerPhone: "+2348033334444",
    shippingAddress: {
      street: "7 Ogui Road",
      city: "Enugu",
      state: "Enugu",
      country: "Nigeria",
    },
    items: [
      { productId: "KBF-005", name: "Cream Luxe Kaftan Set", size: "M", qty: 1, price: 32000 },
    ],
    subtotal: 32000,
    shippingFee: 0,
    total: 32000,
    paymentReference: "paystack_ref_003",
    paymentStatus: "paid",
    fulfillmentStatus: "pending",
    trackingNumber: "",
    createdAt: "2026-06-03T09:00:00Z",
  },
]

export const getOrderById = (id) => orders.find((o) => o.id === id)

export const getOrderStats = () => ({
  totalOrders: orders.length,
  totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  pendingOrders: orders.filter((o) => o.fulfillmentStatus === "pending").length,
  shippedOrders: orders.filter((o) => o.fulfillmentStatus === "shipped").length,
})
