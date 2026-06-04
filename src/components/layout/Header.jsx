import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineShoppingBag, HiOutlineMenu, HiOutlineX, HiOutlineUser, HiOutlineLogout, HiOutlineClipboardList } from 'react-icons/hi'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../lib/auth'
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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream-100/90 backdrop-blur-md border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-1">
              <button
                className="lg:hidden p-2 -ml-2 text-emerald-600 hover:text-emerald-700"
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
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'text-gold-500'
                      : 'text-[#1C1C1C] hover:text-emerald-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <Link to="/search" className="p-2 text-[#1C1C1C] hover:text-emerald-600" aria-label="Search">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              {user ? (
                <div className="relative group">
                  <button className="p-2 text-emerald-600" aria-label="Account" type="button">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-600 font-display">
                        {(user.user_metadata?.name || user.email || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-cream-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <p className="px-4 py-2 text-sm text-[#6B6B6B] border-b border-cream-100 truncate">{user.email}</p>
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-[#1C1C1C] hover:bg-cream-50">
                      <HiOutlineClipboardList className="w-4 h-4" /> My Orders
                    </Link>
                    <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-[#1C1C1C] hover:bg-cream-50">
                      <HiOutlineUser className="w-4 h-4" /> Dashboard
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50" type="button">
                      <HiOutlineLogout className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="p-2 text-[#1C1C1C] hover:text-emerald-600" aria-label="Sign in">
                  <HiOutlineUser className="w-5 h-5" />
                </Link>
              )}

              <Link to="/cart" className="relative p-2 text-[#1C1C1C] hover:text-emerald-600">
                <HiOutlineShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
          <div className="absolute inset-0 bg-white" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
            <div className="flex items-center justify-between px-4 pb-4 border-b border-cream-200">
              <KBFLogo />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" type="button" className="p-2 hover:bg-cream-200 rounded-lg">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl font-body font-medium ${
                    location.pathname === link.path
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-[#1C1C1C] hover:bg-cream-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-cream-200" />
              {user ? (
                <>
                  <p className="px-4 py-2 text-sm text-[#6B6B6B]">{user.email}</p>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl font-body font-medium text-[#1C1C1C] hover:bg-cream-200">
                    <HiOutlineClipboardList className="w-4 h-4" /> My Orders
                  </Link>
                  <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl font-body font-medium text-[#1C1C1C] hover:bg-cream-200">
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false) }} className="w-full text-left px-4 py-3 rounded-xl font-body font-medium text-red-500 hover:bg-red-50" type="button">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl font-body font-medium text-emerald-600 hover:bg-emerald-50">
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
