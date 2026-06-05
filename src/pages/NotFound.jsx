import { Link } from 'react-router-dom'
import { HiOutlineArrowLeft } from 'react-icons/hi'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-cream-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl font-display font-bold text-emerald-600">404</span>
      </div>
      <h1 className="text-2xl font-display font-semibold text-emerald-600">Page Not Found</h1>
      <p className="text-[#6B6B6B] dark:text-gray-400 font-body mt-2 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2 mt-6">
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  )
}