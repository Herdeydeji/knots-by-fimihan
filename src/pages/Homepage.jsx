import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlineShoppingBag,
  HiOutlineViewGrid, HiOutlineTemplate, HiOutlineCollection,
  HiOutlineViewGridAdd, HiOutlineBriefcase, HiOutlineTag,
  HiOutlineTruck, HiOutlineSparkles, HiOutlineHeart, HiOutlineLockClosed,
  HiOutlineGift, HiOutlineStar, HiOutlineFire,
} from 'react-icons/hi'
import { getFeaturedProducts } from '../lib/products'
import { getHeroSlides, getAdvertisements } from '../lib/homepage'
import ProductCard from '../components/ui/ProductCard'
import { CATEGORIES } from '../lib/constants'

const AD_ICONS = { HiOutlineTag, HiOutlineTruck, HiOutlineSparkles, HiOutlineShoppingBag, HiOutlineGift, HiOutlineStar, HiOutlineFire }
const categoryIcons = [HiOutlineViewGrid, HiOutlineTemplate, HiOutlineCollection, HiOutlineViewGridAdd, HiOutlineBriefcase]

export default function Homepage() {
  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState([])
  const [ads, setAds] = useState([])
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])

  const goTo = useCallback((i) => {
    setCurrent(i)
  }, [])

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % (slides.length || 1))
  }, [slides])

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + (slides.length || 1)) % (slides.length || 1))
  }, [slides])

  useEffect(() => {
    getHeroSlides().then(setSlides).catch(console.error)
    getAdvertisements().then(setAds).catch(console.error)
    getFeaturedProducts().then((products) => {
      setFeatured(products)
      setNewArrivals(products.slice().reverse())
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(next, 10000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  return (
    <div className="pb-4">
        <section
          className="relative mx-4 sm:mx-0 rounded-2xl sm:rounded-none h-[200px] mt-4 sm:mt-0 sm:h-[65vh] sm:min-h-[500px] sm:max-h-[700px] overflow-hidden bg-emerald-900"
        >

        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              i === current ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-[1.02]'
            }`}
          >
            <img
              src={slide.image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/95 via-emerald-900/60 to-emerald-900/20" />
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col justify-center pb-8 sm:pb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full w-fit mb-3 sm:mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-gold-300 text-[10px] font-medium uppercase tracking-[0.15em] font-body">
                  {slide.badge}
                </span>
              </div>
              <h1 className="font-display text-base sm:text-5xl lg:text-7xl font-bold text-white leading-tight max-w-3xl">
                <span>{slide.heading_line1}</span>
                <span className="sm:hidden"> </span>
                <br className="hidden sm:block" />
                <span className="text-gold-400">{slide.heading_line2}</span>
              </h1>
              <p className="hidden sm:block text-cream-200 text-base sm:text-lg mt-4 max-w-xl font-body leading-relaxed">
                {slide.description}
              </p>
              <Link
                to={slide.cta_link}
                className="mt-2 sm:mt-8 bg-gold-500 text-white px-4 sm:px-8 py-1.5 sm:py-3 rounded-xl font-body font-medium
                  hover:bg-gold-600 transition-all inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-base
                  shadow-lg shadow-gold-500/30 hover:shadow-xl active:scale-[0.98] w-fit"
              >
                {slide.cta_text} <HiOutlineArrowRight className="w-4 h-4" />
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

        {slides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-6 left-4 lg:left-8 z-20 flex items-center gap-2.5">
            {slides.map((_, i) => (
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
        )}
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

      {ads.length > 0 && (
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
              {ads.map((ad, i) => {
                const Icon = AD_ICONS[ad.icon_name] || HiOutlineTag
                return (
                  <Link
                    key={ad.id}
                    to={ad.cta_link}
                    className="card-app p-5 flex items-start gap-4 group hover:border-emerald-600/30 transition-all animate-fade-in-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center flex-shrink-0
                      group-hover:bg-gold-100 dark:group-hover:bg-gold-900/40 transition-colors">
                      <Icon className="w-5 h-5 text-gold-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-body font-semibold text-sm text-[#1C1C1C] dark:text-gray-200">{ad.title}</h3>
                      <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-0.5">{ad.description}</p>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1.5 inline-flex items-center gap-1
                        group-hover:gap-2 transition-all">
                        {ad.cta_text} <HiOutlineArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

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
