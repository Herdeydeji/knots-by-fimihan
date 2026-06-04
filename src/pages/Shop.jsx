import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ui/ProductGrid'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { getAllProducts } from '../lib/products'
import { CATEGORIES } from '../lib/constants'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    getAllProducts().then(setAllProducts).catch(() => setAllProducts([]))
  }, [])

  const activeCategory = searchParams.get('category') || ''
  const activeSort = searchParams.get('sort') || 'newest'

  let filtered = [...allProducts]

  if (activeCategory) {
    filtered = filtered.filter((p) => p.category === activeCategory)
  }

  if (priceRange.min) filtered = filtered.filter((p) => p.price >= Number(priceRange.min))
  if (priceRange.max) filtered = filtered.filter((p) => p.price <= Number(priceRange.max))

  switch (activeSort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      break
  }

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    setSearchParams(params)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'Shop', path: '' },
      ]} />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div>
              <h3 className="font-body font-semibold text-sm uppercase tracking-wider text-[#6B6B6B] mb-3">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !activeCategory ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-[#1C1C1C] hover:bg-cream-200'
                  }`}
                >
                  All Products
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize ${
                      activeCategory === cat.slug ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-[#1C1C1C] hover:bg-cream-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-body font-semibold text-sm uppercase tracking-wider text-[#6B6B6B] mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
                  className="input-field !py-2 text-sm w-full"
                />
                <span className="text-[#6B6B6B]">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
                  className="input-field !py-2 text-sm w-full"
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#6B6B6B] font-body">
              Showing <span className="font-medium text-[#1C1C1C]">{filtered.length}</span> products
            </p>
            <select
              value={activeSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="input-field !py-2 !w-auto text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>

          <ProductGrid products={filtered} emptyMessage="No products match your filters. Try adjusting them!" />
        </div>
      </div>
    </div>
  )
}
