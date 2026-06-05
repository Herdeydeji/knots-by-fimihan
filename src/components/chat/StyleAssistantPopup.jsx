import { HiOutlineX } from 'react-icons/hi'
import ChatUI from './ChatUI'

export default function StyleAssistantPopup({ onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:flex flex-col w-[420px] h-[580px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-cream-200 dark:border-gray-700 overflow-hidden animate-slide-up">
      <header className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center justify-between px-4 py-3 flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_60%)]" />
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-500/30">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              <line x1="3" y1="16" x2="5" y2="16" />
              <line x1="19" y1="16" x2="21" y2="16" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-semibold text-sm leading-tight tracking-wide">Agent KBF</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <p className="text-[10px] text-emerald-200 leading-tight font-body">Online — Ready to assist</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="relative p-1.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white" aria-label="Close assistant">
          <HiOutlineX className="w-5 h-5" />
        </button>
      </header>

      <ChatUI onClose={onClose} />
    </div>
  )
}
