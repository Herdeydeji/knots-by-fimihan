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
      className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gold-500 text-white shadow-lg hover:bg-gold-600 transition-all duration-200 hover:scale-105 flex items-center justify-center animate-bot-bounce"
      aria-label="Open AI style assistant"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="8" width="14" height="10" rx="2" />
        <circle cx="9" cy="13" r="1" fill="currentColor" />
        <circle cx="15" cy="13" r="1" fill="currentColor" />
        <path d="M9 3v2M15 3v2M9 18v3M15 18v3" />
        <path d="M7 22h10" />
      </svg>
    </button>
  )
}
