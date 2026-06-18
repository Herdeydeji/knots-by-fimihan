import { useState } from 'react'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { submitComplaint } from '../lib/notifications'
import { WHATSAPP_NUMBER, EMAIL, INSTAGRAM_HANDLE } from '../lib/constants'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await submitComplaint(form)
      setSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send message')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="relative h-48 lg:h-56 bg-gradient-to-r from-emerald-700 to-emerald-600 flex items-center justify-center">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white">Get in Touch</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Contact', path: '' },
        ]} />

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-display font-semibold text-emerald-600 mb-4">We'd Love to Hear from You</h2>
            <p className="text-[#6B6B6B] dark:text-gray-400 font-body leading-relaxed mb-8">
              Have a question, complaint, or feedback? We're here to help. Reach out via any of these channels.
            </p>

            <div className="space-y-4">
              {[
                { icon: FaWhatsapp, label: "WhatsApp", value: WHATSAPP_NUMBER, href: `https://wa.me/${WHATSAPP_NUMBER}` },
                { icon: HiOutlineMail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
                { icon: FaInstagram, label: "Instagram", value: INSTAGRAM_HANDLE, href: "https://instagram.com" },
                { icon: HiOutlineLocationMarker, label: "Location", value: "Lagos, Nigeria" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="card p-4 flex items-center gap-4 hover:border-emerald-600/20 dark:hover:border-emerald-600/40 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 ring-1 ring-emerald-600/20 dark:ring-emerald-800/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B6B6B] dark:text-gray-400 font-body">{item.label}</p>
                      <p className="font-body font-medium text-[#1C1C1C] dark:text-gray-200">{item.value}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          <div className="card p-6 lg:p-8">
            <h3 className="font-display font-semibold text-lg text-emerald-600 mb-4">Send us a Message</h3>
            {sent ? (
              <div className="text-center py-8">
                <p className="font-body text-emerald-600 font-medium">Message sent! We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Subject</label>
                  <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="What's this about?" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Message</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" placeholder="How can we help you?" />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
