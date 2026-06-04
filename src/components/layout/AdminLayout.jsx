import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  HiOutlineChartBar, HiOutlineCube, HiOutlineClipboardList,
  HiOutlineMenu, HiOutlineX, HiOutlineArrowLeft, HiOutlineInbox,
} from 'react-icons/hi'
import { supabase } from '../../lib/supabase'
import { getUnreadNotificationCount } from '../../lib/notifications'

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: HiOutlineChartBar },
  { label: 'Products', path: '/admin/products', icon: HiOutlineCube },
  { label: 'Orders', path: '/admin/orders', icon: HiOutlineClipboardList },
  { label: 'Complaints', path: '/admin/complaints', icon: HiOutlineInbox },
]

const ADMIN_EMAIL = 'adedejiadebeso@gmail.com'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checking, setChecking] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        navigate('/login?from=/admin/dashboard')
      } else {
        setChecking(false)
      }
    })
  }, [navigate])

  useEffect(() => {
    if (!checking) {
      getUnreadNotificationCount().then(setUnreadCount)
      const interval = setInterval(() => getUnreadNotificationCount().then(setUnreadCount), 15000)
      return () => clearInterval(interval)
    }
  }, [checking])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p className="text-[#6B6B6B] font-body">Verifying access...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-emerald-600 text-white transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center flex-shrink-0 border border-gold-500/30">
                <span className="text-sm font-bold text-gold-500 font-display tracking-wide">KBF</span>
              </div>
              <span className="text-base font-display font-bold text-white leading-tight hidden sm:block">Knots by Fimihan</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              const showBadge = link.path === '/admin/complaints' && unreadCount > 0
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
                  {link.label === 'Dashboard' && unreadCount > 0 && (
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
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-colors w-full">
              Sign Out
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0 lg:ml-64">
          <div className="sticky top-0 z-30 bg-cream-50 border-b border-cream-200 lg:hidden">
            <div className="flex items-center h-14 px-4">
              <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-1.5" aria-label="Open admin menu">
                <HiOutlineMenu className="w-6 h-6 text-emerald-600" />
                <span className="text-[11px] font-bold uppercase tracking-widest font-body text-emerald-600">Menu</span>
              </button>
            </div>
          </div>
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
