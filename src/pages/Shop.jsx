import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi'
import ProductGrid from '../components/ui/ProductGrid'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { getAllProducts } from '../lib/products'
import { CATEGORIES } from '../lib/constants'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    getAllProducts().then(setAllProducts).catch(() => setError('Failed to load products')).finally(() => setLoading(false))
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

  const categoryIcons = ['🧕', '🧣', '👗', '👘', '👜']

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8 bg-cream-50 dark:bg-gray-950 min-h-[calc(100vh-16rem)]">
      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'Shop', path: '' },
      ]} />

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mt-4 mb-5">
        <button
          onClick={() => updateFilter('category', '')}
          className={`category-pill ${
            !activeCategory
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-gray-800 border border-cream-200 dark:border-gray-700 text-[#1C1C1C] dark:text-gray-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.slug}
            onClick={() => updateFilter('category', cat.slug)}
            className={`category-pill ${
              activeCategory === cat.slug
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-gray-800 border border-cream-200 dark:border-gray-700 text-[#1C1C1C] dark:text-gray-200'
            }`}
          >
            <span className="text-base">{categoryIcons[i]}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block lg:w-56 flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div>
              <h3 className="font-body font-semibold text-sm uppercase tracking-wider text-[#6B6B6B] dark:text-gray-300 mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
                  className="input-field !py-2 text-sm w-full"
                />
                <span className="text-[#6B6B6B] dark:text-gray-300">-</span>
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
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#6B6B6B] dark:text-gray-300 font-body">
              <span className="font-medium text-[#1C1C1C] dark:text-gray-200">{filtered.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 border border-cream-200 dark:border-gray-700 text-[#1C1C1C] dark:text-gray-200"
                aria-label="Filters"
                type="button"
              >
                <HiOutlineAdjustments className="w-4 h-4" />
              </button>
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
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-cream-200 dark:border-gray-700 animate-pulse">
                  <div className="aspect-[4/5] bg-cream-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-cream-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-4 bg-cream-200 dark:bg-gray-700 rounded w-2/3" />
                    <div className="h-4 bg-cream-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="card py-16 text-center">
              <p className="text-red-500 font-body">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary mt-4 text-sm">Retry</button>
            </div>
          ) : (
            <ProductGrid products={filtered} emptyMessage="No products match your filters. Try adjusting them!" />
          )}
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-cream-200 dark:border-gray-700">
              <h3 className="font-body font-semibold text-sm uppercase tracking-wider">Filters</h3>
              <button onClick={() => setFilterOpen(false)} aria-label="Close" type="button" className="p-1">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-body text-sm font-medium mb-2">Price Range</h4>
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
              <button onClick={() => setFilterOpen(false)} className="btn-primary w-full text-sm">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
