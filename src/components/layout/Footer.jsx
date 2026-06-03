import { Link } from 'react-router-dom'
import { HiOutlineMail } from 'react-icons/hi'
import { FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa'
import { KBFLogo } from '../ui/IslamicPattern'
import { WHATSAPP_NUMBER, EMAIL } from '../../lib/constants'

export default function Footer() {
  return (
    <footer className="bg-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <KBFLogo className="!text-white [&_span]:!text-white" />
            <p className="text-cream-200 text-sm leading-relaxed mt-4">
              Curated Islamic modest fashion for the modern Nigerian woman.
              Dress modestly, live beautifully.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-cream-200 hover:text-gold-500 transition-colors" aria-label="Instagram">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-cream-200 hover:text-gold-500 transition-colors" aria-label="WhatsApp">
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-cream-200 hover:text-gold-500 transition-colors" aria-label="TikTok">
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4 text-gold-400">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Shop All', path: '/shop' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-cream-200 hover:text-white transition-colors text-sm">
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
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              />
              <button type="submit" className="bg-gold-500 text-white px-4 py-2.5 rounded-xl text-sm font-body font-medium hover:bg-gold-600 transition-all">
                Subscribe
              </button>
            </form>
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
  )
}
