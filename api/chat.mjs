const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY
const MODEL = 'nvidia/nemotron-3-super-120b-a12b'
const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://kaqxifjcrxistggfniks.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!NVIDIA_API_KEY) {
  console.error('NVIDIA_API_KEY is not set — AI chat will fail with 500')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Neither SUPABASE_SERVICE_ROLE_KEY nor VITE_SUPABASE_ANON_KEY is set — product queries will fail')
} else if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not set — falling back to VITE_SUPABASE_ANON_KEY (restricted RLS)')
}

async function supabaseQuery(url, key, table, select) {
  const res = await fetch(`${url}/rest/v1/${table}?select=${encodeURIComponent(select)}`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
  })
  if (!res.ok) throw new Error(`Supabase ${table} query failed: ${res.status}`)
  return res.json()
}

function buildSystemPrompt(products, categories) {
  const productList = products?.length
    ? products.map(p =>
        `- ${p.name} (${p.category || 'Uncategorized'}) — ₦${Number(p.price).toLocaleString()}${p.description ? `: ${p.description}` : ''}`
      ).join('\n')
    : '(product data temporarily unavailable)'

  const categoryList = categories?.length
    ? categories.map(c => `- ${c.name} (${c.slug}): ${c.description}`).join('\n')
    : ''

  return `You are Agent KBF, the official AI assistant for Knots by Fimihan — a Nigerian modest fashion brand.

## ABOUT THE STORE
- Name: Knots by Fimihan — "Dress Modestly, Live Beautifully"
- Email: knotbyfimihan121@gmail.com
- WhatsApp: +2348057370277
- Location: Lagos, Nigeria
- Shipping: ₦2,000 Lagos, ₦2,500 South-West, ₦3,500 elsewhere. Free above ₦25,000.
- Payments: Paystack (cards, bank transfers, USSD)

## CATEGORIES
${categoryList || 'Abayas, Hijabs, Kaftans, Sets, Accessories'}

## CURRENT PRODUCTS
${productList}

## RULES
1. ONLY answer questions about Knots by Fimihan — its products, orders, shipping, policies, or anything directly related to the store.
2. If a question is outside this scope, you MUST NOT answer it. Instead respond with: "I don't have the ability or permission to answer that. Please reach out to our Support Team via WhatsApp at +2348057370277 or chat with our live support team on the website for further assistance."
3. Do NOT make up product information. If unsure, direct the user to contact support.
4. Keep responses concise and helpful. Be warm and professional.

## OUTPUT FORMAT
Respond in plain conversational English. No special formatting required. Just write naturally. Do not include internal reasoning like "Okay, let me..." or "I think..." — just give the answer directly.`
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
    let products = [], categories = []

    try {
      products = await supabaseQuery(SUPABASE_URL, SUPABASE_KEY, 'products', 'name,price,description,category')
    } catch (e) {
      console.warn('Could not load products:', e.message)
    }

    try {
      categories = await supabaseQuery(SUPABASE_URL, SUPABASE_KEY, 'categories', 'name,slug,description')
    } catch (e) {
      console.warn('Could not load categories:', e.message)
    }

    const systemPrompt = buildSystemPrompt(products, categories)

    const response = await fetch(NVIDIA_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('NVIDIA API error:', response.status, errText)
      return res.status(502).json({ error: 'AI service returned an error' })
    }

    const data = await response.json()
    let reply = data.choices?.[0]?.message?.content || ''

    // Strip reasoning prefixes if present
    const knownPrefixes = [
      /^Okay[,:.\s]/i, /^Ok[,:.\s]/i, /^Let['´`]?s\s/i, /^Let me\s/i, /^I should\s/i, /^I'll\s/i,
      /^I think\s/i, /^First[,:.\s]/i, /^Looking\s/i, /^The user\s/i, /^Hmm[,:.\s]/i, /^Alright[,:.\s]/i,
      /^So[,:.\s]/i, /^Great[,:.\s]/i, /^Absolutely[,:.\s]/i, /^Of course[,:.\s]/i,
      /^I understand\s/i, /^I need to\s/i, /^I can help\s/i, /^I['´`]m here\s/i,
      /^immediately[,:.\s]/i, /^Salam Alaikum[,:!\s]/i,
    ]
    let changed = true
    while (changed) {
      changed = false
      for (const prefix of knownPrefixes) {
        const m = reply.match(prefix)
        if (m && m.index === 0) {
          reply = reply.slice(m[0].length).trim()
          changed = true
          break
        }
      }
    }
    // Wrap in <p> tags for proper rendering
    if (!reply.startsWith('<')) {
      reply = `<p>${reply}</p>`
    }
    // Fix bare newlines into <br> tags for HTML rendering
    reply = reply.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')

    res.status(200).json({ reply })
  } catch (err) {
    console.error('Chat API error:', err)
    res.status(500).json({ error: 'Failed to get response from AI' })
  }
}
