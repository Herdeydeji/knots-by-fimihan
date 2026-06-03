import { useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import ProductGrid from '../components/ui/ProductGrid'
import { searchProducts } from '../lib/products'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    const r = searchProducts(query)
    setResults(r)
    setSearched(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-2xl lg:text-3xl font-display font-semibold text-emerald-600 mb-6">Search</h1>

      <form onSubmit={handleSearch} className="relative mb-8">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, categories, occasions..."
          className="input-field !pl-12 !py-4 text-lg"
          autoFocus
        />
      </form>

      {searched && (
        <div>
          <p className="text-sm text-[#6B6B6B] font-body mb-6">
            {results.length === 0
              ? `No results found for "${query}"`
              : `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
          </p>
          <ProductGrid products={results} emptyMessage="No products found. Try a different search term!" />
        </div>
      )}
    </div>
  )
}
