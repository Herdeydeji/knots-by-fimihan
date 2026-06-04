import { useState, useEffect } from 'react'
import { getAllOrders, updateFulfillmentStatus, getOrderById } from '../../lib/orders'
import { supabase } from '../../lib/supabase'
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineMail, HiOutlineX } from 'react-icons/hi'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-emerald-50 text-emerald-600',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
}

function formatPriceRaw(price) {
  return `₦${Number(price).toLocaleString()}`
}

function OrderDetailModal({ order, onClose, onAction }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-cream-200 flex items-center justify-between px-6 py-4">
          <h2 className="font-display font-semibold text-lg text-[#1C1C1C]">Order {order.order_number}</h2>
          <button onClick={onClose} className="p-1 hover:bg-cream-50 rounded-lg"><HiOutlineX className="w-5 h-5 text-[#6B6B6B]" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#6B6B6B]">Customer</p>
              <p className="text-sm font-medium text-[#1C1C1C]">{order.customer_name}</p>
              <p className="text-xs text-[#6B6B6B]">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B6B6B]">Payment</p>
              <p className={`text-sm font-medium capitalize ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>{order.payment_status}</p>
              <p className="text-xs text-[#6B6B6B]">{order.payment_reference}</p>
            </div>
          </div>

          {order.shipping_address && (
            <div>
              <p className="text-xs text-[#6B6B6B] mb-1">Shipping Address</p>
              <p className="text-sm text-[#1C1C1C]">
                {order.customer_name}<br />
                {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-[#6B6B6B] mb-2">Items</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-cream-200 overflow-hidden flex-shrink-0">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1C1C]">{item.name}</p>
                    <p className="text-xs text-[#6B6B6B]">{item.qty} x {formatPriceRaw(item.price)}{item.size && ` — Size ${item.size}`}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPriceRaw(item.qty * item.price)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-cream-200 pt-4 space-y-1 text-right">
            <p className="text-sm text-[#6B6B6B]">Subtotal: {formatPriceRaw(order.subtotal)}</p>
            <p className="text-sm text-[#6B6B6B]">Shipping: {order.shipping_fee > 0 ? formatPriceRaw(order.shipping_fee) : 'Free'}</p>
            <p className="text-lg font-bold text-emerald-600">Total: {formatPriceRaw(order.total)}</p>
          </div>

          {order.fulfillment_status === 'pending' && order.payment_status === 'paid' && (
            <div className="border-t border-cream-200 pt-4">
              <p className="text-xs text-[#6B6B6B] font-medium uppercase tracking-wider mb-3">Order Actions</p>
              <div className="flex gap-3">
                <button onClick={() => onAction('processing')} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                  <HiOutlineCheckCircle className="w-4 h-4" /> Confirm Order
                </button>
                <button onClick={() => onAction('cancelled')} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                  <HiOutlineXCircle className="w-4 h-4" /> Reject Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => {
    getAllOrders().then(setOrders).catch(() => setOrders([]))
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.fulfillment_status === filter)

  const handleAction = async (newStatus) => {
    if (!selectedOrder) return
    setActionLoading(true)
    setActionMsg('')
    try {
      await updateFulfillmentStatus(selectedOrder.id, newStatus)
      setOrders((prev) => prev.map((o) => o.id === selectedOrder.id ? { ...o, fulfillment_status: newStatus } : o))

      const emailHtml = newStatus === 'processing'
        ? `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#059669;padding:24px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:24px">Order Confirmed! ✅</h1>
            </div>
            <div style="padding:24px;background:#fff">
              <p style="color:#1C1C1C;font-size:16px">Hi <strong>${selectedOrder.customer_name}</strong>,</p>
              <p style="color:#6B6B6B">Great news! Your order <strong>${selectedOrder.order_number}</strong> has been confirmed and is now being processed.</p>
              <p style="color:#6B6B6B">We'll notify you once it ships. You can track your order status anytime.</p>
              <a href="https://w68hgqt4.insforge.site/orders" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:500;margin-top:8px">Track Order</a>
            </div>
            <div style="text-align:center;padding:16px;color:#9ca3af;font-size:12px">
              <p>Knots by Fimihan — Dress Modestly, Live Beautifully</p>
            </div>
          </div>`
        : `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#dc2626;padding:24px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:24px">Order Update</h1>
            </div>
            <div style="padding:24px;background:#fff">
              <p style="color:#1C1C1C;font-size:16px">Hi <strong>${selectedOrder.customer_name}</strong>,</p>
              <p style="color:#6B6B6B">Unfortunately, your order <strong>${selectedOrder.order_number}</strong> has been cancelled. If you have any questions, please contact us.</p>
              <a href="https://w68hgqt4.insforge.site/contact" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:500;margin-top:8px">Contact Us</a>
            </div>
            <div style="text-align:center;padding:16px;color:#9ca3af;font-size:12px">
              <p>Knots by Fimihan — Dress Modestly, Live Beautifully</p>
            </div>
          </div>`

      await supabase.from('email_queue').insert({
        to_email: selectedOrder.customer_email,
        subject: newStatus === 'processing'
          ? `Order Confirmed — ${selectedOrder.order_number}`
          : `Order Cancelled — ${selectedOrder.order_number}`,
        html_body: emailHtml,
        status: 'pending',
      })

      if (newStatus === 'processing') {
        await supabase.from('admin_notifications').insert({
          type: 'order_confirmed',
          title: 'Order Confirmed',
          message: `Order ${selectedOrder.order_number} was confirmed by admin`,
          link: '/admin/orders',
        })
      }

      setSelectedOrder(null)
      setActionMsg(newStatus === 'processing' ? 'Order confirmed! Email queued.' : 'Order rejected. Email queued.')
      setTimeout(() => setActionMsg(''), 3000)
    } catch (err) {
      setActionMsg('Failed to update order')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-emerald-600 mb-6">Orders</h1>

      {actionMsg && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium flex items-center gap-2">
          <HiOutlineMail className="w-4 h-4" /> {actionMsg}
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`chip text-xs capitalize ${
              filter === status
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-cream-300 text-[#6B6B6B] hover:border-emerald-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50">
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Order</th>
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Customer</th>
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Total</th>
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Payment</th>
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Status</th>
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="border-b border-cream-100 hover:bg-cream-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono text-sm font-medium text-[#1C1C1C]">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1C1C1C]">{order.customer_name}</p>
                    <p className="text-xs text-[#6B6B6B]">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-emerald-600">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[order.fulfillment_status] || 'bg-gray-50 text-gray-600'}`}>
                      {order.fulfillment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B6B6B]">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => !actionLoading && setSelectedOrder(null)}
          onAction={handleAction}
        />
      )}
    </div>
  )
}
