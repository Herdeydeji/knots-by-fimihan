import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineShoppingBag,
  HiOutlineChatAlt2, HiOutlineHeart, HiOutlineCalendar, HiOutlineBadgeCheck,
  HiOutlineLogout, HiOutlineChartBar, HiOutlineCube, HiOutlineClipboardList,
  HiOutlineUserGroup, HiOutlineInbox, HiOutlinePencil, HiOutlineCheck,
  HiOutlineXCircle, HiOutlineSun, HiOutlineMoon
} from 'react-icons/hi'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { useTheme } from '../lib/theme'
import Breadcrumbs from '../components/ui/Breadcrumbs'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatMemberSince(date) {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: HiOutlineChartBar, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { label: 'Products', path: '/admin/products', icon: HiOutlineCube, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { label: 'Orders', path: '/admin/orders', icon: HiOutlineClipboardList, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  { label: 'Users', path: '/admin/users', icon: HiOutlineUserGroup, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { label: 'Chat', path: '/admin/chat', icon: HiOutlineChatAlt2, color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' },
  { label: 'Complaints', path: '/admin/complaints', icon: HiOutlineInbox, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ orders: 0, chats: 0, wishlist: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const { dark, toggle } = useTheme()
  const [form, setForm] = useState({ full_name: '', phone: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => data),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('customer_email', user.email).then(({ count }) => count || 0),
      supabase.from('chat_messages').select('*', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => count || 0),
      supabase.from('wishlists').select('*', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => count || 0),
    ]).then(([profileData, orders, chats, wishlist]) => {
      setProfile(profileData)
      setForm({ full_name: profileData?.full_name || '', phone: profileData?.phone || '' })
      setStats({ orders, chats, wishlist })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase.rpc('update_own_profile', {
      p_full_name: form.full_name.trim() || null,
      p_phone: form.phone.trim() || null,
    })
    setSaving(false)
    if (error) { alert(error.message); return }
    setProfile((p) => ({ ...p, full_name: form.full_name.trim(), phone: form.phone.trim() }))
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return
    await logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold-100 flex items-center justify-center">
          <HiOutlineUser className="w-8 h-8 text-gold-500" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#1C1C1C] dark:text-gray-200">Sign In Required</h2>
        <p className="text-[#6B6B6B] dark:text-gray-400 mt-2">Please sign in to view your profile.</p>
        <button onClick={() => navigate('/login')} className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-xl font-body font-medium hover:bg-emerald-700 transition-colors">
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'My Profile', path: '' },
      ]} />

      {loading ? (
        <div className="space-y-6">
          <div className="card p-8 animate-pulse">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-cream-200 dark:bg-gray-700" />
              <div className="h-6 bg-cream-200 dark:bg-gray-700 rounded w-48" />
              <div className="h-4 bg-cream-200 dark:bg-gray-700 rounded w-64" />
            </div>
          </div>
          <div className="card p-6 animate-pulse">
            <div className="h-5 bg-cream-200 dark:bg-gray-700 rounded w-32 mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-cream-200 dark:bg-gray-700 rounded" />
              <div className="h-10 bg-cream-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card p-6 sm:p-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 border-2 border-gold-500/40 shadow-lg shadow-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl font-bold text-gold-300 font-display tracking-wide">
                    {getInitials(profile?.full_name || user.email)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-cream-200 dark:border-gray-600 flex items-center justify-center shadow-sm">
                  <HiOutlinePencil className="w-3 h-3 text-[#6B6B6B] dark:text-gray-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">
                  {profile?.full_name || '—'}
                </h1>
                <p className="text-sm text-[#6B6B6B] dark:text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineMail className="w-3.5 h-3.5" /> {user.email}
                  </span>
                  <span className="hidden sm:inline text-[#6B6B6B]/40">•</span>
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineCalendar className="w-3.5 h-3.5" /> Member since {formatMemberSince(profile?.created_at)}
                  </span>
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                      <HiOutlineBadgeCheck className="w-3.5 h-3.5" /> Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card p-3 sm:p-4 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">{stats.orders}</p>
                <p className="text-[10px] sm:text-xs text-[#6B6B6B] dark:text-gray-400 font-body">Orders</p>
              </div>
            </div>
            <div className="card p-3 sm:p-4 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineChatAlt2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">{stats.chats}</p>
                <p className="text-[10px] sm:text-xs text-[#6B6B6B] dark:text-gray-400 font-body">Chats</p>
              </div>
            </div>
            <div className="card p-3 sm:p-4 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineHeart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">{stats.wishlist}</p>
                <p className="text-[10px] sm:text-xs text-[#6B6B6B] dark:text-gray-400 font-body">Wishlist</p>
              </div>
            </div>
            <div className="card p-3 sm:p-4 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">{formatMemberSince(profile?.created_at)}</p>
                <p className="text-[10px] sm:text-xs text-[#6B6B6B] dark:text-gray-400 font-body">Joined</p>
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base sm:text-lg font-display font-semibold text-[#1C1C1C] dark:text-gray-200">Personal Information</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                >
                  <HiOutlinePencil className="w-3.5 h-3.5" /> Edit
                </button>
              ) : saved ? (
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-emerald-600">
                  <HiOutlineCheck className="w-4 h-4" /> Saved
                </span>
              ) : null}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#6B6B6B] dark:text-gray-400 mb-1.5 font-body uppercase tracking-wide">Full Name</label>
                {editing ? (
                  <input
                    value={form.full_name}
                    onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                    placeholder="Your full name"
                    className="input-field text-sm"
                  />
                ) : (
                  <p className="text-sm text-[#1C1C1C] dark:text-gray-200 font-medium">{profile?.full_name || '—'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B6B6B] dark:text-gray-400 mb-1.5 font-body uppercase tracking-wide">Email</label>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-[#1C1C1C] dark:text-gray-200 font-medium">{user.email}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">Verified</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B6B6B] dark:text-gray-400 mb-1.5 font-body uppercase tracking-wide">Phone</label>
                {editing ? (
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+234 800 000 0000"
                    className="input-field text-sm"
                  />
                ) : (
                  <p className="text-sm text-[#1C1C1C] dark:text-gray-200 font-medium">{profile?.phone || '—'}</p>
                )}
              </div>

              {editing && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <HiOutlineCheck className="w-4 h-4" /> Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setForm({ full_name: profile?.full_name || '', phone: profile?.phone || '' }) }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[#6B6B6B] dark:text-gray-400 hover:bg-cream-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-display font-semibold text-[#1C1C1C] dark:text-gray-200 mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  {dark ? <HiOutlineSun className="w-5 h-5 text-amber-600 dark:text-amber-400" /> : <HiOutlineMoon className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1C1C1C] dark:text-gray-200">Dark Mode</p>
                  <p className="text-xs text-[#6B6B6B] dark:text-gray-400">{dark ? 'On' : 'Off'}</p>
                </div>
              </div>
              <button
                onClick={toggle}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${dark ? 'bg-emerald-600' : 'bg-cream-200 dark:bg-gray-600'}`}
                aria-label="Toggle dark mode"
                type="button"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${dark ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {isAdmin && (
            <div className="card p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-display font-semibold text-[#1C1C1C] dark:text-gray-200 mb-4">Admin Panel</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {adminLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-cream-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-sm transition-all group"
                    >
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${link.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-[#1C1C1C] dark:text-gray-200">{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/orders"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-cream-200 dark:border-gray-700 text-sm font-medium text-[#1C1C1C] dark:text-gray-200 hover:bg-cream-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiOutlineClipboardList className="w-4 h-4" /> My Orders
            </Link>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <HiOutlineLogout className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
