import { useState, useEffect, useRef } from 'react'
import { HiOutlineChatAlt2, HiOutlinePaperAirplane, HiOutlineUser, HiOutlineCheck, HiOutlineArrowLeft } from 'react-icons/hi'
import { getAllConversations, sendAdminReply, getConversation, markConversationRead } from '../../lib/chat'
import { useRealtimeSubscription } from '../../hooks/useRealtime'

export default function AdminChat() {
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
    <div className="flex h-[calc(100vh-10rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-cream-200 dark:border-gray-700 overflow-hidden">
      <div className={`${showConversations ? 'flex' : 'hidden'} lg:flex w-full lg:w-72 flex-shrink-0 border-r border-cream-200 dark:border-gray-700 overflow-y-auto flex-col`}>
        <div className="p-4 border-b border-cream-200 dark:border-gray-700">
          <h2 className="font-display font-semibold text-sm text-[#1C1C1C] dark:text-gray-200">Conversations</h2>
        </div>
        {loading ? (
          <div className="p-4 text-sm text-[#6B6B6B] dark:text-gray-400">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-sm text-[#6B6B6B] dark:text-gray-400">No conversations yet.</div>
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
            <div className="px-4 py-3 border-b border-cream-200 dark:border-gray-700 flex items-center gap-3">
              <button
                onClick={() => setSelectedUserId(null)}
                className="lg:hidden p-1 -ml-1 rounded-lg hover:bg-cream-100 dark:hover:bg-gray-700 transition-colors"
                type="button"
                aria-label="Back to conversations"
              >
                <HiOutlineArrowLeft className="w-5 h-5 text-[#1C1C1C] dark:text-gray-200" />
              </button>
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
