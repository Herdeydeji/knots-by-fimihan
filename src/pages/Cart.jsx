import { Link } from 'react-router-dom'
import { HiOutlineTrash, HiOutlineShoppingBag, HiOutlineArrowLeft } from 'react-icons/hi'
import { useCart } from '../hooks/useCart'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '../lib/constants'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shipping
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-cream-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
          <HiOutlineShoppingBag className="w-10 h-10 text-[#6B6B6B] dark:text-gray-400" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-emerald-600">Your Cart is Empty</h1>
        <p className="text-[#6B6B6B] dark:text-gray-400 font-body mt-2">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2 mt-6">
          <HiOutlineArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'Cart', path: '' },
      ]} />

      <h1 className="text-2xl lg:text-3xl font-display font-semibold text-emerald-600 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 border border-cream-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-cream-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gold-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-[#6B6B6B] dark:text-gray-400 font-body whitespace-nowrap">
                {subtotal >= FREE_SHIPPING_THRESHOLD
                  ? 'Free shipping!'
                  : `₦${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} to free shipping`}
              </span>
            </div>
          </div>

          {items.map((item) => (
            <div key={item.key} className="card p-4 flex gap-4">
              <Link to={`/product/${item.slug}`} className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden bg-cream-200 dark:bg-gray-700 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.slug}`}>
                  <h3 className="font-body font-medium text-[#1C1C1C] dark:text-gray-200 hover:text-emerald-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-[#6B6B6B] dark:text-gray-400 mt-1">
                  {item.size && `Size: ${item.size}`}{item.color && ` | Color: ${item.color}`}
                </p>
                <p className="font-body font-bold text-emerald-600 mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => item.quantity <= 1 ? removeItem(item.key) : updateQuantity(item.key, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-cream-300 dark:border-gray-600 flex items-center justify-center text-sm hover:bg-cream-100 dark:hover:bg-gray-700 text-[#1C1C1C] dark:text-gray-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-[#1C1C1C] dark:text-gray-200">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-cream-300 dark:border-gray-600 flex items-center justify-center text-sm hover:bg-cream-100 dark:hover:bg-gray-700 text-[#1C1C1C] dark:text-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="p-2 text-[#6B6B6B] dark:text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="font-body font-semibold text-[#1C1C1C] dark:text-gray-200 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B] dark:text-gray-400">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B] dark:text-gray-400">Shipping</span>
                <span className="font-medium">{shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(shipping)}</span>
              </div>
              <hr className="border-cream-200 dark:border-gray-700" />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-emerald-600">{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-gold w-full inline-flex items-center justify-center mt-6">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="block text-center text-sm text-[#6B6B6B] dark:text-gray-400 hover:text-emerald-600 mt-3 font-body transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
