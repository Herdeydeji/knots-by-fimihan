import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HiOutlineLockClosed, HiOutlineSparkles, HiOutlineCheck } from 'react-icons/hi'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../lib/auth'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { PAYSTACK_PUBLIC_KEY, calculateShipping } from '../lib/constants'
import { supabase } from '../lib/supabase'

const STEPS = [
  { label: 'Cart', path: '/cart' },
  { label: 'Shipping', path: '' },
  { label: 'Payment', path: '' },
  { label: 'Confirm', path: '' },
]

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

export default function Checkout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
  })
  const [loading, setLoading] = useState(false)
  const [stockError, setStockError] = useState(null)
  const [stockChecking, setStockChecking] = useState(false)
  const [processingRedirect, setProcessingRedirect] = useState(false)
  const paidRef = useRef(false)
  const shipping = calculateShipping(subtotal, form.state)
  const total = subtotal + shipping.fee

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    if (!reference) return

    const saved = sessionStorage.getItem('kbf-checkout-pending')
    if (!saved) return

    sessionStorage.removeItem('kbf-checkout-pending')

    const checkoutData = JSON.parse(saved)
    setProcessingRedirect(true)

    supabase.functions.invoke('verify-payment', {
      body: { reference, ...checkoutData },
    })
      .then(({ data, error }) => {
        if (error) throw error
        paidRef.current = true
        useCart.getState().clearCart()
        navigate(`/order-success?reference=${reference}`, {
          state: { orderNumber: data.order_number, total: checkoutData.total, subtotal: checkoutData.subtotal, shipping_fee: checkoutData.shipping_fee },
        })
      })
      .catch((err) => {
        console.error('Payment verification error:', err)
        navigate(`/order-success?reference=${reference}`, { state: { error: true, ref: reference } })
      })
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePaystackCallback = (response) => {
    supabase.functions.invoke('verify-payment', {
      body: {
        reference: response.reference,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: {
          street: form.street,
          city: form.city,
          state: form.state,
          country: 'Nigeria',
        },
        items: items.map((item) => ({
          product_id: item.id,
          name: item.name,
          image: item.image,
          size: item.size,
          color: item.color,
          qty: item.quantity,
          price: item.price,
        })),
        subtotal,
        shipping_fee: shipping.fee,
        total,
      },
    })
      .then(({ data, error }) => {
        if (error) throw error
        paidRef.current = true
        clearCart()
        setLoading(false)
        navigate(`/order-success?reference=${response.reference}`, { state: { orderNumber: data.order_number, total, subtotal, shipping_fee: shipping.fee } })
      })
      .catch((err) => {
        console.error('Payment verification error:', err)
        setLoading(false)
        const ref = response.reference
        navigate(`/order-success?reference=${ref}`, { state: { error: true, ref } })
      })
  }

  const payWithPaystack = async () => {
    if (!window.PaystackPop) {
      alert('Payment system loading. Please try again.')
      return
    }

    setStockError(null)
    setStockChecking(true)
    const ids = [...new Set(items.map((i) => i.id))]
    const { data: stockData, error: stockFetchErr } = await supabase
      .from('products')
      .select('id, stock, name')
      .in('id', ids)
    setStockChecking(false)
    if (stockFetchErr) {
      console.error('Stock check error:', stockFetchErr)
    } else {
      const stockMap = Object.fromEntries((stockData || []).map((p) => [p.id, p]))
      const issues = items
        .filter((item) => {
          const db = stockMap[item.id]
          return db && db.stock < item.quantity
        })
        .map((item) => ({
          name: item.name,
          available: stockMap[item.id].stock,
          requested: item.quantity,
        }))
      if (issues.length > 0) {
        setStockError(issues)
        return
      }
    }

    setLoading(true)

    sessionStorage.setItem('kbf-checkout-pending', JSON.stringify({
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      shipping_address: {
        street: form.street,
        city: form.city,
        state: form.state,
        country: 'Nigeria',
      },
      items: items.map((item) => ({
        product_id: item.id,
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
        qty: item.quantity,
        price: item.price,
      })),
      subtotal,
      shipping_fee: shipping.fee,
      total,
    }))

    try {
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: total * 100,
        currency: 'NGN',
        ref: `KBF-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: form.name },
            { display_name: 'Phone', variable_name: 'customer_phone', value: form.phone },
          ],
        },
        callback: handlePaystackCallback,
        onClose: () => { setLoading(false)
          sessionStorage.removeItem('kbf-checkout-pending') },
      })

      handler.openIframe()
    } catch (err) {
      console.error('Paystack error:', err)
      setLoading(false)
      sessionStorage.removeItem('kbf-checkout-pending')
      alert('Payment could not be opened. Please check that popups are allowed and try again.')
    }
  }

  if (processingRedirect) {
    return (
      <div className="max-w-lg mx-auto px-4 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-6">
          <HiOutlineSparkles className="w-10 h-10 text-emerald-600 animate-pulse" />
        </div>
        <h2 className="font-display text-2xl font-bold text-emerald-600">Payment Confirmed!</h2>
        <p className="text-[#6B6B6B] dark:text-gray-400 mt-2">Verifying your payment and creating your order...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-[#1C1C1C] dark:text-gray-200">Sign In Required</h2>
        <p className="text-[#6B6B6B] dark:text-gray-400 mt-2">Please sign in to proceed with checkout.</p>
        <button onClick={() => navigate('/login')} className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-xl font-body font-medium hover:bg-emerald-700 transition-colors">
          Sign In
        </button>
      </div>
    )
  }

  if (items.length === 0 && !paidRef.current && !processingRedirect) {
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

      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium ${
              i < 2 ? 'bg-emerald-600 text-white' : 'bg-cream-200 dark:bg-gray-700 text-[#6B6B6B] dark:text-gray-400'
            }`}>
              {i < 2 ? <HiOutlineCheck className="w-3 h-3" /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && <span className="text-cream-300 dark:text-gray-600 text-xs">——</span>}
          </div>
        ))}
      </div>

      <h1 className="text-2xl lg:text-3xl font-display font-semibold text-emerald-600 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        <form onSubmit={(e) => { e.preventDefault(); payWithPaystack() }} className="lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h3 className="font-body font-semibold text-[#1C1C1C] dark:text-gray-200 mb-4">Shipping Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Full Name</label>
                <input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Aisha Mohammed" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Email</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="aisha@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Phone</label>
                  <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className="input-field" placeholder="+234 801 234 5678" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Street Address</label>
                <input name="street" required value={form.street} onChange={handleChange} className="input-field" placeholder="15 Bourdillon Road" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">City</label>
                  <input name="city" required value={form.city} onChange={handleChange} className="input-field" placeholder="Lagos" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">State</label>
                  <input name="state" required value={form.state} onChange={handleChange} className="input-field" placeholder="Lagos" />
                </div>
              </div>
            </div>
          </div>

          {stockError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                Stock changed — please review your cart
              </p>
              <ul className="space-y-1">
                {stockError.map((issue, i) => (
                  <li key={i} className="text-xs text-red-600 dark:text-red-300">
                    {issue.name}: only {issue.available} available, you have {issue.requested} in cart
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="submit"
            disabled={loading || stockChecking}
            className="btn-gold w-full inline-flex items-center justify-center gap-2 text-base py-4"
          >
            <HiOutlineLockClosed className="w-5 h-5" />
            {stockChecking ? 'Checking stock...' : loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
          </button>
          <p className="text-xs text-center text-[#6B6B6B] dark:text-gray-400 font-body">
            Secure payment powered by Paystack. Your information is encrypted and secure.
          </p>
        </form>

        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h3 className="font-body font-semibold text-[#1C1C1C] dark:text-gray-200 mb-4">Order Summary</h3>
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={`${item.id}-${item.size}-${item.color}-${i}`} className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-cream-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-[#6B6B6B] dark:text-gray-400">Qty: {item.quantity}</p>
                    <p className="text-sm font-body font-bold text-emerald-600">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="border-cream-200 dark:border-gray-700 my-4" />
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B] dark:text-gray-400">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B] dark:text-gray-400">Shipping</span>
                <span>{shipping.free ? <span className="text-emerald-600">Free</span> : formatPrice(shipping.fee)}</span>
              </div>
              <hr className="border-cream-200 dark:border-gray-700" />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-emerald-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-cream-200 dark:border-gray-700 p-3 lg:hidden z-40 safe-bottom">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#6B6B6B] dark:text-gray-400 font-body">Total</span>
            <p className="font-bold text-emerald-600">{formatPrice(total)}</p>
          </div>
          <button
            onClick={payWithPaystack}
            disabled={loading || stockChecking}
            className="btn-gold text-sm inline-flex items-center gap-2 py-2.5"
          >
            <HiOutlineLockClosed className="w-4 h-4" />
            {stockChecking ? 'Checking...' : loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
