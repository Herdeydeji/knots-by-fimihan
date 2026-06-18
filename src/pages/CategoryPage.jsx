import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductGrid from '../components/ui/ProductGrid'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { getProductsByCategory, categoryHeroImages } from '../lib/products'
import { CATEGORIES } from '../lib/constants'

export default function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const category = CATEGORIES.find((c) => c.slug === slug)
  const heroImage = categoryHeroImages[slug]

  useEffect(() => {
    if (slug) {
      setLoading(true)
      getProductsByCategory(slug).then(setProducts).catch(() => setError('Failed to load products')).finally(() => setLoading(false))
    }
  }, [slug])

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-display font-semibold text-emerald-600">Category not found</h1>
        <p className="text-[#6B6B6B] dark:text-gray-300 mt-2">The category you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="relative h-48 lg:h-64 bg-emerald-700 overflow-hidden">
        {heroImage && (
          <img src={heroImage} alt={category.name} className="w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white">{category.name}</h1>
            <p className="text-cream-200 font-body mt-2">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Shop', path: '/shop' },
          { label: category.name, path: '' },
        ]} />
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-cream-200 dark:border-gray-700 animate-pulse">
                <div className="aspect-[4/5] bg-cream-200 dark:bg-gray-700" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-cream-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-4 bg-cream-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="card py-16 text-center mt-6">
            <p className="text-red-500 font-body">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary mt-4 text-sm">Retry</button>
          </div>
        ) : (
          <ProductGrid products={products} emptyMessage={`No ${category.name.toLowerCase()} available yet. Check back soon!`} />
        )}
      </div>
    </div>
  )
}
