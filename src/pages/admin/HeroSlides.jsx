import { useState, useEffect } from 'react'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlinePhotograph, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { getAdminHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide } from '../../lib/homepage'

const DEFAULT_SLIDE = {
  image_url: '',
  badge: '',
  heading_line1: '',
  heading_line2: '',
  description: '',
  cta_text: 'Shop Now',
  cta_link: '/shop',
  sort_order: 0,
  is_active: true,
}

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(DEFAULT_SLIDE)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    getAdminHeroSlides().then(setSlides).catch(() => setError('Failed to load slides')).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setForm({ ...DEFAULT_SLIDE, sort_order: slides.length })
    setEditing('new')
  }

  const openEdit = (slide) => {
    setForm({ ...slide })
    setEditing(slide.id)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing === 'new') {
        await createHeroSlide(form)
      } else {
        await updateHeroSlide(editing, form)
      }
      setEditing(null)
      load()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this slide?')) return
    try {
      await deleteHeroSlide(id)
      load()
    } catch {
      alert('Failed to delete')
    }
  }

  const toggleActive = async (slide) => {
    try {
      await updateHeroSlide(slide.id, { is_active: !slide.is_active })
      load()
    } catch {
      alert('Failed to update')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-semibold text-emerald-600">Hero Slides</h1>
        <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-sm">
          <HiOutlinePlus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <div className="card py-16 text-center">
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body">Loading slides...</p>
        </div>
      ) : slides.length === 0 && editing !== 'new' ? (
        <div className="card py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
            <HiOutlinePhotograph className="w-10 h-10 text-[#6B6B6B] dark:text-gray-400" />
          </div>
          <h3 className="text-xl font-display font-semibold text-[#1C1C1C] dark:text-gray-200">No Slides</h3>
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body mt-2">Add your first hero slide to display on the homepage.</p>
          <button onClick={openNew} className="btn-primary mt-6 inline-flex items-center gap-2 text-sm">
            <HiOutlinePlus className="w-4 h-4" /> Add Slide
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide) => (
            <div key={slide.id} className="card p-4 flex items-start gap-4">
              <div className="w-24 h-16 rounded-xl overflow-hidden bg-cream-100 dark:bg-gray-700 flex-shrink-0">
                <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-[#1C1C1C] dark:text-gray-200 truncate">
                    {slide.heading_line1} {slide.heading_line2}
                  </h3>
                  {!slide.is_active && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 font-medium">Hidden</span>
                  )}
                </div>
                <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-0.5 truncate">{slide.description}</p>
                <p className="text-[10px] text-gold-500 mt-0.5">{slide.badge} · {slide.cta_text} → {slide.cta_link}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(slide)} className="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-gray-700 text-[#6B6B6B] dark:text-gray-400 hover:text-emerald-600 transition-colors" title={slide.is_active ? 'Hide' : 'Show'}>
                  {slide.is_active ? <HiOutlineEye className="w-4 h-4" /> : <HiOutlineEyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(slide)} className="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-gray-700 text-[#6B6B6B] dark:text-gray-400 hover:text-emerald-600 transition-colors">
                  <HiOutlinePencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(slide.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-[#6B6B6B] dark:text-gray-400 hover:text-red-500 transition-colors">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-10 px-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-display font-semibold text-[#1C1C1C] dark:text-gray-200 mb-5">
              {editing === 'new' ? 'Add Hero Slide' : 'Edit Hero Slide'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">Image URL</label>
                <input name="image_url" required value={form.image_url} onChange={handleChange} className="input-field" placeholder="https://images.unsplash.com/..." />
              </div>
              {form.image_url && (
                <div className="w-full h-32 rounded-xl overflow-hidden bg-cream-100 dark:bg-gray-700">
                  <img src={form.image_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">Badge</label>
                  <input name="badge" value={form.badge} onChange={handleChange} className="input-field" placeholder="Islamic Modest Fashion" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">Sort Order</label>
                  <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">Heading Line 1</label>
                  <input name="heading_line1" value={form.heading_line1} onChange={handleChange} className="input-field" placeholder="Dress Modestly," />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">Heading Line 2</label>
                  <input name="heading_line2" value={form.heading_line2} onChange={handleChange} className="input-field" placeholder="Live Beautifully" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="input-field resize-none" placeholder="Premium abayas, hijabs, and kaftans..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">CTA Text</label>
                  <input name="cta_text" value={form.cta_text} onChange={handleChange} className="input-field" placeholder="Explore Collection" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">CTA Link</label>
                  <input name="cta_link" value={form.cta_link} onChange={handleChange} className="input-field" placeholder="/shop" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-cream-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm text-[#1C1C1C] dark:text-gray-200">Active</span>
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B6B6B] dark:text-gray-400 hover:bg-cream-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
                    {saving ? 'Saving...' : editing === 'new' ? 'Add Slide' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
