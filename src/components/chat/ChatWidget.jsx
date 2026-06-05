import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChatWidget({ onToggle }) {
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      onToggle()
    } else {
      navigate('/style-assistant')
    }
  }, [onToggle, navigate])

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gold-500 text-white shadow-lg hover:bg-gold-600 transition-all duration-200 hover:scale-105 flex items-center justify-center animate-bot-bounce"
      aria-label="Open AI style assistant"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        <line x1="3" y1="16" x2="5" y2="16" />
        <line x1="19" y1="16" x2="21" y2="16" />
      </svg>
    </button>
  )
}
