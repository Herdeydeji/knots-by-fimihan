import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ChatWidget from '../chat/ChatWidget'
import AuthModal from '../ui/AuthModal'
import StyleAssistantPopup from '../chat/StyleAssistantPopup'

const hideFooterPaths = ['/cart', '/search', '/orders']
const hideFooterPatterns = [/^\/product\//]

export default function Layout() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const location = useLocation()
  const showFooter = !hideFooterPaths.includes(location.pathname) && !hideFooterPatterns.some((p) => p.test(location.pathname))

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
      <ChatWidget onToggle={() => setAssistantOpen((v) => !v)} />
      <AuthModal />
      {assistantOpen && <StyleAssistantPopup onClose={() => setAssistantOpen(false)} />}
    </div>
  )
}
