import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HiOutlineShoppingBag, HiOutlineMinus, HiOutlinePlus, HiOutlineCheck, HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../lib/auth'
import { getProductBySlug, getRelatedProducts } from '../lib/products'
import ProductCard from '../components/ui/ProductCard'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [noSizeWarn, setNoSizeWarn] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCart((s) => s.addItem)
  const { user, wishlist, toggleLike, openAuthModal } = useAuth()
  const isLiked = wishlist.includes(product?.id)

  const handleToggleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { openAuthModal(`/product/${slug}`); return }
    try {
      await toggleLike(product.id)
    } catch {
      alert('Failed to update wishlist. Please try again.')
    }
  }

  useEffect(() => {
    getProductBySlug(slug).then((p) => {
      setProduct(p)
      setSelectedSize('')
      setSelectedColor('')
      setQuantity(1)
      setAdded(false)
      setNoSizeWarn(false)
      setSelectedImage(0)
      window.scrollTo(0, 0)
    }).catch(() => setProduct(null))
  }, [slug])

  useEffect(() => {
    if (product) {
      getRelatedProducts(product).then(setRelatedProducts).catch(() => setRelatedProducts([]))
    }
  }, [product])

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
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
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
  }

  const defaultColors = [
    { name: 'Emerald', hex: '#1A5C3A' },
    { name: 'Black', hex: '#1C1C1C' },
    { name: 'Cream', hex: '#FAF7F2' },
    { name: 'Gold', hex: '#C9963A' },
  ]

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-950 relative">
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
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-gold-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl">
                    {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
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

            <div className="flex flex-col gap-6 px-4 lg:px-0 pt-5 lg:pt-0 pb-28 lg:pb-0">
              <div>
                <p className="text-xs text-gold-500 font-medium uppercase tracking-wider mb-1 font-body">{product.category}</p>
                <h1 className="font-display text-2xl lg:text-4xl font-bold text-[#1C1C1C] dark:text-gray-200">{product.name}</h1>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="font-body text-2xl font-bold text-emerald-600">{formatPrice(product.price)}</span>
                  {hasDiscount && (
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

      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-cream-200 dark:border-gray-700 p-3 lg:hidden z-40 safe-bottom">
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
