import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ChatWidget from '../chat/ChatWidget'
import AuthModal from '../ui/AuthModal'
import StyleAssistantPopup from '../chat/StyleAssistantPopup'

export default function Layout() {
  const [assistantOpen, setAssistantOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget onToggle={() => setAssistantOpen((v) => !v)} />
      <AuthModal />
      {assistantOpen && <StyleAssistantPopup onClose={() => setAssistantOpen(false)} />}
    </div>
  )
}
