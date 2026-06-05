import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineShoppingCart, HiOutlineMenu, HiOutlineX, HiOutlineUser, HiOutlineLogout, HiOutlineClipboardList, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../lib/auth'
import { useTheme } from '../../lib/theme'
import { KBFLogo } from '../ui/IslamicPattern'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCart((s) => s.itemCount)
  const location = useLocation()
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream-100/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-cream-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-1">
              <button
                className="lg:hidden p-2 -ml-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                type="button"
              >
                <HiOutlineMenu className="w-6 h-6" />
              </button>
              <Link to="/">
                <KBFLogo />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body text-sm font-medium transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 after:transition-all after:duration-300 hover:after:w-full ${
                    location.pathname === link.path
                      ? 'text-gold-500 dark:text-gold-400 after:bg-gold-500 after:w-full'
                      : 'text-[#1C1C1C] dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <Link to="/search" className="p-2 text-[#1C1C1C] dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" aria-label="Search">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              {user ? (
                <div className="relative group">
                  <button className="p-1.5 group/avatar" aria-label="Account" type="button">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 border border-gold-500/40 shadow-md shadow-emerald-900/20 flex items-center justify-center transition-transform duration-200 group-hover/avatar:scale-110 group-hover/avatar:shadow-lg group-hover/avatar:shadow-emerald-900/30">
                      <span className="text-xs font-bold text-gold-300 font-display tracking-wide">
                        {(user.user_metadata?.name || user.email || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-cream-200 dark:border-gray-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <p className="px-4 py-2 text-sm text-[#6B6B6B] dark:text-gray-400 border-b border-cream-100 dark:border-gray-700 truncate">{user.email}</p>
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-[#1C1C1C] dark:text-gray-200 hover:bg-cream-50 dark:hover:bg-gray-700">
                      <HiOutlineClipboardList className="w-4 h-4" /> My Orders
                    </Link>
                    <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-[#1C1C1C] dark:text-gray-200 hover:bg-cream-50 dark:hover:bg-gray-700">
                      <HiOutlineUser className="w-4 h-4" /> Dashboard
                    </Link>
                    <button onClick={toggle} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1C1C1C] dark:text-gray-200 hover:bg-cream-50 dark:hover:bg-gray-700" type="button">
                      {dark ? <HiOutlineSun className="w-4 h-4" /> : <HiOutlineMoon className="w-4 h-4" />}
                      {dark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" type="button">
                      <HiOutlineLogout className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="p-2 text-[#1C1C1C] dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" aria-label="Sign in">
                  <HiOutlineUser className="w-5 h-5" />
                </Link>
              )}

              <Link to="/cart" className="relative p-2 text-[#1C1C1C] dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <HiOutlineShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-0 bg-white dark:bg-gray-900" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
            <div className="flex items-center justify-between px-4 pb-4 border-b border-cream-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <KBFLogo />
                <span className="text-[11px] font-bold uppercase tracking-widest font-body text-[#1C1C1C] dark:text-gray-300">Menu</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" type="button" className="p-2 hover:bg-cream-200 dark:hover:bg-gray-700 rounded-lg">
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl font-body font-medium ${
                    location.pathname === link.path
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'text-[#1C1C1C] dark:text-gray-300 hover:bg-cream-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-cream-200 dark:border-gray-700" />
              {user ? (
                <>
                  <p className="px-4 py-2 text-sm text-[#6B6B6B] dark:text-gray-400">{user.email}</p>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl font-body font-medium text-[#1C1C1C] dark:text-gray-300 hover:bg-cream-200 dark:hover:bg-gray-800">
                    <HiOutlineClipboardList className="w-4 h-4" /> My Orders
                  </Link>
                  <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl font-body font-medium text-[#1C1C1C] dark:text-gray-300 hover:bg-cream-200 dark:hover:bg-gray-800">
                    Dashboard
                  </Link>
                  <button onClick={toggle} className="flex items-center gap-2 px-4 py-3 rounded-xl font-body font-medium text-[#1C1C1C] dark:text-gray-300 hover:bg-cream-200 dark:hover:bg-gray-800 w-full text-left" type="button">
                    {dark ? <HiOutlineSun className="w-4 h-4" /> : <HiOutlineMoon className="w-4 h-4" />}
                    {dark ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <button onClick={() => { logout(); setMobileOpen(false) }} className="w-full text-left px-4 py-3 rounded-xl font-body font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" type="button">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl font-body font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
