import { useState, useEffect } from 'react'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineTemplate, HiOutlineEye, HiOutlineEyeOff, HiOutlineTag, HiOutlineTruck, HiOutlineSparkles, HiOutlineShoppingBag, HiOutlineGift, HiOutlineStar, HiOutlineFire } from 'react-icons/hi'
import { getAdminAdvertisements, createAdvertisement, updateAdvertisement, deleteAdvertisement } from '../../lib/homepage'
import { useToast } from '../../stores/useToast'

const ICON_OPTIONS = [
  { label: 'Tag', value: 'HiOutlineTag', icon: HiOutlineTag },
  { label: 'Truck', value: 'HiOutlineTruck', icon: HiOutlineTruck },
  { label: 'Sparkles', value: 'HiOutlineSparkles', icon: HiOutlineSparkles },
  { label: 'Shopping Bag', value: 'HiOutlineShoppingBag', icon: HiOutlineShoppingBag },
  { label: 'Gift', value: 'HiOutlineGift', icon: HiOutlineGift },
  { label: 'Star', value: 'HiOutlineStar', icon: HiOutlineStar },
  { label: 'Fire', value: 'HiOutlineFire', icon: HiOutlineFire },
]

function IconPreview({ iconName, className }) {
  const opt = ICON_OPTIONS.find((o) => o.value === iconName)
  if (!opt) return <HiOutlineTag className={className} />
  const Icon = opt.icon
  return <Icon className={className} />
}

const DEFAULT_AD = {
  title: '',
  description: '',
  cta_text: 'Shop Now',
  cta_link: '/shop',
  icon_name: 'HiOutlineTag',
  sort_order: 0,
  is_active: true,
}

export default function AdminAdvertisements() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(DEFAULT_AD)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const addToast = useToast((s) => s.addToast)

  const load = () => {
    setLoading(true)
    getAdminAdvertisements().then(setAds).catch(() => setError('Failed to load ads')).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setForm({ ...DEFAULT_AD, sort_order: ads.length })
    setEditing('new')
  }

  const openEdit = (ad) => {
    setForm({ ...ad })
    setEditing(ad.id)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing === 'new') {
        await createAdvertisement(form)
      } else {
        await updateAdvertisement(editing, form)
      }
      setEditing(null)
      load()
    } catch (err) {
      addToast('Error: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this advertisement?')) return
    try {
      await deleteAdvertisement(id)
      load()
    } catch {
      addToast('Failed to delete advertisement', 'error')
    }
  }

  const toggleActive = async (ad) => {
    try {
      await updateAdvertisement(ad.id, { is_active: !ad.is_active })
      load()
    } catch {
      addToast('Failed to update advertisement', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-semibold text-emerald-600">Advertisements</h1>
        <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-sm">
          <HiOutlinePlus className="w-4 h-4" /> Add Ad
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <div className="card py-16 text-center">
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body">Loading ads...</p>
        </div>
      ) : ads.length === 0 && editing !== 'new' ? (
        <div className="card py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
            <HiOutlineTemplate className="w-10 h-10 text-[#6B6B6B] dark:text-gray-400" />
          </div>
          <h3 className="text-xl font-display font-semibold text-[#1C1C1C] dark:text-gray-200">No Advertisements</h3>
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body mt-2">Add promotional ads to display on the homepage.</p>
          <button onClick={openNew} className="btn-primary mt-6 inline-flex items-center gap-2 text-sm">
            <HiOutlinePlus className="w-4 h-4" /> Add Ad
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div key={ad.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center flex-shrink-0">
                <IconPreview iconName={ad.icon_name} className="w-5 h-5 text-gold-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-[#1C1C1C] dark:text-gray-200">{ad.title}</h3>
                  {!ad.is_active && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 font-medium">Hidden</span>
                  )}
                </div>
                <p className="text-xs text-[#6B6B6B] dark:text-gray-400 truncate">{ad.description}</p>
                <p className="text-[10px] text-gold-500 mt-0.5">{ad.cta_text} → {ad.cta_link}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(ad)} className="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-gray-700 text-[#6B6B6B] dark:text-gray-400 hover:text-emerald-600 transition-colors" title={ad.is_active ? 'Hide' : 'Show'}>
                  {ad.is_active ? <HiOutlineEye className="w-4 h-4" /> : <HiOutlineEyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(ad)} className="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-gray-700 text-[#6B6B6B] dark:text-gray-400 hover:text-emerald-600 transition-colors">
                  <HiOutlinePencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(ad.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-[#6B6B6B] dark:text-gray-400 hover:text-red-500 transition-colors">
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
              {editing === 'new' ? 'Add Advertisement' : 'Edit Advertisement'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">Title</label>
                  <input name="title" required value={form.title} onChange={handleChange} className="input-field" placeholder="Eid Sale" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">Sort Order</label>
                  <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">Description</label>
                <input name="description" value={form.description} onChange={handleChange} className="input-field" placeholder="-20% on selected modest wear" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">CTA Text</label>
                  <input name="cta_text" value={form.cta_text} onChange={handleChange} className="input-field" placeholder="Shop Sale" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">CTA Link</label>
                  <input name="cta_link" value={form.cta_link} onChange={handleChange} className="input-field" placeholder="/shop" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, icon_name: opt.value })}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-body transition-all ${
                          form.icon_name === opt.value
                            ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/30 text-gold-600'
                            : 'border-cream-300 dark:border-gray-600 text-[#6B6B6B] dark:text-gray-300 hover:border-gold-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{opt.label}</span>
                      </button>
                    )
                  })}
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
                    {saving ? 'Saving...' : editing === 'new' ? 'Add Ad' : 'Save Changes'}
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
