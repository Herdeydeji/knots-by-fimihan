import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  HiOutlineShoppingBag, HiOutlineMinus, HiOutlinePlus, HiOutlineCheck,
  HiOutlineHeart, HiHeart, HiOutlineArrowLeft, HiStar, HiOutlineStar,
  HiOutlinePencil,
} from 'react-icons/hi'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../lib/auth'
import { useToast } from '../stores/useToast'
import { getProductBySlug, getRelatedProducts } from '../lib/products'
import { getProductReviews, getProductRating, getReviewDistribution, createReview } from '../lib/reviews'
import ProductCard from '../components/ui/ProductCard'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [noSizeWarn, setNoSizeWarn] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)

  const [reviews, setReviews] = useState([])
  const [ratingSummary, setRatingSummary] = useState({ average: 0, count: 0 })
  const [reviewDist, setReviewDist] = useState({})
  const [reviewsLoading, setReviewsLoading] = useState(true)

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitDone, setSubmitDone] = useState(false)

  const addItem = useCart((s) => s.addItem)
  const { user, wishlist, toggleLike, openAuthModal } = useAuth()
  const addToast = useToast((s) => s.addToast)
  const isLiked = wishlist.includes(product?.id)

  const loadReviews = useCallback(async (productId) => {
    setReviewsLoading(true)
    try {
      const [r, rating, dist] = await Promise.all([
        getProductReviews(productId),
        getProductRating(productId),
        getReviewDistribution(productId),
      ])
      setReviews(r)
      setRatingSummary(rating)
      setReviewDist(dist)
    } catch {
      // silently fail
    } finally {
      setReviewsLoading(false)
    }
  }, [])

  const handleToggleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { openAuthModal(`/product/${slug}`); return }
    try {
      const wasLiked = await toggleLike(product.id)
      addToast(wasLiked ? 'Added to Wishlist ❤️' : 'Removed from Wishlist', 'success')
    } catch {
      addToast('Failed to update wishlist. Please try again.', 'error')
    }
  }

  useEffect(() => {
    setLoading(true)
    getProductBySlug(slug).then((p) => {
      setProduct(p)
      setSelectedSize('')
      setSelectedColor('')
      setQuantity(1)
      setAdded(false)
      setNoSizeWarn(false)
      setSelectedImage(0)
      setShowReviewForm(false)
      setNewRating(0)
      setNewComment('')
      setSubmitDone(false)
      window.scrollTo(0, 0)
    }).catch(() => setProduct(null)).finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (product) {
      getRelatedProducts(product).then(setRelatedProducts).catch(() => setRelatedProducts([]))
      loadReviews(product.id)
    }
  }, [product, loadReviews])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-scale-in-out">
          <svg viewBox="0 0 60 60" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="56" height="56" rx="14" fill="#1A5C3A" stroke="rgba(201,150,58,0.3)" strokeWidth="1" />
            <path d="M30 19 L36 24 L41 30 L36 36 L30 41 L24 36 L19 30 L24 24 Z" fill="#C9963A" />
            <circle cx="30" cy="30" r="9" fill="#1A5C3A" stroke="#C9963A" strokeWidth="0.8" />
            <text x="30" y="35" textAnchor="middle" fontFamily="'Playfair Display',Georgia,serif" fontSize="15" fontWeight="700" fill="#C9963A" letterSpacing="0.5">K</text>
          </svg>
        </div>
      </div>
    )
  }
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-cream-50 dark:bg-gray-950 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <h2 className="font-display text-2xl font-bold text-[#1C1C1C] dark:text-gray-200">Product Not Found</h2>
        <p className="text-[#6B6B6B] dark:text-gray-400 mt-2">This product may have been removed or is no longer available.</p>
        <Link to="/shop" className="btn-primary inline-flex mt-6">
          Continue Shopping
        </Link>
      </div>
    )
  }
  const discountBadge = product.discount_label?.trim() || null
  const hasAutoDiscount = product.compare_at_price && product.compare_at_price > product.price
  const outOfStock = product.stock <= 0

  const handleAddToCart = () => {
    if (outOfStock) return
    if (!user) {
      openAuthModal(`/product/${product.slug}`)
      return
    }
    const hasSizes = (product.sizes?.length || 0) > 0
    if (hasSizes && !selectedSize) {
      setNoSizeWarn(true)
      setTimeout(() => setNoSizeWarn(false), 3000)
      return
    }
    addItem(product, quantity, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    addToast('Added to Bag ✓', 'success')
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) { openAuthModal(`/product/${slug}`); return }
    if (newRating === 0) return
    setSubmitting(true)
    try {
      await createReview(product.id, newRating, newComment)
      setSubmitDone(true)
      setShowReviewForm(false)
      setNewRating(0)
      setNewComment('')
      loadReviews(product.id)
      addToast('Review submitted ✓', 'success')
    } catch {
      addToast('Failed to submit review. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const defaultColors = [
    { name: 'Emerald', hex: '#1A5C3A' },
    { name: 'Black', hex: '#1C1C1C' },
    { name: 'Cream', hex: '#FAF7F2' },
    { name: 'Gold', hex: '#C9963A' },
  ]

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-950 relative pb-16 lg:pb-8 overflow-x-hidden">
      <button
        onClick={() => window.history.back()}
        className="sm:hidden absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center"
        aria-label="Go back"
      >
        <HiOutlineArrowLeft className="w-5 h-5 text-[#1C1C1C]" />
      </button>
      <div className="max-w-7xl mx-auto lg:px-8">
        <div className="lg:py-8">
          <nav className="hidden lg:flex items-center gap-2 text-sm text-[#6B6B6B] dark:text-gray-400 mb-8 font-body px-4 lg:px-0">
            <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-emerald-600 dark:hover:text-emerald-400">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.category}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 capitalize">{product.category}</Link>
            <span>/</span>
            <span className="text-[#1C1C1C] dark:text-gray-200 truncate">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
            <div className="space-y-0 lg:space-y-4">
              <div className="relative aspect-[4/5] lg:rounded-2xl overflow-hidden bg-cream-100 dark:bg-gray-800 lg:border lg:border-cream-200 lg:dark:border-gray-700 -mx-4 lg:mx-0">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleToggleWishlist}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
                    isLiked ? 'bg-red-50 text-red-500 dark:bg-red-900/50 dark:text-red-400' : 'bg-white/80 text-[#6B6B6B] dark:bg-gray-700/40 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                  }`}
                  aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isLiked ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
                </button>
                {discountBadge && (
                  <div className="absolute bottom-4 left-4 bg-gold-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl">
                    {discountBadge}
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="hidden lg:flex gap-3 px-4 lg:px-0">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-colors ${
                        i === selectedImage ? 'border-emerald-600' : 'border-cream-200 dark:border-gray-700 hover:border-cream-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6 px-4 lg:px-0 pt-5 lg:pt-0 pb-16 lg:pb-0">
              <div>
                <p className="text-xs text-gold-500 font-medium uppercase tracking-wider mb-1 font-body">{product.category}</p>
                <h1 className="font-display text-2xl lg:text-4xl font-bold text-[#1C1C1C] dark:text-gray-200">{product.name}</h1>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="font-body text-2xl font-bold text-emerald-600">{formatPrice(product.price)}</span>
                  {hasAutoDiscount && (
                    <span className="text-lg text-[#6B6B6B] dark:text-gray-400 line-through">{formatPrice(product.compare_at_price)}</span>
                  )}
                </div>
                {outOfStock ? (
                  <span className="inline-flex items-center text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full mt-2">Out of Stock</span>
                ) : product.stock <= 5 ? (
                  <span className="inline-flex items-center text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full mt-2">Only {product.stock} left</span>
                ) : null}
              </div>

              <p className="text-[#6B6B6B] dark:text-gray-400 leading-relaxed font-body text-sm lg:text-base">{product.description}</p>

              <div className="flex items-center gap-2 text-sm text-[#6B6B6B] dark:text-gray-400">
                <span className="font-medium">Material:</span> {product.material}
              </div>

              {(product.sizes?.length || 0) > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] dark:text-gray-200 mb-2">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => { setSelectedSize(size); setNoSizeWarn(false) }}
                        className={`px-4 py-2 rounded-xl text-sm font-body font-medium border transition-all ${
                          selectedSize === size
                            ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-900'
                            : 'bg-white dark:bg-gray-700 text-[#6B6B6B] dark:text-gray-300 border-cream-200 dark:border-gray-600 hover:border-emerald-600 hover:text-emerald-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {noSizeWarn && <p className="text-xs text-red-500 mt-1 dark:text-red-400">Please select a size</p>}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-[#6B6B6B] dark:text-gray-400">
                  <span className="font-medium text-[#1C1C1C] dark:text-gray-200">Size:</span> One Size
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#1C1C1C] dark:text-gray-200 mb-2">Color</label>
                <div className="flex flex-wrap gap-3">
                  {(product.colors || []).map((color, i) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color ? 'border-emerald-600 scale-110' : 'border-cream-200 dark:border-gray-600 hover:border-emerald-300'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={defaultColors[i]?.name}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden lg:block">
                <label className="block text-sm font-medium text-[#1C1C1C] dark:text-gray-200 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-cream-200 dark:border-gray-600 flex items-center justify-center hover:bg-cream-100 dark:hover:bg-gray-700 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <HiOutlineMinus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-body font-medium dark:text-gray-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border border-cream-200 dark:border-gray-600 flex items-center justify-center hover:bg-cream-100 dark:hover:bg-gray-700 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <HiOutlinePlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`hidden lg:flex w-full py-3.5 rounded-xl font-body font-medium items-center justify-center gap-2 transition-all ${
                  outOfStock
                    ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                    : added
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 dark:hover:bg-emerald-900'
                }`}
              >
                {outOfStock ? (
                  <><HiOutlineShoppingBag className="w-5 h-5" /> Out of Stock</>
                ) : added ? (
                  <><HiOutlineCheck className="w-5 h-5" /> Added to Cart</>
                ) : (
                  <><HiOutlineShoppingBag className="w-5 h-5" /> Add to Cart</>
                )}
              </button>

              <div className="text-xs text-[#6B6B6B] dark:text-gray-400 space-y-1 hidden lg:block">
                <p>&bull; Free shipping on orders over ₦50,000</p>
                <p>&bull; Easy returns within 7 days</p>
                <p>&bull; 100% authentic materials</p>
              </div>
            </div>
          </div>

          <section className="mt-12 lg:mt-20 px-4 lg:px-0 border-t border-cream-200 dark:border-gray-700 pt-8 lg:pt-10">
            <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1C1C1C] dark:text-gray-200 mb-6">Customer Reviews</h2>

            {reviewsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-cream-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-cream-200 dark:bg-gray-700 rounded w-full mb-1" />
                    <div className="h-3 bg-cream-200 dark:bg-gray-700 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                <div className="lg:col-span-1">
                  <div className="card-app p-5 text-center">
                    <p className="font-display text-4xl font-bold text-[#1C1C1C] dark:text-gray-200">{ratingSummary.average}</p>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <HiStar
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(ratingSummary.average) ? 'text-gold-500 fill-gold-500' : 'text-cream-300 dark:text-gray-600'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#6B6B6B] dark:text-gray-300 mt-1 font-body">{ratingSummary.count} review{ratingSummary.count !== 1 ? 's' : ''}</p>
                    <div className="mt-4 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviewDist[star] || 0
                        const pct = ratingSummary.count > 0 ? Math.round((count / ratingSummary.count) * 100) : 0
                        return (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-3 text-right text-[#6B6B6B] dark:text-gray-400">{star}</span>
                            <HiStar className="w-3 h-3 text-gold-500 fill-gold-500" />
                            <div className="flex-1 h-1.5 rounded-full bg-cream-200 dark:bg-gray-700 overflow-hidden">
                              <div className="h-full rounded-full bg-gold-500" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-6 text-right text-[#6B6B6B] dark:text-gray-400">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="card-app p-4 lg:p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {(review.profiles?.full_name || 'A').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="font-body font-semibold text-sm text-[#1C1C1C] dark:text-gray-200">
                              {review.profiles?.full_name || 'Anonymous'}
                            </span>
                            <p className="text-[10px] text-[#6B6B6B] dark:text-gray-400">
                              {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <HiStar
                              key={i}
                              className={`w-3.5 h-3.5 ${i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-cream-300 dark:text-gray-600'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#6B6B6B] dark:text-gray-300 leading-relaxed font-body">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 card-app">
                <HiOutlineStar className="w-10 h-10 text-cream-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="font-body text-sm text-[#6B6B6B] dark:text-gray-300">No reviews yet. Be the first to review this product!</p>
              </div>
            )}

            {!showReviewForm ? (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    if (!user) { openAuthModal(`/product/${slug}`); return }
                    setShowReviewForm(true)
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-medium text-sm
                    bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition-all"
                >
                  <HiOutlinePencil className="w-4 h-4" />
                  Write a Review
                </button>
              </div>
            ) : submitDone ? (
              <div className="mt-6 text-center card-app p-4">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-body font-medium">Thank you! Your review has been submitted.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-6 card-app p-5 max-w-xl mx-auto">
                <h3 className="font-body font-semibold text-sm text-[#1C1C1C] dark:text-gray-200 mb-3">Write Your Review</h3>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      {star <= (hoverRating || newRating) ? (
                        <HiStar className="w-6 h-6 text-gold-500 fill-gold-500" />
                      ) : (
                        <HiStar className="w-6 h-6 text-cream-300 dark:text-gray-600" />
                      )}
                    </button>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-200 dark:border-gray-600 bg-white dark:bg-gray-800
                    text-sm text-[#1C1C1C] dark:text-gray-200 placeholder:text-[#6B6B6B] dark:placeholder:text-gray-500
                    font-body resize-none h-24 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                  required
                />
                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="submit"
                    disabled={newRating === 0 || !newComment.trim() || submitting}
                    className={`px-5 py-2 rounded-xl font-body font-medium text-sm transition-all ${
                      newRating === 0 || !newComment.trim() || submitting
                        ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowReviewForm(false); setNewRating(0); setNewComment(''); setHoverRating(0) }}
                    className="text-sm text-[#6B6B6B] dark:text-gray-400 hover:text-[#1C1C1C] dark:hover:text-gray-200 font-body"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          {relatedProducts.length > 0 && (
            <section className="mt-12 lg:mt-20 px-4 lg:px-0">
              <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1C1C1C] dark:text-gray-200 mb-6">You May Also Like</h2>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-6">
                {relatedProducts.map((p) => (
                  <div key={p.id} className="min-w-[150px] lg:min-w-0 w-[150px] lg:w-auto flex-shrink-0">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-cream-200 dark:border-gray-700 p-3 lg:hidden z-[60] safe-bottom">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <span className="font-body text-xs text-[#6B6B6B] dark:text-gray-400">
              {outOfStock ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
            </span>
            <p className="font-bold text-emerald-600 text-lg">{formatPrice(product.price)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg border border-cream-200 dark:border-gray-600 flex items-center justify-center hover:bg-cream-100 dark:hover:bg-gray-700"
              disabled={quantity <= 1}
            >
              <HiOutlineMinus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium dark:text-gray-200">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg border border-cream-200 dark:border-gray-600 flex items-center justify-center hover:bg-cream-100 dark:hover:bg-gray-700"
              disabled={quantity >= product.stock}
            >
              <HiOutlinePlus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`px-5 py-2.5 rounded-xl font-body font-medium text-sm transition-all ${
              outOfStock
                ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                : added
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'
            }`}
          >
            {outOfStock ? 'Sold Out' : added ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
