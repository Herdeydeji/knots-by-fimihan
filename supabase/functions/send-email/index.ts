import "jsr:@supabase/functions-js/edge-runtime.d.ts"

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

async function insertEmail(to: string, subject: string, htmlBody: string): Promise<boolean> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/email_queue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({
      to_email: to,
      subject,
      html_body: htmlBody,
      status: "pending",
    }),
  })
  return res.ok
}

async function insertNotification(type: string, title: string, message: string, link?: string): Promise<boolean> {
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405)
  }

  try {
    const { to, subject, html, type, title, message, link, notifyAdmin } = await req.json()

    if (!to || !subject || !html) {
      return jsonResponse({ error: "to, subject, and html are required" }, 400)
    }

    const sent = await sendViaResend(to, subject, html)
    const queued = await insertEmail(to, subject, html)

    if (notifyAdmin && title && message) {
      await insertNotification(type || "new_order", title, message, link)
    }

    if (sent) {
      await fetch(`${SUPABASE_URL}/rest/v1/email_queue?to_email=eq.${encodeURIComponent(to)}&status=eq.pending`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_SERVICE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ status: "sent", sent_at: new Date().toISOString() }),
      })
    }

    return jsonResponse({ success: true, sent, queued })
  } catch (err) {
    console.error("send-email error:", err)
    return jsonResponse({ error: "Internal server error" }, 500)
  }
})
