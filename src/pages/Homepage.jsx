import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { getFeaturedProducts, heroImage } from '../lib/products'
import ProductCard from '../components/ui/ProductCard'
import { PatternOverlay, StarPattern } from '../components/ui/IslamicPattern'
import { supabase } from '../lib/supabase'
import useInView from '../hooks/useInView'

export default function Homepage() {
  const [featured, setFeatured] = useState([])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [featuresRef, featuresInView] = useInView()
  const [bestsellersRef, bestsellersInView] = useInView()
  const [newsletterRef, newsletterInView] = useInView()

  useEffect(() => {
    getFeaturedProducts().then(setFeatured).catch(console.error)
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribing(true)
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email })
      if (error && error.code !== '23505') throw error
      setSubscribed(true)
      setEmail('')
    } catch (err) {
      alert('Failed to subscribe. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <div>
      <section className="relative h-[90vh] min-h-[600px] max-h-[850px] overflow-hidden bg-emerald-900">
        <img
          src={heroImage}
          alt="Knots by Fimihan"
          className="absolute inset-0 w-full h-full object-cover opacity-60 sm:opacity-75 scale-105 animate-float-slow"
        />
        <PatternOverlay opacity="0.06" className="text-gold-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/95 via-emerald-900/60 to-emerald-900/20" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col justify-center pb-20">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full w-fit mb-8 animate-fade-in-down" style={{ animationDelay: '100ms' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-gold-300 text-xs font-medium uppercase tracking-[0.15em] font-body">
              Islamic Modest Fashion
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight max-w-4xl animate-fade-in-down" style={{ animationDelay: '200ms' }}>
            Dress Modestly,<br />
            <span className="text-gold-400">Live Beautifully</span>
          </h1>
          <p className="text-cream-200 text-lg sm:text-xl mt-6 max-w-2xl font-body leading-relaxed animate-fade-in-down" style={{ animationDelay: '350ms' }}>
            Premium abayas, hijabs, and kaftans for the woman who values
            both her faith and her style. Thoughtfully curated, ethically sourced.
          </p>
          <div className="flex flex-wrap gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <Link
              to="/shop"
              className="bg-gold-500 text-white px-10 py-4 rounded-xl font-body font-medium hover:bg-gold-600 transition-all inline-flex items-center gap-2 text-lg shadow-xl shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Explore Collection <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="border-2 border-white/30 text-white px-10 py-4 rounded-xl font-body font-medium hover:bg-white/10 transition-all text-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Our Story
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-12 pt-8 border-t border-white/10 max-w-lg animate-fade-in-up" style={{ animationDelay: '650ms' }}>
            <div className="flex items-center gap-2 hover:text-gold-300 transition-colors">
              <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-cream-200 text-sm font-body">Premium Quality</span>
            </div>
            <div className="flex items-center gap-2 hover:text-gold-300 transition-colors">
              <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className="text-cream-200 text-sm font-body">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 hover:text-gold-300 transition-colors">
              <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-cream-200 text-sm font-body">Secure Checkout</span>
            </div>
          </div>
        </div>
      </section>

      <section ref={bestsellersRef} className="relative py-16 lg:py-24">
        <StarPattern opacity="0.03" />
        <div className={`relative max-w-7xl mx-auto px-4 lg:px-8 transition-all duration-700 ${bestsellersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold-500 text-sm font-medium uppercase tracking-[0.15em] font-body">Featured</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1C1C1C] dark:text-gray-200 mt-2">Bestsellers</h2>
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
              featured.map((product, i) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms`, animationPlayState: bestsellersInView ? 'running' : 'paused' }}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-[#6B6B6B] dark:text-gray-400 py-12">No featured products available.</p>
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

      <section ref={featuresRef} className="relative bg-emerald-50 dark:bg-gray-900 py-16 lg:py-24 overflow-hidden">
        <PatternOverlay opacity="0.03" className="text-emerald-600" />
        <div className={`relative max-w-7xl mx-auto px-4 lg:px-8 transition-all duration-700 delay-100 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`text-center lg:text-left transition-all duration-500 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '150ms' }}>
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mx-auto lg:mx-0 transition-transform hover:scale-110 hover:rotate-3 duration-300">
                <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg mt-4 text-[#1C1C1C] dark:text-gray-200">Premium Quality</h3>
              <p className="text-[#6B6B6B] dark:text-gray-400 text-sm mt-2 leading-relaxed">Hand-selected fabrics and meticulous craftsmanship in every piece.</p>
            </div>
            <div className={`text-center lg:text-left transition-all duration-500 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '300ms' }}>
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mx-auto lg:mx-0 transition-transform hover:scale-110 hover:rotate-3 duration-300">
                <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg mt-4 text-[#1C1C1C] dark:text-gray-200">Secure Payments</h3>
              <p className="text-[#6B6B6B] dark:text-gray-400 text-sm mt-2 leading-relaxed">Safe and convenient payment options for peace of mind.</p>
            </div>
            <div className={`text-center lg:text-left transition-all duration-500 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '450ms' }}>
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mx-auto lg:mx-0 transition-transform hover:scale-110 hover:rotate-3 duration-300">
                <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg mt-4 text-[#1C1C1C] dark:text-gray-200">Made with Love</h3>
              <p className="text-[#6B6B6B] dark:text-gray-400 text-sm mt-2 leading-relaxed">Each piece is thoughtfully designed with care and attention.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={newsletterRef} className="relative py-16 lg:py-24">
        <div className={`relative max-w-7xl mx-auto px-4 lg:px-8 transition-all duration-700 ${newsletterInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl overflow-hidden relative hover:shadow-2xl hover:shadow-emerald-900/30 transition-shadow duration-500">
            <PatternOverlay opacity="0.05" className="text-gold-500" />
            <div className="relative px-6 lg:px-16 py-12 lg:py-16 text-center">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">Join Our Community</h2>
              <p className="text-cream-200 mt-4 max-w-lg mx-auto font-body">
                Be the first to know about new collections, exclusive offers, and styling tips.
              </p>
              {subscribed ? (
                <p className="mt-8 text-cream-200 font-body">Thanks for subscribing! 🎉</p>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-5 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all"
                  />
                  <button type="submit" disabled={subscribing} className="bg-gold-500 text-white px-6 py-3 rounded-xl font-body font-medium hover:bg-gold-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all whitespace-nowrap disabled:opacity-50 sm:w-auto w-full">
                    {subscribing ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
