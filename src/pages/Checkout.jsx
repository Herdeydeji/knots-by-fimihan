import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineLockClosed } from 'react-icons/hi'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../lib/auth'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '../lib/constants'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shipping
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      clearCart()
      setLoading(false)
      navigate('/order-success', { state: { orderNumber: `KBF-${Date.now()}`, total } })
    }, 1500)
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-[#1C1C1C]">Sign In Required</h2>
        <p className="text-[#6B6B6B] mt-2">Please sign in to proceed with checkout.</p>
        <button onClick={() => navigate('/login')} className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-xl font-body font-medium hover:bg-emerald-700 transition-colors">
          Sign In
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'Cart', path: '/cart' },
        { label: 'Checkout', path: '' },
      ]} />

      <h1 className="text-2xl lg:text-3xl font-display font-semibold text-emerald-600 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h3 className="font-body font-semibold text-[#1C1C1C] mb-4">Shipping Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body font-medium text-[#1C1C1C] mb-1.5">Full Name</label>
                <input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Aisha Mohammed" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] mb-1.5">Email</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="aisha@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] mb-1.5">Phone</label>
                  <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className="input-field" placeholder="+234 801 234 5678" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-[#1C1C1C] mb-1.5">Street Address</label>
                <input name="street" required value={form.street} onChange={handleChange} className="input-field" placeholder="15 Bourdillon Road" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] mb-1.5">City</label>
                  <input name="city" required value={form.city} onChange={handleChange} className="input-field" placeholder="Lagos" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] mb-1.5">State</label>
                  <input name="state" required value={form.state} onChange={handleChange} className="input-field" placeholder="Lagos" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full inline-flex items-center justify-center gap-2 text-base py-4"
          >
            <HiOutlineLockClosed className="w-5 h-5" />
            {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
          </button>
          <p className="text-xs text-center text-[#6B6B6B] font-body">
            Secure payment powered by Paystack. Your information is encrypted and secure.
          </p>
        </form>

        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h3 className="font-body font-semibold text-[#1C1C1C] mb-4">Order Summary</h3>
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={`${item.id}-${item.size}-${item.color}-${i}`} className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-cream-200 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-[#1C1C1C] line-clamp-1">{item.name}</p>
                    <p className="text-xs text-[#6B6B6B]">Qty: {item.quantity}</p>
                    <p className="text-sm font-body font-bold text-emerald-600">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="border-cream-200 my-4" />
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(shipping)}</span>
              </div>
              <hr className="border-cream-200" />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-emerald-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
