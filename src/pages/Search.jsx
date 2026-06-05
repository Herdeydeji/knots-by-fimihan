import { useState } from 'react'
import { HiOutlineSearch, HiOutlineCube } from 'react-icons/hi'
import ProductGrid from '../components/ui/ProductGrid'
import { searchProducts } from '../lib/products'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    const r = await searchProducts(query)
    setResults(r)
    setSearched(true)
    setSearching(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 min-h-[60vh]">
      <h1 className="text-2xl lg:text-3xl font-display font-semibold text-emerald-600 mb-6">Search</h1>

      <form onSubmit={handleSearch} className="relative mb-8">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B] dark:text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, categories, occasions..."
          className="input-field !pl-12 !pr-20 !py-4 text-lg"
          autoFocus
        />
        <button type="submit" disabled={searching} className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
          {searching ? '...' : 'Search'}
        </button>
      </form>

      {!searched && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-2xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
              <HiOutlineSearch className="w-10 h-10 text-[#6B6B6B] dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-[#1C1C1C] dark:text-gray-200">Find What You Love</h3>
            <p className="text-[#6B6B6B] dark:text-gray-400 font-body mt-2 leading-relaxed">
              Search for your favorite abayas, hijabs, kaftans, and more.
            </p>
          </div>
        </div>
      )}

      {searching && (
        <div className="flex items-center justify-center min-h-[30vh]">
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body">Searching...</p>
        </div>
      )}

      {searched && !searching && (
        <div>
          <p className="text-sm text-[#6B6B6B] dark:text-gray-400 font-body mb-6">
            {results.length === 0
              ? `No results found for "${query}"`
              : `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
          </p>
          <ProductGrid products={results} emptyMessage="No products match your search. Try a different term!" />
        </div>
      )}
    </div>
  )
}
