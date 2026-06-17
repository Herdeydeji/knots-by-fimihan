import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineChatAlt2, HiOutlinePaperAirplane, HiOutlineUser, HiOutlineCheck, HiOutlineArrowLeft } from 'react-icons/hi'
import { getAllConversations, sendAdminReply, getConversation, markConversationRead } from '../../lib/chat'
import { useRealtimeSubscription } from '../../hooks/useRealtime'

export default function AdminChat() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedMessages, setSelectedMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    getAllConversations().then(setConversations).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedUserId) return
    getConversation(selectedUserId).then(setSelectedMessages)
    markConversationRead(selectedUserId)
  }, [selectedUserId])

  useRealtimeSubscription('chat_messages', 'INSERT', null, () => {
    getAllConversations().then(setConversations)
    if (selectedUserId) {
      getConversation(selectedUserId).then((msgs) => {
        setSelectedMessages(msgs)
        markConversationRead(selectedUserId)
      })
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      getAllConversations().then(c => {
        setConversations(prev => {
          if (prev.length !== c.length) return c
          return prev
        })
      })
      if (selectedUserId) {
        getConversation(selectedUserId).then(msgs => {
          setSelectedMessages(prev => {
            if (prev.length !== msgs.length) return msgs
            return prev
          })
        })
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [selectedUserId])

  const handleSend = async () => {
    if (!input.trim() || !selectedUserId) return
    await sendAdminReply(selectedUserId, input.trim())
    setInput('')
  }

  const selectedConversation = conversations.find(c => c.user_id === selectedUserId)
  const showConversations = !selectedUserId
  const showChat = !!selectedUserId

  return (
    <div className="fixed inset-0 z-50 lg:static lg:inset-auto flex lg:h-[calc(100vh-10rem)] bg-white dark:bg-gray-800 lg:rounded-2xl lg:shadow-sm lg:border lg:border-cream-200 dark:border-gray-700 overflow-hidden">
      <div className={`${showConversations ? 'flex' : 'hidden'} lg:flex w-full lg:w-72 flex-shrink-0 border-r border-cream-200 dark:border-gray-700 overflow-y-auto flex-col`}>
        <div className="p-4 border-b border-cream-200 dark:border-gray-700 flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="lg:hidden p-1 rounded-xl transition-colors text-[#6B6B6B] dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            type="button"
            aria-label="Back to dashboard"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-display font-semibold text-sm text-[#1C1C1C] dark:text-gray-200">
            <span className="lg:hidden">Messages</span>
            <span className="hidden lg:inline">Conversations</span>
          </h2>
        </div>
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center px-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                <HiOutlineChatAlt2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C] dark:text-gray-200 font-body">No messages yet</p>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-1 max-w-[200px]">
                Customer conversations will appear here.
              </p>
            </div>
          </div>
        ) : (
          conversations.map((conv) => {
            const last = conv.messages[0]
            const unread = conv.messages.some(m => m.sender === 'user' && !m.read)
            return (
              <button
                key={conv.user_id}
                onClick={() => setSelectedUserId(conv.user_id)}
                className={`w-full text-left px-4 py-3 transition-colors border-b border-cream-100 dark:border-gray-700/50 ${
                  selectedUserId === conv.user_id ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-cream-50 dark:hover:bg-gray-700/50'
                }`}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <HiOutlineUser className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1C1C] dark:text-gray-200 truncate">
                      {conv.user?.full_name || conv.user?.email || conv.user_id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-[#6B6B6B] dark:text-gray-400 truncate mt-0.5">
                      {last?.message}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[10px] text-[#6B6B6B] dark:text-gray-400">
                      {last ? new Date(last.created_at).toLocaleDateString() : ''}
                    </p>
                    {unread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mt-1" />
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>

      <div className={`${showChat ? 'flex' : 'hidden'} lg:flex flex-1 flex-col`}>
        {!selectedUserId ? (
          <div className="flex-1 flex items-center justify-center text-center px-6">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                <HiOutlineChatAlt2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C] dark:text-gray-200 font-body">Live Chat</p>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-1 max-w-[240px]">
                Select a conversation from the left to start replying.
              </p>
            </div>
          </div>
        ) : (
          <>
            <header className="lg:hidden relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center gap-3 px-4 py-3 flex-shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_60%)]" />
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="relative p-1 rounded-xl transition-colors text-white/80 hover:text-white"
                  type="button"
                  aria-label="Back to conversations"
                >
                  <HiOutlineArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-500/30">
                    <span className="text-[10px] font-bold text-white font-display tracking-tight">
                      {(selectedConversation?.user?.full_name?.[0] || selectedConversation?.user?.email?.[0] || 'U').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className="font-display font-semibold text-sm leading-tight tracking-wide">
                      {selectedConversation?.user?.full_name || selectedConversation?.user?.email || selectedUserId.slice(0, 8)}
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      <p className="text-[10px] text-emerald-200 leading-tight font-body">Online</p>
                    </div>
                  </div>
                </div>
              </header>
              <div className="hidden lg:flex px-4 py-3 border-b border-cream-200 dark:border-gray-700 items-center gap-3 flex-shrink-0">
                <p className="text-sm font-medium text-[#1C1C1C] dark:text-gray-200">
                  {selectedConversation?.user?.full_name || selectedConversation?.user?.email || selectedUserId.slice(0, 8)}
                </p>
              </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {selectedMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                      <HiOutlineUser className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cream-100 dark:bg-gray-700 text-[#1C1C1C] dark:text-gray-200 rounded-2xl rounded-bl-md shadow-sm border border-cream-200 dark:border-gray-600'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl rounded-br-md shadow-md'
                    }`}
                  >
                    <span className="font-body">{msg.message}</span>
                    <p className="text-[10px] mt-1 opacity-60 font-body">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.sender === 'admin' && (
                        <span className="ml-2 inline-flex items-center gap-0.5">
                          <HiOutlineCheck className="w-3 h-3" />
                          {msg.read ? 'Read' : 'Sent'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="border-t border-cream-200 dark:border-gray-700 px-4 py-3">
              <div className="flex items-end gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Type your reply..."
                  className="flex-1 input-field !rounded-2xl !py-3 !px-4 text-sm resize-none border-cream-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500"
                />
                <button
                  onClick={handleSend}
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
        )}
      </div>
    </div>
  )
}
