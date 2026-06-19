import { useState } from 'react'
import { HiOutlineX, HiOutlineChatAlt2, HiOutlineUserGroup } from 'react-icons/hi'
import ChatUI from './ChatUI'

const AgentIcon = () => (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="8" width="14" height="10" rx="2" />
    <circle cx="9" cy="13" r="1" fill="currentColor" />
    <circle cx="15" cy="13" r="1" fill="currentColor" />
    <path d="M9 3v2M15 3v2M9 18v3M15 18v3" />
    <path d="M7 22h10" />
  </svg>
)

const SupportIcon = () => (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export default function StyleAssistantPopup({ onClose }) {
  const [mode, setMode] = useState('agent')

  const header = mode === 'agent'
    ? { icon: AgentIcon, title: 'Agent KBF', status: 'Online — Ready to assist' }
    : { icon: SupportIcon, title: 'Support Team', status: 'Online — Typically replies in a few minutes' }

  const Icon = header.icon

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:flex flex-col w-[420px] h-[580px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-cream-200 dark:border-gray-700 overflow-hidden animate-slide-up">
      <header className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center justify-between px-4 py-3 flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_60%)]" />
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-500/30">
            <Icon />
          </div>
          <div>
            <h1 className="font-display font-semibold text-sm leading-tight tracking-wide">{header.title}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <p className="text-[10px] text-emerald-200 leading-tight font-body">{header.status}</p>
            </div>
          </div>
        </div>
        <div className="relative ml-auto flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-xl p-0.5">
          <button
            onClick={() => setMode('agent')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-body font-medium transition-all flex items-center gap-1.5 ${
              mode === 'agent' ? 'bg-white text-emerald-700 shadow-sm' : 'text-white/70 hover:text-white'
            }`}
            type="button"
          >
            <HiOutlineChatAlt2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Agent</span>
          </button>
          <button
            onClick={() => setMode('support')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-body font-medium transition-all flex items-center gap-1.5 ${
              mode === 'support' ? 'bg-white text-emerald-700 shadow-sm' : 'text-white/70 hover:text-white'
            }`}
            type="button"
          >
            <HiOutlineUserGroup className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Support</span>
          </button>
        </div>
        <button onClick={onClose} className="relative p-1.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white" aria-label="Close assistant">
          <HiOutlineX className="w-5 h-5" />
        </button>
      </header>

      <ChatUI mode={mode} onModeChange={setMode} onClose={onClose} />
    </div>
  )
}
