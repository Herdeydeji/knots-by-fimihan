import { buildSystemPrompt } from './context.js'

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY
const MODEL = 'nvidia/nemotron-3-super-120b-a12b'
const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'

let cachedContext = null

export function setStoreContext(products, categories) {
  cachedContext = buildSystemPrompt(products, categories)
}

export async function handleChat(req, res) {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const systemMessage = cachedContext || buildSystemPrompt(null, null)

  try {
    const response = await fetch(NVIDIA_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemMessage },
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

    res.json({ reply })
  } catch (err) {
    console.error('NVIDIA API error:', err)
    res.status(500).json({ error: 'Failed to get response from AI' })
  }
}
