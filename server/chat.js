import Groq from 'groq-sdk'
import { buildSystemPrompt } from './context.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MODEL = 'llama-3.3-70b-versatile'

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
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 512,
    })

    const reply = completion.choices[0]?.message?.content || ''
    res.json({ reply })
  } catch (err) {
    console.error('Groq API error:', err)
    res.status(500).json({ error: 'Failed to get response from AI' })
  }
}
