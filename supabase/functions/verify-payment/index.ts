import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") ?? "sk_test_82597fc62ac6c1a8742b76bb48415cde3a888567"
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

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
      "apikey": SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
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
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify(updates),
    }
  )
  return response.ok
}

async function queueEmail(to: string, subject: string, htmlBody: string): Promise<boolean> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/email_queue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ to_email: to, subject, html_body: htmlBody, status: "pending" }),
  })
  return res.ok
}

async function sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
  const key = Deno.env.get("RESEND_API_KEY")
  if (!key) return false
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Knots by Fimihan <noreply@knotbyfimihan.com>",
        to,
        subject,
        html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

async function createNotification(type: string, title: string, message: string, link?: string): Promise<boolean> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/admin_notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ type, title, message, link: link || null }),
  })
  return res.ok
}

function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`
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

    const existingOrder = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?payment_reference=eq.${encodeURIComponent(body.reference)}&select=order_number`,
      {
        headers: {
          "apikey": SUPABASE_SERVICE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    )
    const existing = await existingOrder.json()
    if (existing && existing.length > 0) {
      return jsonResponse({ success: true, order_number: existing[0].order_number, already_exists: true })
    }

    // Validate stock for all items before proceeding
    for (const item of body.items) {
      const prodRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${item.product_id}&select=stock,name`,
        {
          headers: {
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
        }
      )
      if (!prodRes.ok) {
        return jsonResponse({ error: `Failed to check stock for ${item.name}` }, 500)
      }
      const products = await prodRes.json()
      const product = products?.[0]
      if (!product) {
        return jsonResponse({ error: `Product not found: ${item.name}` }, 400)
      }
      if (product.stock < item.qty) {
        return jsonResponse({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.qty}`,
          insufficient_stock: true,
          product: product.name,
          available: product.stock,
          requested: item.qty,
        }, 409)
      }
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

    const itemsHtml = body.items.map((item) =>
      `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${item.name}${item.size ? ` (${item.size})` : ""}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">${item.qty}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${formatPrice(item.price)}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${formatPrice(item.qty * item.price)}</td></tr>`
    ).join("")

    const emailHtml = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#059669;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Payment Successful! 🎉</h1>
        </div>
        <div style="padding:24px;background:#fff">
          <p style="color:#1C1C1C;font-size:16px">Hi <strong>${body.customer_name}</strong>,</p>
          <p style="color:#6B6B6B">Thank you for your order! Your payment has been confirmed and we're preparing your items.</p>
          <div style="background:#f3f4f6;border-radius:12px;padding:16px;margin:16px 0">
            <p style="margin:0 0 8px;font-size:14px;color:#6B6B6B">Order Number</p>
            <p style="margin:0;font-size:18px;font-weight:bold;color:#1C1C1C;font-family:monospace">${orderNumber}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">${itemsHtml}</table>
          <div style="border-top:2px solid #e5e7eb;padding:8px 0;text-align:right">
            <p style="margin:0;font-size:14px;color:#6B6B6B">Subtotal: ${formatPrice(body.subtotal)}</p>
            <p style="margin:0;font-size:14px;color:#6B6B6B">Shipping: ${body.shipping_fee > 0 ? formatPrice(body.shipping_fee) : "Free"}</p>
            <p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#059669">Total: ${formatPrice(body.total)}</p>
          </div>
          <p style="color:#6B6B6B;margin-top:24px">We'll notify you when your order is confirmed. You can track your order status on our website.</p>
          <a href="https://knotbyfimihan.netlify.app/orders" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:500;margin-top:8px">View My Orders</a>
        </div>
        <div style="text-align:center;padding:16px;color:#9ca3af;font-size:12px">
          <p>Knots by Fimihan — Dress Modestly, Live Beautifully</p>
        </div>
      </div>`

    await queueEmail(
      body.customer_email,
      `Order Confirmed — ${orderNumber}`,
      emailHtml
    )

    const emailSent = await sendViaResend(
      body.customer_email,
      `Order Confirmed — ${orderNumber}`,
      emailHtml
    )

    if (emailSent) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/email_queue?to_email=eq.${encodeURIComponent(body.customer_email)}&status=eq.pending`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
          body: JSON.stringify({ status: "sent", sent_at: new Date().toISOString() }),
        }
      )
    }

    await createNotification(
      "new_order",
      "New Order Placed",
      `${body.customer_name} placed order ${orderNumber} — ${formatPrice(body.total)}`,
      "/admin/orders"
    )

    // Decrement stock and check low-stock alerts for each item
    for (const item of body.items) {
      const decRes = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/decrement_stock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
          body: JSON.stringify({ p_id: item.product_id, p_qty: item.qty }),
        }
      )
      if (decRes.ok) {
        const newStock = await decRes.json()
        if (newStock !== null && newStock !== undefined) {
          if (newStock <= 0) {
            await createNotification(
              "product_like",
              "Stock Depleted",
              `${item.name} is now out of stock. Restock to keep it available.`,
              "/admin/products"
            )
          } else if (newStock <= 5) {
            await createNotification(
              "product_like",
              "Low Stock Alert",
              `${item.name} has only ${newStock} left. Consider restocking soon.`,
              "/admin/products"
            )
          }
        }
      } else {
        console.error(`Failed to decrement stock for product ${item.product_id}:`, await decRes.text())
      }
    }

    return jsonResponse({ success: true, order_number: orderNumber })
  } catch (err) {
    console.error("Error processing payment:", err)
    return jsonResponse({ error: "Internal server error" }, 500)
  }
})
