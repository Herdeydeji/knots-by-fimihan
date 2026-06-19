import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlinePaperAirplane, HiOutlineChatAlt2 } from 'react-icons/hi'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { sendMessage, getConversation } from '../../lib/chat'

const suggestions = [
  "Help me find an Eid outfit",
  "What's new in stock?",
  "I need a gift for someone",
]

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-sm">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="8" width="14" height="10" rx="2" />
          <circle cx="9" cy="13" r="1" fill="currentColor" />
          <circle cx="15" cy="13" r="1" fill="currentColor" />
          <path d="M9 3v2M15 3v2M9 18v3M15 18v3" />
          <path d="M7 22h10" />
        </svg>
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

export default function ChatUI({ mode }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Salam Alaikum! I'm Agent KBF, your personal fashion companion. How can I help you today?" },
  ])
  const [adminMessages, setAdminMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, adminMessages, isTyping])

  const messagesRef = useRef([])
  useEffect(() => { messagesRef.current = adminMessages }, [adminMessages])

  useEffect(() => {
    if (mode !== 'admin' || !user) return
    getConversation(user.id).then(setAdminMessages)
  }, [mode, user])

  useEffect(() => {
    const channel = supabase.channel(`chat-admin-${user?.id || 'anon'}`)
    channel.on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: user ? `user_id=eq.${user.id}` : undefined },
      (payload) => {
        const prev = messagesRef.current
        if (!prev.some(m => m.id === payload.new.id)) {
          setAdminMessages([...prev, payload.new])
        }
      }
    )
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user?.id])

  useEffect(() => {
    if (mode !== 'admin' || !user) return
    const interval = setInterval(() => {
      getConversation(user.id).then(msgs => {
        setAdminMessages(prev => {
          if (prev.length === msgs.length && prev[prev.length - 1]?.id === msgs[msgs.length - 1]?.id) return prev
          return msgs
        })
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [mode, user])

  const sendToAgent = useCallback(async (msg) => {
    setIsTyping(true)
    try {
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.text }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: msg }] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply || 'Sorry, I could not process that.' }])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: "I'm having trouble connecting right now. Please reach out to our Support Team via WhatsApp at +2348057370277 or email knotbyfimihan121@gmail.com.",
      }])
    } finally {
      setIsTyping(false)
    }
  }, [messages])

  const handleSend = (text) => {
    const msg = text || input
    if (!msg.trim()) return

    if (mode === 'agent') {
      setMessages((prev) => [...prev, { role: 'user', text: msg }])
      setInput('')
      inputRef.current?.focus()
      sendToAgent(msg)
    } else {
      if (!user) return
      sendMessage(user.id, msg).catch(() => {})
      setInput('')
      inputRef.current?.focus()
      setAdminMessages((prev) => [...prev, {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        sender: 'user',
        message: msg,
        created_at: new Date().toISOString(),
      }])
    }
  }

  const displayMessages = mode === 'agent' ? messages : adminMessages

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 space-y-3 bg-[#e8ddd3] dark:bg-gray-800 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.02)_2px,rgba(0,0,0,0.02)_4px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)]">
          {mode === 'agent' ? (
            <>
              {displayMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-sm">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="8" width="14" height="10" rx="2" />
                        <circle cx="9" cy="13" r="1" fill="currentColor" />
                        <circle cx="15" cy="13" r="1" fill="currentColor" />
                        <path d="M9 3v2M15 3v2M9 18v3M15 18v3" />
                        <path d="M7 22h10" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl rounded-br-md shadow-md'
                        : 'bg-white dark:bg-gray-700 text-[#1C1C1C] dark:text-gray-200 rounded-2xl rounded-bl-md shadow-sm border border-cream-200 dark:border-gray-600'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <span className="font-body" dangerouslySetInnerHTML={{ __html: msg.text }} />
                    ) : (
                      <span className="font-body">{msg.text}</span>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && <TypingIndicator />}
              {displayMessages.length === 1 && (
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
            </>
          ) : (
            <>
              {!user && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-[#6B6B6B] dark:text-gray-400">Please sign in to chat with our team.</p>
                </div>
              )}
              {user && displayMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                    <HiOutlineChatAlt2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-[#1C1C1C] dark:text-gray-200 font-body">Live Admin Chat</p>
                  <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-1 max-w-[220px]">
                    Send a message and our team will respond in real-time.
                  </p>
                </div>
              )}
              {user && displayMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  {msg.sender === 'admin' && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-sm">
                      <span className="text-[8px] font-bold text-white font-display tracking-tight">AD</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl rounded-br-md shadow-md'
                        : 'bg-white dark:bg-gray-700 text-[#1C1C1C] dark:text-gray-200 rounded-2xl rounded-bl-md shadow-sm border border-cream-200 dark:border-gray-600'
                    }`}
                  >
                    <span className="font-body">{msg.message}</span>
                    <p className="text-[10px] mt-1 opacity-60 font-body">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-cream-200 dark:border-gray-700 px-4 py-3 flex-shrink-0">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={mode === 'agent' ? 'Type a message...' : 'Type your message for the team...'}
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
