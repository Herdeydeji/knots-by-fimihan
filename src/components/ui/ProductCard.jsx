import { Link } from 'react-router-dom'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { useAuth } from '../../lib/auth'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

export default function ProductCard({ product, isLiked, onToggleLike }) {
  const { user, openAuthModal } = useAuth()

  const handleLike = (e) => {
    e.preventDefault()
    if (!user) {
      openAuthModal(window.location.pathname)
      return
    }
    onToggleLike(product.id)
  }

  if (!product || !product.isActive) return null

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-cream-200 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            isLiked ? 'bg-red-50 text-red-500' : 'bg-white/80 text-[#6B6B6B] hover:bg-white'
          }`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isLiked ? <HiHeart className="w-4 h-4" /> : <HiOutlineHeart className="w-4 h-4" />}
        </button>
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-gold-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg">
            {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gold-500 font-medium uppercase tracking-wider mb-1 font-body">{product.category}</p>
        <h3 className="font-display font-bold text-[#1C1C1C] group-hover:text-emerald-600 transition-colors leading-tight">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-body font-bold text-emerald-600">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-[#6B6B6B] line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
