import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BottomNav from './BottomNav'
import ChatWidget from '../chat/ChatWidget'
import AuthModal from '../ui/AuthModal'
import StyleAssistantPopup from '../chat/StyleAssistantPopup'

export default function Layout() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isAssistant = location.pathname === '/style-assistant'
  const showBottomNav = !isAdmin && !isAssistant

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <div className={!isAdmin ? 'hidden lg:block' : ''}>
        <Footer />
      </div>
      {showBottomNav && <BottomNav />}
      <ChatWidget onToggle={() => setAssistantOpen((v) => !v)} />
      <AuthModal />
      {assistantOpen && <StyleAssistantPopup onClose={() => setAssistantOpen(false)} />}
    </div>
  )
}
