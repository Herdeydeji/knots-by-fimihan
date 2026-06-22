import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import { handleChat, setStoreContext } from './chat.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kaqxifjcrxistggfniks.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY

async function loadStoreContext() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('name, price, description, category'),
      supabase.from('categories').select('name, slug, description'),
    ])
    setStoreContext(productsRes.data || [], categoriesRes.data || [])
    console.log(`Store context loaded: ${productsRes.data?.length || 0} products, ${categoriesRes.data?.length || 0} categories`)
  } catch (err) {
    console.warn('Could not load store context from Supabase:', err.message)
    setStoreContext([], [])
  }
}

app.post('/api/chat', handleChat)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/send-push', async (req, res) => {
  try {
    const { user_id, subscription_id, title, body, url } = req.body
    if (!user_id || !title) {
      return res.status(400).json({ error: 'user_id and title are required' })
    }

    if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
      return res.status(500).json({ error: 'OneSignal credentials not configured on server.' })
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        target_channel: 'push',
        headings: { en: title },
        contents: { en: body || '' },
        url: url || '/',
        chrome_web_icon: 'https://knotbyfimihan.vercel.app/icons/icon-192x192.png',
        chrome_web_big_picture: 'https://knotbyfimihan.vercel.app/og-image.png',
        ...(subscription_id
          ? { include_subscription_ids: [subscription_id] }
          : { include_external_user_ids: [user_id] }),
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('OneSignal API error:', response.status, errText)
      return res.status(response.status).json({ error: `OneSignal API error: ${errText}` })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('send-push error:', err)
    res.status(500).json({ error: 'Failed to send push notification' })
  }
})

loadStoreContext().then(() => {
  app.listen(PORT, () => {
    console.log(`KBF Chat server running on http://localhost:${PORT}`)
  })
})