import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!

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

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const body: PaymentRequest = await req.json()

    if (!body.reference) {
      return new Response(
        JSON.stringify({ error: "Payment reference is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const isValid = await verifyPaystackTransaction(body.reference)
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Payment verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
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
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, order_number: orderNumber }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (err) {
    console.error("Error processing payment:", err)
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
