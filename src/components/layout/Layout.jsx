import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BottomNav from './BottomNav'
import ChatWidget from '../chat/ChatWidget'
import AuthModal from '../ui/AuthModal'
import StyleAssistantPopup from '../chat/StyleAssistantPopup'
import PwaInstallPrompt from '../ui/PwaInstallPrompt'

export default function Layout() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isAssistant = location.pathname === '/style-assistant'
  const hideMobileHeader = location.pathname.startsWith('/product/') || location.pathname === '/checkout'
  const showBottomNav = !isAdmin && !isAssistant && !location.pathname.startsWith('/product/') && !location.pathname.startsWith('/cart')

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-gray-950">
      <div className={hideMobileHeader ? 'hidden sm:block' : ''}><Header /></div>
      <main className={`flex-1 pb-16 lg:pb-0 ${
        hideMobileHeader ? 'pt-0 sm:pt-14 lg:pt-20' : 'pt-14 lg:pt-20'
      }`}>
        <Outlet />
      </main>
      <div className={!isAdmin ? 'hidden lg:block' : ''}>
        <Footer />
      </div>
      {showBottomNav && <BottomNav />}
      <PwaInstallPrompt />
      <ChatWidget onToggle={() => setAssistantOpen((v) => !v)} />
      <AuthModal />
      {assistantOpen && <StyleAssistantPopup onClose={() => setAssistantOpen(false)} />}
    </div>
  )
}
