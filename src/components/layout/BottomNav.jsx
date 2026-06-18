import { Link, useLocation } from 'react-router-dom'
import { HiOutlineHome, HiOutlineSearch, HiOutlineShoppingCart, HiOutlineUser } from 'react-icons/hi'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../lib/auth'

const tabs = [
  { label: 'Home', path: '/', icon: HiOutlineHome },
  { label: 'Shop', path: '/shop', icon: HiOutlineSearch },
  { label: 'Cart', path: '/cart', icon: HiOutlineShoppingCart },
]

export default function BottomNav() {
  const location = useLocation()
  const itemCount = useCart((s) => s.itemCount)
  const { user } = useAuth()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-cream-100/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-cream-200 dark:border-gray-700 safe-bottom lg:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab.path)
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-full relative transition-colors ${
                active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {tab.label === 'Cart' && itemCount > 0 && (
                <span className="absolute -top-0.5 right-1/2 translate-x-[14px] bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center z-10">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                active ? 'bg-emerald-50 dark:bg-emerald-900/30' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium font-body tracking-wide ${
                active ? 'font-semibold' : ''
              }`}>
                {tab.label}
              </span>
            </Link>
          )
        })}

        <Link
          to={user ? '/profile' : '/login'}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-full relative transition-colors ${
            isActive('/profile') || isActive('/login')
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isActive('/profile') || isActive('/login')
              ? 'bg-emerald-50 dark:bg-emerald-900/30'
              : ''
          }`}>
            {user ? (
              <div className="w-5 h-5 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-[10px] font-bold text-gold-300 font-display">
                  {(user.user_metadata?.name || user.email || '?').charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <HiOutlineUser className="w-5 h-5" />
            )}
          </div>
          <span className={`text-[10px] font-medium font-body tracking-wide ${
            isActive('/profile') || isActive('/login') ? 'font-semibold' : ''
          }`}>
            Profile
          </span>
        </Link>
      </div>
    </nav>
  )
}
