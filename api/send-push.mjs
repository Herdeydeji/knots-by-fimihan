import webPush from 'web-push'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://kaqxifjcrxistggfniks.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(
    'mailto:support@knotbyfimihan.com',
    vapidPublicKey,
    vapidPrivateKey
  )
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { user_id, title, body, url } = req.body
  if (!user_id || !title) {
    return res.status(400).json({ error: 'user_id and title are required' })
  }

  try {
    const subRes = await fetch(
      `${SUPABASE_URL}/rest/v1/push_subscriptions?select=subscription&user_id=eq.${encodeURIComponent(user_id)}&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    )
    if (!subRes.ok) throw new Error(`Supabase query failed: ${subRes.status}`)
    const rows = await subRes.json()
    if (!rows || rows.length === 0) {
      return res.json({ success: true, skipped: 'no subscription' })
    }

    const subscription = rows[0].subscription
    const payload = JSON.stringify({ title, body: body || '', url: url || '/' })

    await webPush.sendNotification(subscription, payload)
    res.json({ success: true })
  } catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      try {
        await fetch(
          `${SUPABASE_URL}/rest/v1/push_subscriptions?user_id=eq.${encodeURIComponent(req.body.user_id)}`,
          {
            method: 'DELETE',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
            },
          }
        )
      } catch {}
      return res.json({ success: true, skipped: 'subscription expired' })
    }
    console.error('send-push error:', err)
    res.status(500).json({ error: 'Failed to send push notification' })
  }
}
