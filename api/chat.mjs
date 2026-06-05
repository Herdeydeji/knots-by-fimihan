import Groq from 'groq-sdk'
import { createClient } from '@supabase/supabase-js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const MODEL = 'llama-3.3-70b-versatile'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kaqxifjcrxistggfniks.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

let cachedContext = null

async function getContext() {
  if (cachedContext) return cachedContext

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('name, price, description, category'),
      supabase.from('categories').select('name, slug, description'),
    ])
    const products = productsRes.data || []
    const categories = categoriesRes.data || []

    const productList = products.length
      ? products.map(p =>
          `- ${p.name} (${p.category || 'Uncategorized'}) — ₦${Number(p.price).toLocaleString()}${p.description ? `: ${p.description}` : ''}`
        ).join('\n')
      : '(product data temporarily unavailable)'

    const categoryList = categories.length
      ? categories.map(c => `- ${c.name} (${c.slug}): ${c.description}`).join('\n')
      : ''

    cachedContext = `You are Agent KBF, the official AI assistant for Knots by Fimihan — a Nigerian modest fashion brand that sells Islamic wear.

## YOUR ROLE
You help customers with questions about the store, products, orders, shipping, and everything related to Knots by Fimihan. Be warm, helpful, and professional. Use "Salam Alaikum" as a greeting when appropriate.

## STORE INFORMATION
- Name: Knots by Fimihan
- Tagline: Dress Modestly, Live Beautifully
- Email: knotbyfimihan121@gmail.com
- WhatsApp: +2348057370277 (https://wa.me/2348057370277)
- Instagram: @knotsbyfimihan
- Location: Lagos, Nigeria
- Shipping: ₦2,000 within Lagos, ₦2,500 in South-West states, ₦3,500 elsewhere. Free shipping on orders above ₦25,000.
- Payments: Paystack (cards, bank transfers, USSD)

## CATEGORIES
${categoryList || '- Abayas, Hijabs, Kaftans, Sets, Accessories'}

## CURRENT PRODUCTS
${productList}

## STRICT RULES
1. ONLY answer questions about Knots by Fimihan — its products, orders, shipping, policies, or anything directly related to the store.
2. If a question is outside this scope (e.g., general advice, world events, non-fashion topics, coding, etc.), you MUST NOT answer it. Instead respond like this:
   "I'm sorry, I can only assist with questions about Knots by Fimihan and our products. For further assistance, please reach out to our Support Team via WhatsApp at +2348057370277 or email knotbyfimihan121@gmail.com."
3. Do NOT make up product information. If you're unsure about a product's availability or details, direct the user to contact support.
4. Keep responses concise and helpful.`

    return cachedContext
  } catch (err) {
    console.warn('Could not load store context:', err.message)
    return `You are Agent KBF, the official AI assistant for Knots by Fimihan. Follow the strict rules: only answer questions about the store and products. If asked anything else, direct the user to contact Support Team via WhatsApp at +2348057370277 or email knotbyfimihan121@gmail.com.`
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  try {
    const systemPrompt = await getContext()

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 512,
    })

    const reply = completion.choices[0]?.message?.content || ''
    res.status(200).json({ reply })
  } catch (err) {
    console.error('Groq API error:', err)
    res.status(500).json({ error: 'Failed to get response from AI' })
  }
}
