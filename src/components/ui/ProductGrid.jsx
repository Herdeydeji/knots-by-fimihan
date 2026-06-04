import { HiOutlineCube } from 'react-icons/hi'
import ProductCard from './ProductCard'

export default function ProductGrid({ products, emptyMessage = "No products found." }) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
            <HiOutlineCube className="w-10 h-10 text-gray-400 dark:text-gray-200" />
          </div>
          <h3 className="text-xl font-display font-semibold text-[#1C1C1C] dark:text-gray-200">No Products Available</h3>
          <p className="text-[#6B6B6B] font-body mt-2 leading-relaxed dark:text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
