import ProductCard from './ProductCard'

export default function ProductGrid({ products, emptyMessage = "No products found." }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-body text-[#6B6B6B]">{emptyMessage}</p>
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
