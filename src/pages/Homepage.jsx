import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlineShoppingBag,
  HiOutlineViewGrid, HiOutlineTemplate, HiOutlineCollection,
  HiOutlineViewGridAdd, HiOutlineBriefcase, HiOutlineTag,
  HiOutlineTruck, HiOutlineSparkles, HiOutlineHeart, HiOutlineLockClosed,
} from 'react-icons/hi'
import { getFeaturedProducts } from '../lib/products'
import ProductCard from '../components/ui/ProductCard'
import { CATEGORIES } from '../lib/constants'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1772714601002-fbb0fea8a911?w=1200&q=80',
    badge: 'Islamic Modest Fashion',
    heading: ['Dress Modestly,', 'Live Beautifully'],
    highlight: 'Live Beautifully',
    description: 'Premium abayas, hijabs, and kaftans for the woman who values both her faith and her style.',
    cta: 'Explore Collection',
    link: '/shop',
  },
  {
    image: 'https://images.unsplash.com/photo-1758817730402-b0ea18d9e607?w=1200&q=80',
    badge: 'Just Landed',
    heading: ['The', 'New Collection'],
    highlight: 'New Collection',
    description: 'Elegant new arrivals in premium fabrics. Hand-selected for the modern Muslim woman.',
    cta: 'Shop New Arrivals',
    link: '/shop?sort=newest',
  },
  {
    image: 'https://images.unsplash.com/photo-1750190321796-c749877df841?w=1200&q=80',
    badge: 'Eid Season',
    heading: ['Get Ready for', 'Eid Celebrations'],
    highlight: 'Eid Celebrations',
    description: 'Special occasion wear starting from ₦25,000. Look your best this season.',
    cta: 'Shop Eid Collection',
    link: '/shop?category=kaftans',
  },
  {
    image: 'https://images.unsplash.com/photo-1770964211782-013475eacc3f?w=1200&q=80',
    badge: 'Special Offer',
    heading: ['Free Shipping', 'Over ₦50,000'],
    highlight: 'Free Shipping',
    description: 'Plus easy returns within 7 days and 100% authentic materials guaranteed.',
    cta: 'Shop Now',
    link: '/shop',
  },
]

const categoryIcons = [HiOutlineViewGrid, HiOutlineTemplate, HiOutlineCollection, HiOutlineViewGridAdd, HiOutlineBriefcase]

const ADS = [
  { icon: HiOutlineTag, title: 'Eid Sale', desc: '-20% on selected modest wear', cta: 'Shop Sale', link: '/shop' },
  { icon: HiOutlineTruck, title: 'Free Shipping', desc: 'On orders over ₦50,000', cta: 'Learn More', link: '/shop' },
  { icon: HiOutlineSparkles, title: 'New Arrivals', desc: 'Dropping every Friday', cta: 'View New', link: '/shop?sort=newest' },
]

export default function Homepage() {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const timerRef = useRef(null)

  const goTo = useCallback((i) => {
    setCurrent(i)
    setProgress(0)
  }, [])

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % SLIDES.length)
    setProgress(0)
  }, [])

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length)
    setProgress(0)
  }, [])

  useEffect(() => {
    if (isPaused) return
    timerRef.current = setInterval(next, 5000)
    return () => clearInterval(timerRef.current)
  }, [isPaused, next])

  useEffect(() => {
    if (isPaused) return
    setProgress(0)
    const start = Date.now()
    const duration = 5000
    let raf
    const tick = () => {
      const elapsed = Date.now() - start
      const pct = Math.min((elapsed / duration) * 100, 100)
      setProgress(pct)
      if (pct < 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [current, isPaused])

  useEffect(() => {
    getFeaturedProducts().then((products) => {
      setFeatured(products)
      setNewArrivals(products.slice().reverse())
    }).catch(console.error)
  }, [])

  return (
    <div className="pb-4">
      <section
        className="relative h-[65vh] min-h-[500px] max-h-[700px] overflow-hidden bg-emerald-900"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/10">
          <div
            className="h-full bg-gold-500 transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              i === current ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-[1.02]'
            }`}
          >
            <img
              src={slide.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/95 via-emerald-900/60 to-emerald-900/20" />
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col justify-center pb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full w-fit mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-gold-300 text-[10px] font-medium uppercase tracking-[0.15em] font-body">
                  {slide.badge}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight max-w-3xl">
                {slide.heading[0]}<br />
                <span className="text-gold-400">{slide.heading[1]}</span>
              </h1>
              <p className="text-cream-200 text-base sm:text-lg mt-4 max-w-xl font-body leading-relaxed">
                {slide.description}
              </p>
              <Link
                to={slide.link}
                className="mt-8 bg-gold-500 text-white px-8 py-3 rounded-xl font-body font-medium
                  hover:bg-gold-600 transition-all inline-flex items-center gap-2 text-base
                  shadow-lg shadow-gold-500/30 hover:shadow-xl active:scale-[0.98] w-fit"
              >
                {slide.cta} <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}

        <button
          onClick={prev}
          className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full
            bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center
            text-white hover:bg-white/20 transition-all opacity-0 lg:opacity-100"
          aria-label="Previous slide"
          type="button"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full
            bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center
            text-white hover:bg-white/20 transition-all opacity-0 lg:opacity-100"
          aria-label="Next slide"
          type="button"
        >
          <HiOutlineArrowRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 left-4 lg:left-8 z-20 flex items-center gap-2.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-500 ${
                i === current
                  ? 'bg-gold-500 w-7 h-2'
                  : 'bg-white/40 hover:bg-white/60 w-2 h-2'
              }`}
              aria-label={`Go to slide ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat, i) => {
              const Icon = categoryIcons[i]
              return (
                <Link
                  key={cat.slug}
                  to={`/shop?category=${cat.slug}`}
                  className="category-pill bg-white dark:bg-gray-800 border border-cream-200 dark:border-gray-700
                    text-[#1C1C1C] dark:text-gray-200 hover:border-emerald-600 dark:hover:border-emerald-500
                    hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                </Link>
              )
            })}
            <Link
              to="/shop"
              className="category-pill bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600"
            >
              <span>View All</span>
              <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
            {ADS.map((ad, i) => {
              const Icon = ad.icon
              return (
                <Link
                  key={ad.title}
                  to={ad.link}
                  className="card-app p-5 flex items-start gap-4 group hover:border-emerald-600/30 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center flex-shrink-0
                    group-hover:bg-gold-100 dark:group-hover:bg-gold-900/40 transition-colors">
                    <Icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body font-semibold text-sm text-[#1C1C1C] dark:text-gray-200">{ad.title}</h3>
                    <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-0.5">{ad.desc}</p>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1.5 inline-flex items-center gap-1
                      group-hover:gap-2 transition-all">
                      {ad.cta} <HiOutlineArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gold-500 text-[11px] font-medium uppercase tracking-[0.15em] font-body">Featured</p>
              <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1C1C1C] dark:text-gray-200 mt-0.5">Bestsellers</h2>
            </div>
            <Link to="/shop" className="text-sm text-emerald-600 font-body font-medium hover:text-emerald-700 flex items-center gap-1">
              View All <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-5">
            {featured.length > 0 ? (
              featured.map((product) => (
                <div key={product.id} className="min-w-[160px] sm:min-w-[180px] lg:min-w-0 w-[160px] sm:w-[180px] lg:w-auto flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p className="text-[#6B6B6B] dark:text-gray-400 py-8 text-sm">Loading products...</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-6 bg-emerald-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-3 gap-4 lg:gap-8">
            {[
              { icon: HiOutlineSparkles, label: 'Premium Quality', desc: 'Hand-selected fabrics' },
              { icon: HiOutlineLockClosed, label: 'Secure Payments', desc: 'Safe & convenient' },
              { icon: HiOutlineHeart, label: 'Made with Love', desc: 'Thoughtfully designed' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center mx-auto">
                    <Icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <h3 className="font-body font-semibold text-xs mt-2 text-[#1C1C1C] dark:text-gray-200">{item.label}</h3>
                  <p className="text-[10px] text-[#6B6B6B] dark:text-gray-400 mt-0.5 leading-relaxed hidden sm:block">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-white px-2 py-0.5 rounded-full">New</span>
                <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1C1C1C] dark:text-gray-200">Arrivals</h2>
              </div>
              <Link to="/shop?sort=newest" className="text-sm text-emerald-600 font-body font-medium hover:text-emerald-700 flex items-center gap-1">
                View All <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-5">
              {newArrivals.slice(0, 4).map((product) => (
                <div key={product.id} className="min-w-[160px] sm:min-w-[180px] lg:min-w-0 w-[160px] sm:w-[180px] lg:w-auto flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 lg:px-8 max-w-7xl mx-auto py-6">
        <Link
          to="/shop"
          className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 lg:p-10 text-white relative overflow-hidden group"
        >
          <div className="relative z-10">
            <p className="text-gold-300 text-xs font-medium uppercase tracking-wider font-body">Limited Time</p>
            <h3 className="font-display text-xl lg:text-2xl font-bold mt-1">New Collection Out</h3>
            <p className="text-cream-200 text-sm mt-1 font-body max-w-xs">Shop the latest modest fashion arrivals before they sell out.</p>
            <span className="inline-flex items-center gap-1 mt-4 text-sm font-body font-medium text-gold-400 group-hover:gap-2 transition-all">
              Shop Now <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <HiOutlineShoppingBag className="absolute -bottom-6 -right-6 w-28 h-28 text-white/5 select-none pointer-events-none" />
        </Link>
      </section>
    </div>
  )
}
