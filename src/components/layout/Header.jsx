import { Link, useLocation } from 'react-router-dom'
import { HiOutlineShoppingCart, HiOutlineUser } from 'react-icons/hi'
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
  const itemCount = useCart((s) => s.itemCount)
  const location = useLocation()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-cream-100/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-cream-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-20">
          <Link to="/" className="flex items-center">
            <KBFLogo size="small" className="[&_.hidden]:lg:block" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm font-medium transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 after:transition-all after:duration-300 hover:after:w-full ${
                  location.pathname === link.path
                    ? 'text-gold-500 dark:text-gold-400 after:bg-gold-500 after:w-full'
                    : 'text-[#1C1C1C] dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <Link to="/search" className="hidden lg:flex p-2 text-[#1C1C1C] dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" aria-label="Search">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {user ? (
              <Link to="/profile" className="hidden lg:flex p-1.5 group/avatar" aria-label="Profile">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 border border-gold-500/40 shadow-md shadow-emerald-900/20 flex items-center justify-center transition-transform duration-200 group-hover/avatar:scale-110">
                  <span className="text-xs font-bold text-gold-300 font-display tracking-wide">
                    {(user.user_metadata?.name || user.email || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="hidden lg:flex p-2 text-[#1C1C1C] dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" aria-label="Sign in">
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
  )
}
