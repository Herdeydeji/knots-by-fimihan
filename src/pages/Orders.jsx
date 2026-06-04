import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  HiOutlineClipboardList,
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
} from 'react-icons/hi'
import { useAuth } from '../lib/auth'
import { getOrdersByEmail } from '../lib/orders'
import Breadcrumbs from '../components/ui/Breadcrumbs'

function formatPrice(price) {
  return `₦${Number(price).toLocaleString()}`
}

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-emerald-50 text-emerald-600',
  delivered: 'bg-green-50 text-green-700',
}

function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[status] || 'bg-gray-50 text-gray-600'}`}>
      {status}
    </span>
  )
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card p-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
        type="button"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-sm font-bold text-[#1C1C1C]">{order.order_number}</span>
              <StatusBadge status={order.fulfillment_status} />
            </div>
            <p className="text-xs text-[#6B6B6B] mt-1">
              {new Date(order.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="font-bold text-emerald-600">{formatPrice(order.total)}</span>
            {expanded ? <HiOutlineChevronUp className="w-4 h-4 text-[#6B6B6B]" /> : <HiOutlineChevronDown className="w-4 h-4 text-[#6B6B6B]" />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-cream-200 space-y-4">
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-lg bg-cream-200 overflow-hidden flex-shrink-0">
                  {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1C1C] line-clamp-1">{item.name}</p>
                  <p className="text-xs text-[#6B6B6B]">
                    {item.qty} x {formatPrice(item.price)}
                    {item.size && ` — Size ${item.size}`}
                  </p>
                </div>
                <span className="text-sm font-medium text-[#1C1C1C]">{formatPrice(item.qty * item.price)}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[#6B6B6B]">Subtotal</p>
              <p className="font-medium">{formatPrice(order.subtotal)}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B6B6B]">Shipping</p>
              <p className="font-medium">{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : <span className="text-emerald-600">Free</span>}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B6B6B]">Payment</p>
              <p className={`font-medium capitalize ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>{order.payment_status}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B6B6B]">Delivery</p>
              <p className="font-medium capitalize">{order.fulfillment_status}</p>
            </div>
          </div>

          {order.shipping_address && (
            <div>
              <p className="text-xs text-[#6B6B6B] mb-1">Shipping To</p>
              <p className="text-sm text-[#1C1C1C]">
                {order.customer_name}<br />
                {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state}
              </p>
            </div>
          )}

          {order.tracking_number && (
            <div className="bg-blue-50 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-600 font-medium">Tracking Number</p>
              <p className="text-sm font-mono text-blue-700">{order.tracking_number}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getOrdersByEmail(user.email)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold-100 flex items-center justify-center">
          <HiOutlineClipboardList className="w-8 h-8 text-gold-500" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#1C1C1C]">Sign In Required</h2>
        <p className="text-[#6B6B6B] mt-2">Please sign in to view your orders.</p>
        <button onClick={() => navigate('/login')} className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-xl font-body font-medium hover:bg-emerald-700 transition-colors">
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'My Orders', path: '' },
      ]} />

      <h1 className="text-2xl lg:text-3xl font-display font-semibold text-emerald-600 mb-8">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 bg-cream-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-cream-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-200 flex items-center justify-center">
            <HiOutlineClipboardList className="w-8 h-8 text-[#6B6B6B]" />
          </div>
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C]">No Orders Yet</h2>
          <p className="text-[#6B6B6B] mt-2 font-body">You haven't placed any orders yet.</p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-body font-medium hover:bg-emerald-700 transition-colors">
            <HiOutlineShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
