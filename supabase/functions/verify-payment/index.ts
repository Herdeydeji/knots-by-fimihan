import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") ?? "sk_test_82597fc62ac6c1a8742b76bb48415cde3a888567"
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, X-Client-Info",
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  })
}

interface PaymentRequest {
  reference: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: {
    street: string
    city: string
    state: string
    country: string
  }
  items: Array<{
    product_id: string
    name: string
    size?: string
    color?: string
    qty: number
    price: number
  }>
  subtotal: number
  shipping_fee: number
  total: number
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0")
  return `KBF-${year}${random}`
}

async function verifyPaystackTransaction(reference: string): Promise<boolean> {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  )
  const data = await response.json()
  return data.status && data.data.status === "success"
}

async function insertOrder(order: {
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: object
  items: object[]
  subtotal: number
  shipping_fee: number
  total: number
  payment_reference: string
  payment_status: string
  fulfillment_status: string
}): Promise<string | null> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "return=representation",
    },
    body: JSON.stringify(order),
  })
  if (!response.ok) {
    const error = await response.text()
    console.error("Failed to insert order:", error)
    return null
  }
  const orders = await response.json()
  return orders?.[0]?.order_number ?? null
}

async function updateOrderByReference(reference: string, updates: object): Promise<boolean> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?payment_reference=eq.${encodeURIComponent(reference)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(updates),
    }
  )
  return response.ok
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405)
  }

  try {
    const body: PaymentRequest = await req.json()

    if (!body.reference) {
      return jsonResponse({ error: "Payment reference is required" }, 400)
    }

    const isValid = await verifyPaystackTransaction(body.reference)
    if (!isValid) {
      return jsonResponse({ error: "Payment verification failed" }, 400)
    }

    const orderNumber = generateOrderNumber()

    const orderId = await insertOrder({
      order_number: orderNumber,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      shipping_address: body.shipping_address,
      items: body.items,
      subtotal: body.subtotal,
      shipping_fee: body.shipping_fee,
      total: body.total,
      payment_reference: body.reference,
      payment_status: "paid",
      fulfillment_status: "pending",
    })

    if (!orderId) {
      return jsonResponse({ error: "Failed to create order" }, 500)
    }

    return jsonResponse({ success: true, order_number: orderNumber })
  } catch (err) {
    console.error("Error processing payment:", err)
    return jsonResponse({ error: "Internal server error" }, 500)
  }
})
