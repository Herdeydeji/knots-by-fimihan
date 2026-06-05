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

loadStoreContext().then(() => {
  app.listen(PORT, () => {
    console.log(`KBF Chat server running on http://localhost:${PORT}`)
  })
})
