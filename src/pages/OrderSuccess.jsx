import { Link, useLocation, Navigate } from 'react-router-dom'
import { HiOutlineCheckCircle, HiOutlineShoppingBag, HiOutlineArrowLeft } from 'react-icons/hi'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

export default function OrderSuccess() {
  const location = useLocation()
  const { orderNumber, total } = location.state || {}

  if (!orderNumber) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="max-w-lg mx-auto px-4 lg:px-8 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
        <HiOutlineCheckCircle className="w-10 h-10 text-emerald-600" />
      </div>
      <h1 className="text-2xl lg:text-3xl font-display font-semibold text-emerald-600">Order Confirmed!</h1>
      <p className="text-[#6B6B6B] font-body mt-2">Thank you for your purchase.</p>

      <div className="card p-6 mt-8 text-left space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#6B6B6B]">Order Number</span>
          <span className="font-medium text-[#1C1C1C]">{orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B6B6B]">Total Paid</span>
          <span className="font-bold text-emerald-600">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B6B6B]">Payment Status</span>
          <span className="text-emerald-600 font-medium">Paid</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B6B6B]">Delivery Estimate</span>
          <span className="font-medium">3-7 business days</span>
        </div>
      </div>

      <p className="text-sm text-[#6B6B6B] font-body mt-6">
        A confirmation email has been sent. You'll receive shipping updates via email and WhatsApp.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <Link to="/shop" className="btn-primary inline-flex items-center justify-center gap-2">
          <HiOutlineShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
        <Link to="/" className="btn-ghost inline-flex items-center justify-center gap-2">
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  )
}
