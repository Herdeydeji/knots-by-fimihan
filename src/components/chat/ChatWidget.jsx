import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineChatAlt } from 'react-icons/hi'

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
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gold-500 text-white shadow-lg hover:bg-gold-600 transition-all duration-200 hover:scale-105 flex items-center justify-center"
      aria-label="Open AI style assistant"
    >
      <HiOutlineChatAlt className="w-6 h-6" />
    </button>
  )
}
