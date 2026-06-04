import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi'
import { getAdminProducts, deleteProduct } from '../../lib/products'

function formatPrice(price) {
  return `₦${price.toLocaleString()}`
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAdminProducts().then(setProducts).catch(() => setProducts([]))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this product?')) return
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-semibold text-emerald-600">Products</h1>
        <Link to="/admin/products/new" className="btn-primary inline-flex items-center gap-2 text-sm">
          <HiOutlinePlus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="relative mb-6">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field !pl-10 !py-2.5 text-sm"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50">
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Product</th>
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Category</th>
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Price</th>
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Stock</th>
                <th className="text-left px-4 py-3 font-body font-semibold text-[#6B6B6B]">Status</th>
                <th className="text-right px-4 py-3 font-body font-semibold text-[#6B6B6B]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cream-200 overflow-hidden flex-shrink-0">
                        <img src={product.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-body font-medium text-[#1C1C1C] line-clamp-1">{product.name}</p>
                        <p className="text-xs text-[#6B6B6B]">{product.id?.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-[#6B6B6B]">{product.category}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock < 5 ? 'text-red-500' : 'text-emerald-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-cream-100 text-[#6B6B6B] hover:text-emerald-600 transition-colors">
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#6B6B6B] hover:text-red-500 transition-colors">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
