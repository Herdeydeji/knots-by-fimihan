const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || process.env.VITE_ONESIGNAL_APP_ID
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY

if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
  console.error('OneSignal credentials not configured on server')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
    return res.status(500).json({ error: 'OneSignal credentials not configured on server. Set ONESIGNAL_APP_ID and ONESIGNAL_API_KEY in Vercel env vars.' })
  }

  const { user_id, title, body, url } = req.body
  if (!user_id || !title) {
    return res.status(400).json({ error: 'user_id and title are required' })
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        target_channel: 'push',
        include_external_user_ids: [user_id],
        headings: { en: title },
        contents: { en: body || '' },
        url: url || '/',
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('OneSignal API error:', response.status, errText)
      return res.status(response.status).json({ error: `OneSignal API error: ${errText}` })
    }

    return res.json({ success: true })
  } catch (err) {
    const msg = err && err.message ? err.message : String(err || 'unknown error')
    console.error('send-push error:', msg)
    return res.status(500).json({ error: msg })
  }
}