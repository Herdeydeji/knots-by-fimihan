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

    const htmlTagIndex = reply.search(/<[a-z][\s>]/i)
    if (htmlTagIndex > 0) {
      reply = reply.slice(htmlTagIndex)
    } else if (htmlTagIndex === -1) {
      const knownPrefixes = [
        /^Okay[,:]/i, /^Ok[,:]/i, /^Let['´`]?s/i, /^Let me/i, /^I should/i, /^I'll/i,
        /^I think/i, /^First[,:]/i, /^Looking/i, /^The user/i, /^Hmm/i, /^Alright/i,
        /^So[,:]/i, /^Great[,:]/i, /^Absolutely[,:]/i, /^Of course[,:]/i,
        /^I understand/i, /^I need to/i, /^I can help/i, /^I'm here/i,
      ]
      for (const prefix of knownPrefixes) {
        const m = reply.match(prefix)
        if (m && m.index === 0) {
          reply = reply.slice(m[0].length).trim()
          break
        }
      }
      const recheck = reply.search(/<[a-z][\s>]/i)
      if (recheck > 0) {
        reply = reply.slice(recheck)
      } else if (recheck === -1 && !reply.startsWith('<')) {
        reply = `<p>${reply}</p>`
      }
    }

    res.json({ reply })
  } catch (err) {
    console.error('NVIDIA API error:', err)
    res.status(500).json({ error: 'Failed to get response from AI' })
  }
}
