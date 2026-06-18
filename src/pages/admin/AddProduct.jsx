import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineUpload, HiOutlinePlus, HiOutlineX } from 'react-icons/hi'
import { CATEGORIES } from '../../lib/constants'
import { supabase } from '../../lib/supabase'

export default function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: 'abayas',
    stock: '',
    material: '',
    occasion: '',
    hasSizes: true,
    sizes: [],
    hasColors: true,
    colors: [],
  })
  const [colorInput, setColorInput] = useState('#1A5C3A')
  const [submitted, setSubmitted] = useState(false)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSizeToggle = (size) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }))
  }
  const addColor = () => {
    if (!form.colors.includes(colorInput)) {
      setForm({ ...form, colors: [...form.colors, colorInput] })
    }
  }
  const removeColor = (hex) => {
    setForm({ ...form, colors: form.colors.filter((c) => c !== hex) })
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)
    const previews = files.map((f) => URL.createObjectURL(f))
    setImagePreviews(previews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    const imageUrls = []
    try {
      for (const file of imageFiles) {
        const ext = file.name.split('.').pop()
        const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
        imageUrls.push(publicUrl)
      }
    } catch (err) {
      alert('Error uploading images: ' + err.message)
      setUploading(false)
      return
    }

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const { error } = await supabase.from('products').insert([{
      name: form.name,
      slug,
      description: form.description,
      price: Number(form.price),
      compare_at_price: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      category: form.category,
      stock: Number(form.stock),
      material: form.material || null,
      occasion: form.occasion || null,
      sizes: form.hasSizes ? form.sizes : [],
      colors: form.hasColors ? form.colors : [],
      images: imageUrls,
      is_active: true,
      is_featured: false,
      tags: [form.category],
    }])
    if (error) {
      alert('Error: ' + error.message)
      setUploading(false)
      return
    }
    setSubmitted(true)
    setTimeout(() => navigate('/admin/products'), 1500)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display font-semibold text-emerald-600 mb-6">Add New Product</h1>

      {submitted ? (
        <div className="card p-8 text-center">
          <p className="font-body text-emerald-600 font-medium text-lg">Product added successfully!</p>
          <p className="text-sm text-[#6B6B6B] dark:text-gray-400 mt-2">Redirecting to products list...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Product Name</label>
            <input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Emerald Grace Abaya" />
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Description</label>
            <textarea name="description" required value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Full product description..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Price (₦)</label>
              <input name="price" type="number" required value={form.price} onChange={handleChange} className="input-field" placeholder="18500" />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Compare-at Price (₦)</label>
              <input name="compareAtPrice" type="number" value={form.compareAtPrice} onChange={handleChange} className="input-field" placeholder="22000 (optional)" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Stock</label>
              <input name="stock" type="number" required value={form.stock} onChange={handleChange} className="input-field" placeholder="25" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Material</label>
              <input name="material" value={form.material} onChange={handleChange} className="input-field" placeholder="Premium Chiffon" />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Occasion</label>
              <input name="occasion" value={form.occasion} onChange={handleChange} className="input-field" placeholder="Eid, Wedding Guest" />
            </div>
          </div>

          <div className="border-t border-cream-200 dark:border-gray-700 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={form.hasSizes} onChange={(e) => setForm({ ...form, hasSizes: e.target.checked, sizes: e.target.checked ? form.sizes : [] })} className="sr-only peer" />
                <div className="w-10 h-5 bg-cream-300 dark:bg-gray-600 rounded-full peer-checked:bg-emerald-600 transition-colors"></div>
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
              </div>
              <span className="text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200">Enable sizes for this product</span>
            </label>
          </div>

          {form.hasSizes && (
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Sizes</label>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 rounded-xl border text-sm font-body transition-all ${
                      form.sizes.includes(size)
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600'
                        : 'border-cream-300 dark:border-gray-600 text-[#6B6B6B] dark:text-gray-300 hover:border-emerald-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-cream-200 dark:border-gray-700 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={form.hasColors} onChange={(e) => setForm({ ...form, hasColors: e.target.checked })} className="sr-only peer" />
                <div className="w-10 h-5 bg-cream-300 dark:bg-gray-600 rounded-full peer-checked:bg-emerald-600 transition-colors"></div>
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
              </div>
              <span className="text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200">Enable colors for this product</span>
            </label>
          </div>

          {form.hasColors && (
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Colors</label>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {form.colors.map((hex) => (
                  <div key={hex} className="flex items-center gap-1 bg-cream-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                    <div className="w-5 h-5 rounded-full border border-cream-200 dark:border-gray-600" style={{ backgroundColor: hex }} />
                    <span className="text-xs font-body text-[#6B6B6B] dark:text-gray-400">{hex}</span>
                    <button type="button" onClick={() => removeColor(hex)} className="text-[#6B6B6B] dark:text-gray-400 hover:text-red-500 ml-1">
                      <HiOutlineX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input type="color" value={colorInput} onChange={(e) => setColorInput(e.target.value)} className="w-10 h-10 rounded-lg border border-cream-200 dark:border-gray-600 cursor-pointer bg-transparent p-0.5" />
                <input type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)} className="input-field flex-1 font-mono text-sm" placeholder="#1A5C3A" />
                <button type="button" onClick={addColor} className="bg-cream-200 dark:bg-gray-700 text-[#1C1C1C] dark:text-gray-200 hover:bg-cream-300 dark:hover:bg-gray-600 rounded-xl text-sm flex items-center gap-1 px-3 py-2 font-body font-medium transition-colors">
                  <HiOutlinePlus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Product Images</label>
            <label className="border-2 border-dashed border-cream-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-emerald-600 transition-colors cursor-pointer block">
              <HiOutlineUpload className="w-8 h-8 text-[#6B6B6B] dark:text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-[#6B6B6B] dark:text-gray-400">Click to browse images</p>
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-1">Supports JPG, PNG, WebP (max 5MB)</p>
              <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
            </label>
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {imagePreviews.map((url, i) => (
                  <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-cream-200 dark:border-gray-700">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={uploading} className="btn-primary w-full disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      )}
    </div>
  )
}
