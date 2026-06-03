import { useState } from 'react'
import { orders } from '../../lib/orders'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-emerald-50 text-emerald-600',
  delivered: 'bg-green-50 text-green-700',
}

export default function AdminOrders() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.fulfillmentStatus === filter)

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-emerald-600 mb-6">Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
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
                <tr key={order.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono text-sm font-medium text-[#1C1C1C]">{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1C1C1C]">{order.customerName}</p>
                    <p className="text-xs text-[#6B6B6B]">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-emerald-600">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[order.fulfillmentStatus]}`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B6B6B]">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
