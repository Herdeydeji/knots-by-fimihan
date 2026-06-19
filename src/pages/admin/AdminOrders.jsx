import { useState, useEffect } from 'react'
import { getAllOrders, updateFulfillmentStatus, getOrderById } from '../../lib/orders'
import { supabase } from '../../lib/supabase'
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineMail, HiOutlineX, HiOutlineClipboardList, HiOutlineTruck, HiOutlineHome } from 'react-icons/hi'
import { useRealtimeSubscription } from '../../hooks/useRealtime'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

async function createUserNotification(customerEmail, type, title, message, link) {
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', customerEmail)
      .maybeSingle()
    if (!profiles?.id) return
    await supabase.rpc('create_user_notification', {
      p_user_id: profiles.id,
      p_type: type,
      p_title: title,
      p_message: message,
      p_link: link || null,
    })
  } catch {} // notification is a bonus
}

const SITE_URL = 'https://knotbyfimihan.netlify.app'

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

function OrderActionButtons({ order, onAction, actionLoading, onShip, showTrackingInput, setShowTrackingInput, trackingNumber, setTrackingNumber }) {
  if (order.fulfillment_status === 'delivered' || order.fulfillment_status === 'cancelled') {
    return null
  }

  if (order.fulfillment_status === 'pending' && order.payment_status === 'paid') {
    return (
      <div className="flex gap-3">
        <button onClick={() => onAction('processing')} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
          <HiOutlineCheckCircle className="w-4 h-4" /> {actionLoading ? 'Processing...' : 'Confirm Order'}
        </button>
        <button onClick={() => onAction('cancelled')} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50">
          <HiOutlineXCircle className="w-4 h-4" /> {actionLoading ? 'Processing...' : 'Reject Order'}
        </button>
      </div>
    )
  }

  if (order.fulfillment_status === 'processing') {
    return (
      <div className="space-y-3">
        {showTrackingInput ? (
          <div className="space-y-2">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (optional)"
              className="input-field text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => onShip(trackingNumber)} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
                <HiOutlineTruck className="w-4 h-4" /> {actionLoading ? 'Shipping...' : 'Mark as Shipped'}
              </button>
              <button onClick={() => setShowTrackingInput(false)} disabled={actionLoading} className="px-4 py-3 rounded-xl text-sm font-medium bg-cream-100 dark:bg-gray-700 text-[#6B6B6B] dark:text-gray-300 hover:bg-cream-200 dark:hover:bg-gray-600 transition-colors">
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setShowTrackingInput(true)} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
              <HiOutlineTruck className="w-4 h-4" /> Mark as Shipped
            </button>
            <button onClick={() => onAction('cancelled')} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50">
              <HiOutlineXCircle className="w-4 h-4" /> {actionLoading ? 'Processing...' : 'Cancel Order'}
            </button>
          </div>
        )}
      </div>
    )
  }

  if (order.fulfillment_status === 'shipped') {
    return (
      <div className="flex gap-3">
        <button onClick={() => onAction('delivered')} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
          <HiOutlineHome className="w-4 h-4" /> {actionLoading ? 'Processing...' : 'Mark as Delivered'}
        </button>
        <button onClick={() => onAction('cancelled')} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50">
          <HiOutlineXCircle className="w-4 h-4" /> {actionLoading ? 'Processing...' : 'Cancel Order'}
        </button>
      </div>
    )
  }

  return null
}

function OrderDetailModal({ order, onClose, onAction, onShip, actionLoading }) {
  const [showTrackingInput, setShowTrackingInput] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-cream-200 dark:border-gray-700 flex items-center justify-between px-6 py-4">
          <h2 className="font-display font-semibold text-lg text-[#1C1C1C] dark:text-gray-200">Order {order.order_number}</h2>
          <button onClick={onClose} className="p-1 hover:bg-cream-50 dark:hover:bg-gray-700 rounded-lg"><HiOutlineX className="w-5 h-5 text-[#6B6B6B] dark:text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400">Customer</p>
              <p className="text-sm font-medium text-[#1C1C1C] dark:text-gray-200">{order.customer_name}</p>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400">Payment</p>
              <p className={`text-sm font-medium capitalize ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>{order.payment_status}</p>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400">{order.payment_reference}</p>
            </div>
          </div>

          {order.shipping_address && (
            <div>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mb-1">Shipping Address</p>
              <p className="text-sm text-[#1C1C1C] dark:text-gray-200">
                {order.customer_name}<br />
                {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mb-2">Items</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-cream-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-cream-200 dark:bg-gray-600 overflow-hidden flex-shrink-0">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1C1C] dark:text-gray-200">{item.name}</p>
                    <p className="text-xs text-[#6B6B6B] dark:text-gray-400">{item.qty} x {formatPriceRaw(item.price)}{item.size && ` — Size ${item.size}`}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPriceRaw(item.qty * item.price)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-cream-200 dark:border-gray-700 pt-4 space-y-1 text-right">
            <p className="text-sm text-[#6B6B6B] dark:text-gray-400">Subtotal: {formatPriceRaw(order.subtotal)}</p>
            <p className="text-sm text-[#6B6B6B] dark:text-gray-400">Shipping: {order.shipping_fee > 0 ? formatPriceRaw(order.shipping_fee) : 'Free'}</p>
            <p className="text-lg font-bold text-emerald-600">Total: {formatPriceRaw(order.total)}</p>
          </div>

          <OrderActionButtons
            order={order}
            onAction={onAction}
            onShip={onShip}
            actionLoading={actionLoading}
            showTrackingInput={showTrackingInput}
            setShowTrackingInput={setShowTrackingInput}
            trackingNumber={trackingNumber}
            setTrackingNumber={setTrackingNumber}
          />
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

  useRealtimeSubscription('orders', 'INSERT', null, (payload) => {
    setOrders((prev) => [payload.new, ...prev])
  })

  useRealtimeSubscription('orders', 'UPDATE', null, (payload) => {
    setOrders((prev) => prev.map((o) => o.id === payload.new.id ? { ...o, ...payload.new } : o))
  })

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.fulfillment_status === filter)

  function emailTemplate({ customerName, orderNumber, heading, headingColor, bodyLines, ctaText, ctaUrl }) {
    return `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:${headingColor};padding:24px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">${heading}</h1>
      </div>
      <div style="padding:24px;background:#fff">
        <p style="color:#1C1C1C;font-size:16px">Hi <strong>${customerName}</strong>,</p>
        ${bodyLines.map(l => `<p style="color:#6B6B6B">${l}</p>`).join('')}
        <a href="${ctaUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:500;margin-top:8px">${ctaText}</a>
      </div>
      <div style="text-align:center;padding:16px;color:#9ca3af;font-size:12px">
        <p>Knots by Fimihan — Dress Modestly, Live Beautifully</p>
      </div>
    </div>`
  }

  async function sendEmailNotification(to, subject, html) {
    try {
      await supabase.functions.invoke('send-email', {
        body: { to, subject, html },
      })
    } catch (err) {
      console.error('send-email failed, falling back to queue:', err)
      await supabase.from('email_queue').insert({
        to_email: to,
        subject,
        html_body: html,
        status: 'pending',
      })
    }
  }

  const handleAction = async (newStatus) => {
    if (!selectedOrder) return
    setActionLoading(true)
    setActionMsg('')
    try {
      await updateFulfillmentStatus(selectedOrder.id, newStatus)
      setOrders((prev) => prev.map((o) => o.id === selectedOrder.id ? { ...o, fulfillment_status: newStatus } : o))

      const orderUrl = `${SITE_URL}/orders`
      let emailHtml, emailSubject, msgText, notifType

      switch (newStatus) {
        case 'processing':
          emailHtml = emailTemplate({
            customerName: selectedOrder.customer_name,
            orderNumber: selectedOrder.order_number,
            heading: 'Order Confirmed! ✅',
            headingColor: '#059669',
            bodyLines: [
              `Great news! Your order <strong>${selectedOrder.order_number}</strong> has been confirmed and is now being processed.`,
              "We'll notify you once it ships. You can track your order status anytime.",
            ],
            ctaText: 'Track Order',
            ctaUrl: orderUrl,
          })
          emailSubject = `Order Confirmed — ${selectedOrder.order_number}`
          msgText = 'Order confirmed! Email sent.'
          notifType = 'order_confirmed'
          break
        case 'shipped':
          emailHtml = emailTemplate({
            customerName: selectedOrder.customer_name,
            orderNumber: selectedOrder.order_number,
            heading: 'Your Order Has Shipped! 📦',
            headingColor: '#2563eb',
            bodyLines: [
              `Your order <strong>${selectedOrder.order_number}</strong> is on its way!`,
              selectedOrder.tracking_number
                ? `Tracking Number: <strong>${selectedOrder.tracking_number}</strong>`
                : 'Your package has been dispatched.',
              'You can track your delivery status on your orders page.',
            ],
            ctaText: 'Track Order',
            ctaUrl: orderUrl,
          })
          emailSubject = `Order Shipped — ${selectedOrder.order_number}`
          msgText = 'Marked as shipped! Email sent.'
          notifType = 'order_shipped'
          break
        case 'delivered':
          emailHtml = emailTemplate({
            customerName: selectedOrder.customer_name,
            orderNumber: selectedOrder.order_number,
            heading: 'Order Delivered! 🎉',
            headingColor: '#059669',
            bodyLines: [
              `Your order <strong>${selectedOrder.order_number}</strong> has been delivered.`,
              "We hope you love your pieces! If you have any questions, don't hesitate to reach out.",
              'Thank you for shopping with Knots by Fimihan!',
            ],
            ctaText: 'View Order',
            ctaUrl: orderUrl,
          })
          emailSubject = `Order Delivered — ${selectedOrder.order_number}`
          msgText = 'Marked as delivered! Email sent.'
          notifType = 'order_delivered'
          break
        case 'cancelled':
          emailHtml = emailTemplate({
            customerName: selectedOrder.customer_name,
            orderNumber: selectedOrder.order_number,
            heading: 'Order Update',
            headingColor: '#dc2626',
            bodyLines: [
              `Unfortunately, your order <strong>${selectedOrder.order_number}</strong> has been cancelled.`,
              'If you have any questions, please contact us.',
            ],
            ctaText: 'Contact Us',
            ctaUrl: `${SITE_URL}/contact`,
          })
          emailSubject = `Order Cancelled — ${selectedOrder.order_number}`
          msgText = 'Order cancelled. Email sent.'
          notifType = 'order_cancelled'
          break
      }

      if (emailHtml) {
        await sendEmailNotification(selectedOrder.customer_email, emailSubject, emailHtml)
      }

      if (notifType) {
        await supabase.from('admin_notifications').insert({
          type: notifType,
          title: `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
          message: `Order ${selectedOrder.order_number} was ${newStatus === 'processing' ? 'confirmed' : 'updated to ' + newStatus} by admin`,
          link: '/admin/orders',
        })
      }

      createUserNotification(
        selectedOrder.customer_email,
        newStatus === 'processing' ? 'order_confirmed' : `order_${newStatus}`,
        `Order ${newStatus === 'processing' ? 'Confirmed' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        `Your order ${selectedOrder.order_number} has been ${newStatus === 'processing' ? 'confirmed' : newStatus}.`,
        '/orders'
      )

      setSelectedOrder(null)
      setActionMsg(msgText)
      setTimeout(() => setActionMsg(''), 3000)
    } catch (err) {
      setActionMsg('Failed to update order')
    } finally {
      setActionLoading(false)
    }
  }

  const handleShip = async (trackingNumber) => {
    if (!selectedOrder) return
    setActionLoading(true)
    setActionMsg('')
    try {
      await updateFulfillmentStatus(selectedOrder.id, 'shipped', trackingNumber || undefined)
      setOrders((prev) => prev.map((o) => o.id === selectedOrder.id ? { ...o, fulfillment_status: 'shipped', tracking_number: trackingNumber } : o))

      const orderUrl = `${SITE_URL}/orders`
      const emailHtml = emailTemplate({
        customerName: selectedOrder.customer_name,
        orderNumber: selectedOrder.order_number,
        heading: 'Your Order Has Shipped! 📦',
        headingColor: '#2563eb',
        bodyLines: [
          `Your order <strong>${selectedOrder.order_number}</strong> is on its way!`,
          trackingNumber
            ? `Tracking Number: <strong>${trackingNumber}</strong>`
            : 'Your package has been dispatched.',
          'You can track your delivery status on your orders page.',
        ],
        ctaText: 'Track Order',
        ctaUrl: orderUrl,
      })

      await sendEmailNotification(
        selectedOrder.customer_email,
        `Order Shipped — ${selectedOrder.order_number}`,
        emailHtml,
      )

      await supabase.from('admin_notifications').insert({
        type: 'order_shipped',
        title: 'Order Shipped',
        message: `Order ${selectedOrder.order_number} was marked as shipped${trackingNumber ? ` (tracking: ${trackingNumber})` : ''}`,
        link: '/admin/orders',
      })

      createUserNotification(
        selectedOrder.customer_email,
        'order_shipped',
        'Order Shipped',
        `Your order ${selectedOrder.order_number} has been shipped!${trackingNumber ? ` Tracking: ${trackingNumber}` : ''}`,
        '/orders'
      )

      setSelectedOrder(null)
      setActionMsg('Marked as shipped! Email sent.')
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
                : 'bg-white dark:bg-gray-700 border border-cream-300 dark:border-gray-600 text-[#6B6B6B] dark:text-gray-300 hover:border-emerald-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
              <HiOutlineClipboardList className="w-10 h-10 text-[#6B6B6B] dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-[#1C1C1C] dark:text-gray-200">No Orders Yet</h3>
            <p className="text-[#6B6B6B] dark:text-gray-400 font-body mt-2 leading-relaxed">
              {filter === 'all' ? 'Orders will appear here once customers start purchasing.' : `No orders with status "${filter}".`}
            </p>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-200 dark:border-gray-700 bg-cream-50 dark:bg-gray-800">
                  <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B] dark:text-gray-400">Order</th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B] dark:text-gray-400">Customer</th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B] dark:text-gray-400">Total</th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B] dark:text-gray-400">Payment</th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B] dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B] dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="border-b border-cream-100 dark:border-gray-800 hover:bg-cream-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-sm font-medium text-[#1C1C1C] dark:text-gray-200">{order.order_number}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1C1C1C] dark:text-gray-200">{order.customer_name}</p>
                      <p className="text-xs text-[#6B6B6B] dark:text-gray-400">{order.customer_email}</p>
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
                    <td className="px-4 py-3 text-[#6B6B6B] dark:text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => !actionLoading && setSelectedOrder(null)}
          onAction={handleAction}
          onShip={handleShip}
          actionLoading={actionLoading}
        />
      )}
    </div>
  )
}
