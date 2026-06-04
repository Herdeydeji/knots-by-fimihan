import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { getFeaturedProducts, heroImage } from '../lib/products'
import { useAuth } from '../lib/auth'
import ProductCard from '../components/ui/ProductCard'
import { PatternOverlay, StarPattern } from '../components/ui/IslamicPattern'

export default function Homepage() {
  const [likedIds, setLikedIds] = useState([])
  const [featured, setFeatured] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    getFeaturedProducts().then(setFeatured).catch(console.error)
  }, [])

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div>
      <section className="relative h-[80vh] min-h-[500px] max-h-[700px] overflow-hidden bg-emerald-900">
        <img
          src={heroImage}
          alt="Knots by Fimihan"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <PatternOverlay opacity="0.08" className="text-gold-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/40 to-transparent" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col justify-center pb-16">
          <p className="text-gold-400 text-sm font-medium uppercase tracking-[0.2em] font-body mb-4">
            Knots by Fimihan
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-3xl">
            Modest Fashion,<br />Timeless Elegance
          </h1>
          <p className="text-cream-200 text-lg mt-6 max-w-xl font-body leading-relaxed">
            Discover our curated collection of Islamic modest fashion for the modern woman.
            Abayas, hijabs, kaftans, and more.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/shop"
              className="bg-gold-500 text-white px-8 py-3.5 rounded-xl font-body font-medium hover:bg-gold-600 transition-all inline-flex items-center gap-2"
            >
              Shop Now <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-body font-medium hover:bg-white/10 transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24">
        <StarPattern opacity="0.03" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold-500 text-sm font-medium uppercase tracking-[0.15em] font-body">Featured</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1C1C1C] mt-2">Bestsellers</h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-emerald-600 font-body font-medium hover:text-emerald-700 transition-colors"
            >
              View All <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.length > 0 ? (
              featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLiked={likedIds.includes(product.id)}
                  onToggleLike={toggleLike}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-[#6B6B6B] py-12">No featured products available.</p>
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-emerald-600 font-body font-medium hover:text-emerald-700 transition-colors"
            >
              View All <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative bg-emerald-50 py-16 lg:py-24">
        <PatternOverlay opacity="0.03" className="text-emerald-600" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center lg:text-left">
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mx-auto lg:mx-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg mt-4 text-[#1C1C1C]">Premium Quality</h3>
              <p className="text-[#6B6B6B] text-sm mt-2 leading-relaxed">Hand-selected fabrics and meticulous craftsmanship in every piece.</p>
            </div>
            <div className="text-center lg:text-left">
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mx-auto lg:mx-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg mt-4 text-[#1C1C1C]">Secure Payments</h3>
              <p className="text-[#6B6B6B] text-sm mt-2 leading-relaxed">Safe and convenient payment options for peace of mind.</p>
            </div>
            <div className="text-center lg:text-left">
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mx-auto lg:mx-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg mt-4 text-[#1C1C1C]">Made with Love</h3>
              <p className="text-[#6B6B6B] text-sm mt-2 leading-relaxed">Each piece is thoughtfully designed with care and attention.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl overflow-hidden relative">
            <PatternOverlay opacity="0.05" className="text-gold-500" />
            <div className="relative px-6 lg:px-16 py-12 lg:py-16 text-center">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">Join Our Community</h2>
              <p className="text-cream-200 mt-4 max-w-lg mx-auto font-body">
                Be the first to know about new collections, exclusive offers, and styling tips.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                />
                <button type="submit" className="bg-gold-500 text-white px-6 py-3 rounded-xl font-body font-medium hover:bg-gold-600 transition-all whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
