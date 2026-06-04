import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!

async function updateOrderByReference(
  reference: string,
  paymentStatus: string
): Promise<boolean> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?payment_reference=eq.${reference}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({ payment_status: paymentStatus, updated_at: new Date().toISOString() }),
    }
  )
  return response.ok
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const body = await req.json()
    const event = body.event

    if (!event) {
      return new Response("No event specified", { status: 400 })
    }

    const data = body.data
    const reference = data?.reference

    if (!reference) {
      return new Response("No reference in payload", { status: 400 })
    }

    switch (event) {
      case "charge.success":
        await updateOrderByReference(reference, "paid")
        break
      case "charge.failed":
        await updateOrderByReference(reference, "failed")
        break
      default:
        console.log(`Unhandled event: ${event}`)
    }

    return new Response("OK", { status: 200 })
  } catch (err) {
    console.error("Webhook error:", err)
    return new Response("OK", { status: 200 })
  }
})
