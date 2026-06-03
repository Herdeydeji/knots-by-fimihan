import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { HiOutlineChartBar, HiOutlineCube, HiOutlineClipboardList, HiOutlineMenu, HiOutlineX, HiOutlineArrowLeft } from 'react-icons/hi'

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: HiOutlineChartBar },
  { label: 'Products', path: '/admin/products', icon: HiOutlineCube },
  { label: 'Orders', path: '/admin/orders', icon: HiOutlineClipboardList },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

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
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <Link to="/" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors">
              <HiOutlineArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
          </div>
        </aside>

        <div className="flex-1 min-w-0 lg:ml-64">
          <div className="sticky top-0 z-30 bg-cream-50 border-b border-cream-200 lg:hidden">
            <div className="flex items-center h-14 px-4">
              <button onClick={() => setSidebarOpen(true)} aria-label="Open admin menu">
                <HiOutlineMenu className="w-6 h-6 text-emerald-600" />
              </button>
              <span className="ml-3 font-body font-semibold text-sm">Admin</span>
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
