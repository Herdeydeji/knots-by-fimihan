import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import webPush from 'web-push'
import { handleChat, setStoreContext } from './chat.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kaqxifjcrxistggfniks.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(
    'mailto:support@knotbyfimihan.com',
    vapidPublicKey,
    vapidPrivateKey
  )
}

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
    const { user_id, title, body, url } = req.body
    if (!user_id || !title) {
      return res.status(400).json({ error: 'user_id and title are required' })
    }

    const { data: rows, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', user_id)
      .limit(1)

    if (error) throw error
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
        await supabase.from('push_subscriptions').delete().eq('user_id', req.body.user_id)
      } catch {}
      return res.json({ success: true, skipped: 'subscription expired' })
    }
    console.error('send-push error:', err)
    res.status(500).json({ error: 'Failed to send push notification' })
  }
})

loadStoreContext().then(() => {
  app.listen(PORT, () => {
    console.log(`KBF Chat server running on http://localhost:${PORT}`)
  })
})
