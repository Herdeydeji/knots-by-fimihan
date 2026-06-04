import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineCube, HiOutlineClipboardList, HiOutlineCurrencyDollar, HiOutlineExclamationCircle } from 'react-icons/hi'
import { getOrderStats, getAllOrders } from '../../lib/orders'
import { getAdminProducts } from '../../lib/products'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, paidOrders: 0 })
  const [products, setProducts] = useState([])
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    Promise.all([
      getOrderStats(),
      getAdminProducts(),
      getAllOrders(),
    ]).then(([s, p, o]) => {
      setStats(s)
      setProducts(p)
      setRecentOrders(o.slice(0, 5))
    }).catch(console.error)
  }, [])

  const lowStock = products.filter((p) => p.stock < 5 && p.stock > 0)
  const outOfStock = products.filter((p) => p.stock === 0)

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: HiOutlineClipboardList, color: 'bg-blue-50 text-blue-600' },
    { label: 'Revenue', value: formatPrice(stats.totalRevenue), icon: HiOutlineCurrencyDollar, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending', value: stats.pendingOrders, icon: HiOutlineExclamationCircle, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Products', value: products.filter((p) => p.is_active).length, icon: HiOutlineCube, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-emerald-600 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          return (
                <div key={card.label} className="card p-4 lg:p-6">
                  <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">{card.value}</p>
                  <p className="text-sm text-[#6B6B6B] dark:text-gray-400 font-body">{card.label}</p>
                </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-body font-semibold text-[#1C1C1C] dark:text-gray-200">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-emerald-600 hover:text-emerald-700 font-body">View All</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-cream-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <p className="text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200">{order.order_number}</p>
                  <p className="text-xs text-[#6B6B6B] dark:text-gray-400">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-body font-bold text-emerald-600">{formatPrice(order.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.fulfillment_status === 'shipped' ? 'bg-emerald-50 text-emerald-600' :
                    order.fulfillment_status === 'processing' ? 'bg-blue-50 text-blue-600' :
                    'bg-yellow-50 text-yellow-600'
                  }`}>
                    {order.fulfillment_status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-body font-semibold text-[#1C1C1C] dark:text-gray-200 mb-4">Inventory Alerts</h3>
          {lowStock.length === 0 && outOfStock.length === 0 ? (
            <p className="text-sm text-[#6B6B6B] dark:text-gray-400 font-body">All products are well-stocked.</p>
          ) : (
            <div className="space-y-3">
              {outOfStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/30">
                  <p className="text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200">{p.name}</p>
                  <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                </div>
              ))}
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/30">
                  <p className="text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200">{p.name}</p>
                  <span className="text-xs text-yellow-600 font-medium">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
