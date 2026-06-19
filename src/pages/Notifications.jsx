import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineBell, HiOutlineCheck, HiOutlineTrash, HiOutlineShoppingBag,
  HiOutlineHeart, HiOutlineChat, HiOutlineTruck, HiOutlineX,
} from 'react-icons/hi'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { useNotifications } from '../hooks/useNotifications'
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../lib/notifications'
import Breadcrumbs from '../components/ui/Breadcrumbs'

const TYPE_ICONS = {
  order_placed: { icon: HiOutlineShoppingBag, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
  payment_approved: { icon: HiOutlineCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
  order_processing: { icon: HiOutlineShoppingBag, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
  order_shipped: { icon: HiOutlineTruck, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
  order_delivered: { icon: HiOutlineCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
  order_cancelled: { icon: HiOutlineX, color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
  admin_message: { icon: HiOutlineChat, color: 'text-gold-500 bg-gold-50 dark:bg-amber-900/30' },
  product_liked: { icon: HiOutlineHeart, color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/30' },
}

function getIconConfig(type) {
  return TYPE_ICONS[type] || { icon: HiOutlineBell, color: 'text-gray-600 bg-gray-50 dark:bg-gray-800' }
}

function timeAgo(dateStr) {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function Notifications() {
  const { user } = useAuth()
  const notifStore = useNotifications()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return }
    try {
      const data = await getMyNotifications()
      setNotifications(data)
    } catch {} finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!user) return
    const channel = supabase.channel('notif-page-' + user.id)
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'user_notifications', filter: `user_id=eq.${user.id}` }, () => load())
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, load])

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
      notifStore.decrement()
    } catch {}
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      notifStore.refresh()
    } catch {}
  }

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id)
      const wasUnread = notifications.find((n) => n.id === id && !n.is_read)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      if (wasUnread) {
        notifStore.decrement()
      }
    } catch {}
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center">
          <HiOutlineBell className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="font-display text-xl font-semibold text-[#1C1C1C] dark:text-gray-200">Sign in to view notifications</h2>
        <p className="text-[#6B6B6B] dark:text-gray-400 mt-2 text-sm">You'll need to sign in to see your alerts.</p>
        <Link to="/login" className="btn-primary inline-flex items-center gap-2 mt-6">Sign In</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8 pb-36 lg:pb-8">
      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'Notifications', path: '' },
      ]} />

      <div className="flex items-center justify-between mt-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-emerald-600">Notifications</h1>
        {notifications.some((n) => !n.is_read) && (
          <button onClick={handleMarkAllRead} className="text-sm text-emerald-600 hover:text-emerald-700 font-body font-medium flex items-center gap-1.5">
            <HiOutlineCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-cream-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-cream-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-2.5 bg-cream-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center">
            <HiOutlineBell className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-body text-[#6B6B6B] dark:text-gray-400">No notifications yet.</p>
          <p className="text-sm text-[#6B6B6B] dark:text-gray-500 mt-1">You'll see order updates, admin messages, and more here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const { icon: Icon, color } = getIconConfig(n.type)
            const notifLink = n.link || '#'
            return (
              <div
                key={n.id}
                className={`card p-4 flex gap-3 items-start transition-colors ${
                  !n.is_read ? 'border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'opacity-80'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-body ${!n.is_read ? 'font-semibold text-[#1C1C1C] dark:text-gray-100' : 'font-medium text-[#6B6B6B] dark:text-gray-400'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-[#6B6B6B] dark:text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 whitespace-nowrap flex-shrink-0">{timeAgo(n.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {!n.is_read && (
                      <button onClick={() => handleMarkRead(n.id)} className="text-xs text-emerald-600 hover:text-emerald-700 font-body font-medium flex items-center gap-1">
                        <HiOutlineCheck className="w-3.5 h-3.5" /> Mark read
                      </button>
                    )}
                    {n.link && (
                      <Link to={n.link} className="text-xs text-emerald-600 hover:text-emerald-700 font-body font-medium" onClick={() => !n.is_read && handleMarkRead(n.id)}>
                        View details
                      </Link>
                    )}
                    <button onClick={() => handleDelete(n.id)} className="text-xs text-red-500 hover:text-red-600 font-body flex items-center gap-1 ml-auto">
                      <HiOutlineTrash className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
