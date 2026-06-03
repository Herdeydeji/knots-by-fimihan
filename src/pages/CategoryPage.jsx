import { useParams } from 'react-router-dom'
import ProductGrid from '../components/ui/ProductGrid'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { getProductsByCategory, categoryHeroImages } from '../lib/products'
import { CATEGORIES } from '../lib/constants'

export default function CategoryPage() {
  const { slug } = useParams()
  const category = CATEGORIES.find((c) => c.slug === slug)
  const products = getProductsByCategory(slug)
  const heroImage = categoryHeroImages[slug]

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-display font-semibold text-emerald-600">Category not found</h1>
        <p className="text-[#6B6B6B] mt-2">The category you're looking for doesn't exist.</p>
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
        <ProductGrid products={products} emptyMessage={`No ${category.name.toLowerCase()} available yet. Check back soon!`} />
      </div>
    </div>
  )
}
