import { Link } from 'react-router-dom'
import { HiOutlineArrowLeft } from 'react-icons/hi'
import ChatUI from '../components/chat/ChatUI'

export default function StyleAssistant() {
  return (
    <div className="h-dvh flex flex-col bg-cream-100 lg:hidden">
      <header className="safe-top bg-emerald-600 text-white flex items-center gap-3 px-4 pb-3 pt-[calc(var(--sat)+12px)] flex-shrink-0">
        <Link
          to="/"
          className="p-1 -ml-1 rounded-lg transition-colors text-white/90 hover:text-white"
          aria-label="Back"
        >
          <HiOutlineArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold font-display">KBF</span>
          </div>
          <div>
            <h1 className="font-body font-semibold text-sm leading-tight">Style Assistant</h1>
            <p className="text-[10px] text-emerald-200 leading-tight">Online</p>
          </div>
        </div>
      </header>

      <ChatUI />
    </div>
  )
}
