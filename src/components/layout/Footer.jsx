import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineMail } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { KBFLogo } from '../ui/IslamicPattern'
import { WHATSAPP_NUMBER, EMAIL } from '../../lib/constants'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../stores/useToast'

export default function Footer() {
  const addToast = useToast((s) => s.addToast)
  const [visible, setVisible] = useState(false)
  const sentinelRef = useRef(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0, rootMargin: '100px' }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
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
      addToast('Subscribed! 🎉', 'success')
    } catch (err) {
      addToast('Failed to subscribe. Please try again.', 'error')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <>
      <div ref={sentinelRef} className="h-px" />
      <footer className={`bg-emerald-600 text-white transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <KBFLogo light />
            <p className="text-cream-200 text-sm leading-relaxed mt-4">
              Curated Islamic modest fashion for the modern Nigerian woman.
              Dress modestly, live beautifully.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-cream-200 hover:text-gold-500 transition-colors" aria-label="WhatsApp">
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4 text-gold-400">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Shop All', path: '/shop' },
                { label: 'My Orders', path: '/orders' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-cream-200 hover:text-white transition-all text-sm hover:translate-x-0.5 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4 text-gold-400">Customer Service</h4>
            <ul className="space-y-3 text-sm text-cream-200">
              <li><a href="#" className="hover:text-white transition-colors">Shipping Information</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <FaWhatsapp className="w-4 h-4" /> WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4 text-gold-400">Newsletter</h4>
            <p className="text-cream-200 text-sm mb-4">Get notified about new drops, sales, and exclusive offers.</p>
            {subscribed ? (
              <p className="text-cream-200 text-sm">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                />
                <button type="submit" disabled={subscribing} className="bg-gold-500 text-white px-4 py-2.5 rounded-xl text-sm font-body font-medium hover:bg-gold-600 transition-all disabled:opacity-50 sm:w-auto w-full">
                  {subscribing ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-cream-300">
          <p>&copy; 2026 Knots by Fimihan. All rights reserved.</p>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-1 hover:text-white transition-colors">
            <HiOutlineMail className="w-4 h-4" /> {EMAIL}
          </a>
        </div>
      </div>
    </footer>
    </>
  )
}
