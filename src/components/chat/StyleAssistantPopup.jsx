import { HiOutlineX } from 'react-icons/hi'
import ChatUI from './ChatUI'

export default function StyleAssistantPopup({ onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:flex flex-col w-[400px] h-[540px] bg-cream-100 rounded-2xl shadow-2xl border border-cream-200 overflow-hidden animate-fade-in">
      <header className="bg-emerald-600 text-white flex items-center justify-between px-4 py-3 flex-shrink-0 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold font-display">KBF</span>
          </div>
          <div>
            <h1 className="font-body font-semibold text-sm leading-tight">Style Assistant</h1>
            <p className="text-[10px] text-emerald-200 leading-tight">Online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-emerald-500 transition-colors text-white/80 hover:text-white" aria-label="Close assistant">
          <HiOutlineX className="w-5 h-5" />
        </button>
      </header>

      <ChatUI onClose={onClose} />
    </div>
  )
}
