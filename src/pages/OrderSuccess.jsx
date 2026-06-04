import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { HiOutlineCheckCircle, HiOutlineShoppingBag, HiOutlineClipboardList, HiOutlineSparkles } from 'react-icons/hi'
import { getOrderByReference, getOrderByNumber } from '../lib/orders'
import confetti from 'canvas-confetti'

function formatPrice(price) {
  return `₦${Number(price).toLocaleString()}`
}

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-emerald-50 text-emerald-600',
  delivered: 'bg-green-50 text-green-700',
}

export default function OrderSuccess() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const state = location.state || {}
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const referenceParam = searchParams.get('reference') || state.ref
  const confettiFired = useRef(false)

  useEffect(() => {
    if (state.orderNumber) {
      setOrder({ order_number: state.orderNumber, total: state.total })
      setLoading(false)
      return
    }

    if (referenceParam) {
      getOrderByReference(referenceParam)
        .then(setOrder)
        .catch(() =>
          getOrderByNumber(referenceParam).then(setOrder).catch(() => {
            setError('Could not load order details. Please check your My Orders page.')
          })
        )
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
      setError('No order information found.')
    }
  }, [state.orderNumber, state.total, referenceParam])

  useEffect(() => {
    if (order && !confettiFired.current) {
      confettiFired.current = true
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ['#059669', '#D4AF37', '#10B981', '#F59E0B'],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ['#059669', '#D4AF37', '#10B981', '#F59E0B'],
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
  }, [order])

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 lg:px-8 py-16 text-center">
        <div className="animate-pulse space-y-6">
          <div className="w-20 h-20 rounded-full bg-cream-200 mx-auto" />
          <div className="h-6 bg-cream-200 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-cream-200 rounded w-1/3 mx-auto" />
          <div className="card p-6 space-y-3">
            <div className="h-4 bg-cream-200 rounded w-3/4" />
            <div className="h-4 bg-cream-200 rounded w-1/2" />
            <div className="h-4 bg-cream-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <HiOutlineCheckCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-[#1C1C1C]">Payment Successful!</h1>
        <p className="text-[#6B6B6B] font-body mt-2">Your payment was successful.</p>
        <p className="text-sm text-[#6B6B6B] font-body mt-4 max-w-sm mx-auto">{error}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link to="/orders" className="btn-primary inline-flex items-center justify-center gap-2">
            <HiOutlineClipboardList className="w-4 h-4" /> View My Orders
          </Link>
          <Link to="/shop" className="btn-ghost inline-flex items-center justify-center gap-2">
            <HiOutlineShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 lg:px-8 py-16">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <HiOutlineSparkles className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-emerald-600">Payment Successful!</h1>
        <p className="text-[#6B6B6B] font-body mt-2">Thank you for your purchase.</p>
      </div>

      <div className="card p-6 mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#6B6B6B]">Order Number</span>
          <span className="font-mono font-bold text-[#1C1C1C]">{order.order_number}</span>
        </div>

        {order.items && order.items.length > 0 && (
          <>
            <hr className="border-cream-200" />
            <div>
              <p className="text-xs text-[#6B6B6B] mb-2 font-medium uppercase tracking-wider">Items</p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#1C1C1C]">
                      {item.name}
                      {item.size && <span className="text-[#6B6B6B]"> — {item.size}</span>}
                      <span className="text-[#6B6B6B]"> × {item.qty}</span>
                    </span>
                    <span className="font-medium">{formatPrice(item.qty * item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <hr className="border-cream-200" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B6B6B]">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B6B6B]">Shipping</span>
            <span>{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : <span className="text-emerald-600">Free</span>}</span>
          </div>
          <hr className="border-cream-200" />
          <div className="flex justify-between text-base">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-emerald-600">{formatPrice(order.total)}</span>
          </div>
        </div>

        <hr className="border-cream-200" />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-[#6B6B6B]">Payment</p>
            <p className={`font-medium capitalize ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>
              {order.payment_status || 'Paid'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#6B6B6B]">Delivery</p>
            <p className={`font-medium capitalize ${statusColors[order.fulfillment_status]?.split(' ')[1] || ''}`}>
              {order.fulfillment_status || 'Pending'}
            </p>
          </div>
        </div>

        {order.shipping_address && (
          <>
            <hr className="border-cream-200" />
            <div>
              <p className="text-xs text-[#6B6B6B] mb-1">Shipping To</p>
              <p className="text-sm text-[#1C1C1C]">
                {order.customer_name}<br />
                {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state}
              </p>
            </div>
          </>
        )}

        {order.tracking_number && (
          <>
            <hr className="border-cream-200" />
            <div className="bg-blue-50 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-600 font-medium">Tracking Number</p>
              <p className="text-sm font-mono text-blue-700">{order.tracking_number}</p>
            </div>
          </>
        )}
      </div>

      <p className="text-center text-sm text-[#6B6B6B] font-body mt-6">
        A confirmation email has been sent. You'll receive shipping updates via email and WhatsApp.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <Link to="/orders" className="btn-primary inline-flex items-center justify-center gap-2">
          <HiOutlineClipboardList className="w-4 h-4" /> View My Orders
        </Link>
        <Link to="/shop" className="btn-ghost inline-flex items-center justify-center gap-2">
          <HiOutlineShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  )
}
