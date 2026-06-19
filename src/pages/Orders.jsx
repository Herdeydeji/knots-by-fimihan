import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  HiOutlineClipboardList,
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineXCircle,
} from 'react-icons/hi'
import { useAuth } from '../lib/auth'
import { useToast } from '../stores/useToast'
import { getOrdersByEmail, updateFulfillmentStatus } from '../lib/orders'
import { supabase } from '../lib/supabase'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { useRealtimeSubscription } from '../hooks/useRealtime'

function formatPrice(price) {
  return `₦${Number(price).toLocaleString()}`
}

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-emerald-50 text-emerald-600',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
}

const statusOrder = ['pending', 'processing', 'shipped', 'delivered']

function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[status] || 'bg-gray-50 text-gray-600'}`}>
      {status}
    </span>
  )
}

function StatusTimeline({ currentStatus }) {
  const currentIndex = statusOrder.indexOf(currentStatus)
  const isCancelled = currentStatus === 'cancelled'

  return (
    <div className="flex items-center gap-1 py-2">
      {statusOrder.map((step, i) => {
        const isComplete = currentIndex >= i && !isCancelled
        const isCurrent = currentIndex === i && !isCancelled
        return (
          <div key={step} className="flex-1 flex items-center">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
              isComplete ? 'bg-emerald-500 text-white' : isCancelled ? 'bg-red-100 text-red-400' : 'bg-cream-200 dark:bg-gray-700 text-[#6B6B6B] dark:text-gray-400'
            }`}>
              {isComplete ? '✓' : isCurrent ? '●' : '○'}
            </div>
            {i < statusOrder.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${isComplete && currentIndex > i ? 'bg-emerald-500' : isCancelled ? 'bg-red-200' : 'bg-cream-200 dark:bg-gray-700'}`} />
            )}
          </div>
        )
      })}
      <div className="flex items-center gap-1">
        <span className={`text-[10px] capitalize font-medium ${isCancelled ? 'text-red-500' : 'text-[#6B6B6B] dark:text-gray-400'}`}>
          {isCancelled ? 'Cancelled' : statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)] || 'Pending'}
        </span>
      </div>
    </div>
  )
}

function OrderCard({ order, onCancel, cancelling }) {
  const [expanded, setExpanded] = useState(false)
  const isPending = order.fulfillment_status === 'pending'

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
              <span className="font-mono text-sm font-bold text-[#1C1C1C] dark:text-gray-200">{order.order_number}</span>
              <StatusBadge status={order.fulfillment_status} />
            </div>
            <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-1">
              {new Date(order.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="font-bold text-emerald-600">{formatPrice(order.total)}</span>
            {expanded ? <HiOutlineChevronUp className="w-4 h-4 text-[#6B6B6B] dark:text-gray-400" /> : <HiOutlineChevronDown className="w-4 h-4 text-[#6B6B6B] dark:text-gray-400" />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-cream-200 dark:border-gray-700 space-y-4">
          <StatusTimeline currentStatus={order.fulfillment_status} />

          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-lg bg-cream-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                  {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1C1C] dark:text-gray-200 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-[#6B6B6B] dark:text-gray-400">
                    {item.qty} x {formatPrice(item.price)}
                    {item.size && ` — Size ${item.size}`}
                  </p>
                </div>
                <span className="text-sm font-medium text-[#1C1C1C] dark:text-gray-200">{formatPrice(item.qty * item.price)}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400">Subtotal</p>
              <p className="font-medium">{formatPrice(order.subtotal)}</p>
            </div>
            <div>
                <p className="text-xs text-[#6B6B6B] dark:text-gray-400">Shipping</p>
              <p className="font-medium">{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : <span className="text-emerald-600">Free</span>}</p>
            </div>
            <div>
                <p className="text-xs text-[#6B6B6B] dark:text-gray-400">Payment</p>
              <p className={`font-medium capitalize ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>{order.payment_status}</p>
            </div>
            <div>
                <p className="text-xs text-[#6B6B6B] dark:text-gray-400">Delivery</p>
              <p className="font-medium capitalize">{order.fulfillment_status}</p>
            </div>
          </div>

          {order.shipping_address && (
            <div>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mb-1">Shipping To</p>
              <p className="text-sm text-[#1C1C1C] dark:text-gray-200">
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

          {isPending && (
            <div className="border-t border-cream-200 dark:border-gray-700 pt-3">
              <button
                onClick={() => { if (window.confirm('Are you sure you want to cancel this order?')) onCancel(order.id) }}
                disabled={cancelling}
                className="w-full flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
              >
                <HiOutlineXCircle className="w-5 h-5" />
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-2 text-center">You can cancel while the order is still pending.</p>
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
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    if (!user) return
    getOrdersByEmail(user.email)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [user])

  useRealtimeSubscription('orders', 'UPDATE', null, (payload) => {
    if (!user || payload.new.customer_email !== user.email) return
    setOrders((prev) => prev.map((o) => o.id === payload.new.id ? { ...o, ...payload.new } : o))
  })

  const addToast = useToast((s) => s.addToast)

  const handleCancel = async (orderId) => {
    setCancelling(orderId)
    try {
      await updateFulfillmentStatus(orderId, 'cancelled')
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, fulfillment_status: 'cancelled' } : o))
      addToast('Order cancelled', 'success')
    } catch (err) {
      addToast('Failed to cancel order', 'error')
    } finally {
      setCancelling(null)
    }
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold-100 flex items-center justify-center">
          <HiOutlineClipboardList className="w-8 h-8 text-gold-500" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#1C1C1C] dark:text-gray-200">Sign In Required</h2>
        <p className="text-[#6B6B6B] dark:text-gray-400 mt-2">Please sign in to view your orders.</p>
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
              <div className="h-5 bg-cream-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
              <div className="h-3 bg-cream-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center">
            <HiOutlineClipboardList className="w-8 h-8 text-[#6B6B6B] dark:text-gray-400" />
          </div>
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C] dark:text-gray-200">No Orders Yet</h2>
          <p className="text-[#6B6B6B] dark:text-gray-400 mt-2 font-body">You haven't placed any orders yet.</p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-body font-medium hover:bg-emerald-700 transition-colors">
            <HiOutlineShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={handleCancel} cancelling={cancelling === order.id} />
          ))}
        </div>
      )}
    </div>
  )
}
