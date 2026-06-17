import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  HiOutlineChartBar, HiOutlineCube, HiOutlineClipboardList,
  HiOutlineMenu, HiOutlineX, HiOutlineArrowLeft, HiOutlineInbox, HiOutlineChatAlt2,
} from 'react-icons/hi'
import { supabase } from '../../lib/supabase'
import { getUnreadNotificationCount } from '../../lib/notifications'
import { getUnreadConversationCount } from '../../lib/chat'
import { useRealtimeSubscription } from '../../hooks/useRealtime'

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: HiOutlineChartBar },
  { label: 'Products', path: '/admin/products', icon: HiOutlineCube },
  { label: 'Orders', path: '/admin/orders', icon: HiOutlineClipboardList },
  { label: 'Chat', path: '/admin/chat', icon: HiOutlineChatAlt2 },
  { label: 'Complaints', path: '/admin/complaints', icon: HiOutlineInbox },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checking, setChecking] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadChats, setUnreadChats] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/login?from=/admin/dashboard')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
      if (!profile?.is_admin) {
        navigate('/login?from=/admin/dashboard')
      } else {
        setChecking(false)
      }
    })
  }, [navigate])

  useEffect(() => {
    if (!checking) {
      getUnreadNotificationCount().then(setUnreadCount)
      getUnreadConversationCount().then(setUnreadChats)
    }
  }, [checking])

  useRealtimeSubscription('admin_notifications', 'INSERT', null, () => {
    if (!checking) {
      getUnreadNotificationCount().then(setUnreadCount)
    }
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-[#6B6B6B] dark:text-gray-400 font-body">Verifying access...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-950">
      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-emerald-600 text-white transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center flex-shrink-0 border border-gold-500/30">
                <span className="text-sm font-bold text-gold-500 font-display tracking-wide">KBF</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest font-body text-white/80">Menu</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/20 text-gold-400' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{link.label}</span>
                  {link.label === 'Dashboard' && (unreadCount > 0 || unreadChats > 0) && (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  )}
                  {link.label === 'Chat' && unreadChats > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                      {unreadChats > 9 ? '9+' : unreadChats}
                    </span>
                  )}
                  {link.label === 'Complaints' && unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4 space-y-1">
            <Link to="/" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors w-full">
              <HiOutlineArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white/80 border border-white/30 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 transition-all duration-200 w-full">
              Sign Out
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0 lg:ml-64">
          <div className="sticky top-0 z-30 bg-cream-50 dark:bg-gray-900 border-b border-cream-200 dark:border-gray-700 lg:hidden">
            <div className="flex items-center justify-between h-14 px-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setSidebarOpen(true)} className="p-1 -ml-1" aria-label="Open admin menu">
                  <HiOutlineMenu className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </button>
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center border border-gold-500/30">
                  <span className="text-[10px] font-bold text-gold-500 font-display tracking-wide">KBF</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest font-body text-[#1C1C1C] dark:text-gray-200">Admin Panel</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 lg:px-8 pt-4 pb-0">
            <h1 className="text-xl lg:text-2xl font-display font-semibold text-emerald-600 hidden lg:block">Admin Panel</h1>
            <div />
          </div>
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
