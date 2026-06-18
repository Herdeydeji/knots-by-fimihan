import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineArrowLeft, HiOutlineChatAlt2, HiOutlineUserGroup } from 'react-icons/hi'
import ChatUI from '../components/chat/ChatUI'

export default function StyleAssistant() {
  const [mode, setMode] = useState('agent')

  return (
    <div className="h-dvh flex flex-col bg-white dark:bg-gray-950">
      <header className="relative safe-top bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center gap-3 px-4 pb-3 pt-[calc(var(--sat)+12px)] flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_60%)]" />
        <Link
          to="/"
          className="relative p-1 -ml-1 rounded-xl transition-colors text-white/80 hover:text-white"
          aria-label="Back"
        >
          <HiOutlineArrowLeft className="w-6 h-6" />
        </Link>
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-500/30">
            {mode === 'agent' ? (
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                <line x1="3" y1="16" x2="5" y2="16" />
                <line x1="19" y1="16" x2="21" y2="16" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          <div>
            <h1 className="font-display font-semibold text-sm leading-tight tracking-wide">
              {mode === 'agent' ? 'Agent KBF' : 'Support Team'}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <p className="text-[10px] text-emerald-200 leading-tight font-body">
                {mode === 'agent' ? 'Online — Ready to assist' : 'Online — Typically replies in a few minutes'}
              </p>
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
      </header>

      <ChatUI mode={mode} onModeChange={setMode} />
    </div>
  )
}
