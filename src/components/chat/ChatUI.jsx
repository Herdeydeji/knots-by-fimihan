import { useState, useRef, useEffect } from 'react'
import { HiOutlinePaperAirplane } from 'react-icons/hi'

const suggestions = [
  "Help me find an Eid outfit",
  "What's new in stock?",
  "I need a gift for someone",
]

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-sm">
        <span className="text-[8px] font-bold text-white font-display tracking-tight">KBF</span>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-cream-200 dark:border-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function ChatUI({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Salam Alaikum! I'm Agent KBF, your personal fashion companion. How can I help you today?" },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (text) => {
    const msg = text || input
    if (!msg.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setInput('')
    inputRef.current?.focus()

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "That's a great choice! We have several beautiful options in stock. Could you tell me more about the occasion and your preferred color? I'd love to help you find the perfect outfit!",
        },
      ])
    }, 1200)
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-sm">
                <span className="text-[8px] font-bold text-white font-display tracking-tight">KBF</span>
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl rounded-br-md shadow-md'
                  : 'bg-white dark:bg-gray-700 text-[#1C1C1C] dark:text-gray-200 rounded-2xl rounded-bl-md shadow-sm border border-cream-200 dark:border-gray-600'
              }`}
            >
              <span className="font-body">{msg.text}</span>
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        {messages.length === 1 && (
          <div className="pt-4 space-y-2 max-w-sm">
            <p className="text-xs text-[#6B6B6B] dark:text-gray-400 font-body font-medium px-1">Try asking:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="block w-full text-left px-4 py-2.5 rounded-xl bg-white dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-600 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-500 text-sm text-[#1C1C1C] dark:text-gray-200 transition-all border border-cream-200 dark:border-gray-600 shadow-sm active:scale-[0.98]"
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-cream-200 dark:border-gray-700 px-4 py-3 flex-shrink-0">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type a message..."
            className="flex-1 input-field !rounded-2xl !py-3 !px-4 text-sm resize-none border-cream-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-md shadow-emerald-500/20 active:scale-95"
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
