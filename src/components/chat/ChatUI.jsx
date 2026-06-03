import { useState, useRef, useEffect } from 'react'
import { HiOutlinePaperAirplane } from 'react-icons/hi'

const suggestions = [
  "Help me find an Eid outfit",
  "What's new in stock?",
  "I need a gift for someone",
]

export default function ChatUI({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Salam Alaikum! I'm Fimihan's style assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (text) => {
    const msg = text || input
    if (!msg.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setInput('')
    inputRef.current?.focus()

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "That's a great choice! We have several beautiful options in stock. Could you tell me more about the occasion and your preferred color? I'd love to help you find the perfect outfit!",
        },
      ])
    }, 1000)
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <span className="text-[9px] font-bold text-white font-display">KBF</span>
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-2xl rounded-br-md'
                  : 'bg-white text-[#1C1C1C] rounded-2xl rounded-bl-md shadow-sm border border-cream-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {messages.length === 1 && (
          <div className="pt-4 space-y-2 max-w-sm">
            <p className="text-xs text-[#6B6B6B] font-body font-medium px-1">Try asking:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="block w-full text-left px-4 py-2.5 rounded-xl bg-white hover:bg-cream-50 text-sm text-[#1C1C1C] transition-colors border border-cream-200 shadow-sm"
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-cream-100 border-t border-cream-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type a message..."
            className="flex-1 input-field !rounded-2xl !py-3 !px-4 text-sm resize-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            type="button"
            aria-label="Send"
          >
            <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />
          </button>
        </div>
      </div>
    </>
  )
}
