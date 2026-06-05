import { Link } from 'react-router-dom'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { useAuth } from '../../lib/auth'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

export default function ProductCard({ product }) {
  const { user, wishlist, toggleLike, openAuthModal } = useAuth()
  const isLiked = wishlist.includes(product.id)

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      openAuthModal(window.location.pathname)
      return
    }
    try {
      await toggleLike(product.id)
    } catch {
      /* ignore */
    }
  }

  if (!product || !product.is_active) return null

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-cream-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100 dark:bg-gray-700">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-colors duration-300 z-10" />
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <button
          onClick={handleLike}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            isLiked ? 'bg-red-50 text-red-500 dark:bg-red-900/50 dark:text-red-400' : 'bg-white/80 text-[#6B6B6B] dark:bg-gray-700/40 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
          }`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isLiked ? <HiHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <HiOutlineHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
        {hasDiscount && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gold-500 text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
            {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-gold-500 font-medium uppercase tracking-wider mb-0.5 sm:mb-1 font-body truncate">
          {product.category}
        </p>
        <h3 className="font-display font-bold text-sm sm:text-base text-[#1C1C1C] dark:text-gray-200 group-hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap">
          <span className="font-body font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-[11px] sm:text-sm text-[#6B6B6B] dark:text-gray-400 line-through">{formatPrice(product.compare_at_price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
