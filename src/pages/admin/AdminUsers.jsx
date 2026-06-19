import { useState, useEffect, useMemo } from 'react'
import {
  HiOutlineUserGroup, HiOutlineBadgeCheck, HiOutlineShoppingBag,
  HiOutlineChatAlt2, HiOutlineSearch, HiOutlineShieldCheck,
  HiOutlineShieldExclamation, HiOutlineCalendar, HiOutlineMail
} from 'react-icons/hi'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../stores/useToast'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(null)
  const [search, setSearch] = useState('')
  const addToast = useToast((s) => s.addToast)

  const fetchUsers = () => {
    setLoading(true)
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(async ({ data: profiles }) => {
      if (!profiles) { setLoading(false); return }
      const enriched = await Promise.all(profiles.map(async (u) => {
        const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('customer_email', u.email)
        const { count: chatCount } = await supabase.from('chat_messages').select('*', { count: 'exact', head: true }).eq('user_id', u.id)
        return { ...u, orderCount: orderCount || 0, chatCount: chatCount || 0 }
      }))
      setUsers(enriched)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleToggleAdmin = async (target) => {
    const alreadyAdmin = target.is_admin
    const action = alreadyAdmin ? 'revoke admin access from' : 'grant admin access to'
    if (!window.confirm(`Are you sure you want to ${action} ${target.full_name || target.email}?`)) return

    setToggling(target.id)
    const { error } = await supabase.rpc('admin_set_admin_role', {
      target_user_id: target.id,
      make_admin: !alreadyAdmin
    })
    setToggling(null)

    if (error) {
      addToast(error.message, 'error')
      return
    }

    setUsers((prev) => prev.map((u) => u.id === target.id ? { ...u, is_admin: !alreadyAdmin } : u))
    addToast(alreadyAdmin ? 'Admin access revoked' : 'Admin access granted', 'success')
  }

  const filtered = useMemo(
    () => users.filter((u) => {
      const q = search.toLowerCase()
      return (u.full_name?.toLowerCase() || '').includes(q) || (u.email?.toLowerCase() || '').includes(q)
    }),
    [users, search]
  )

  const adminCount = users.filter(u => u.is_admin).length

  const UserAvatar = ({ user, size = 'md' }) => {
    const sizeClasses = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs'
    const bg = user.is_admin
      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
      : 'bg-cream-200 text-[#6B6B6B] dark:bg-gray-700 dark:text-gray-400'
    return (
      <div className={`rounded-full ${sizeClasses} ${bg} flex items-center justify-center font-semibold flex-shrink-0`}>
        {getInitials(user.full_name)}
      </div>
    )
  }

  const AdminToggleButton = ({ user }) => {
    if (user.id === currentUser?.id) return null

    const isLoading = toggling === user.id

    return (
      <button
        onClick={() => handleToggleAdmin(user)}
        disabled={isLoading}
        className={`inline-flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
          user.is_admin
            ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30'
            : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : user.is_admin ? (
          <HiOutlineShieldExclamation className="w-3.5 h-3.5" />
        ) : (
          <HiOutlineShieldCheck className="w-3.5 h-3.5" />
        )}
        {isLoading ? 'Updating...' : user.is_admin ? 'Revoke Admin' : 'Make Admin'}
      </button>
    )
  }

  const UserCard = ({ user }) => (
    <div className="card p-4 flex items-start gap-3">
      <UserAvatar user={user} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm text-[#1C1C1C] dark:text-gray-200 truncate">
            {user.full_name || '—'}
          </span>
          {user.id === currentUser?.id && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cream-100 dark:bg-gray-700 text-[#6B6B6B] dark:text-gray-400 font-medium">You</span>
          )}
          {user.is_admin && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
              <HiOutlineBadgeCheck className="w-2.5 h-2.5" /> Admin
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-[#6B6B6B] dark:text-gray-400">
          <HiOutlineMail className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-[#6B6B6B] dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <HiOutlineShoppingBag className="w-3 h-3" /> {user.orderCount} orders
          </span>
          <span className="inline-flex items-center gap-1">
            <HiOutlineChatAlt2 className="w-3 h-3" /> {user.chatCount} chats
          </span>
          <span className="inline-flex items-center gap-1">
            <HiOutlineCalendar className="w-3 h-3" /> {formatDate(user.created_at)}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0">
        <AdminToggleButton user={user} />
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-display font-semibold text-emerald-600">Users</h1>
        <div className="relative w-full sm:w-64">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] dark:text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field !pl-10 !py-2.5 text-sm w-full"
          />
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center animate-pulse">
            <HiOutlineUserGroup className="w-6 h-6 text-[#6B6B6B] dark:text-gray-400" />
          </div>
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body text-sm">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center">
            <HiOutlineUserGroup className="w-7 h-7 text-[#6B6B6B] dark:text-gray-400" />
          </div>
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body text-sm">No users found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineUserGroup className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">{users.length}</p>
                <p className="text-[11px] sm:text-xs text-[#6B6B6B] dark:text-gray-400 font-body">Total Users</p>
              </div>
            </div>
            <div className="card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineBadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">{adminCount}</p>
                <p className="text-[11px] sm:text-xs text-[#6B6B6B] dark:text-gray-400 font-body">Admins</p>
              </div>
            </div>
            <div className="card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">
                  {users.reduce((s, u) => s + u.orderCount, 0)}
                </p>
                <p className="text-[11px] sm:text-xs text-[#6B6B6B] dark:text-gray-400 font-body">Total Orders</p>
              </div>
            </div>
            <div className="card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineChatAlt2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">
                  {users.reduce((s, u) => s + u.chatCount, 0)}
                </p>
                <p className="text-[11px] sm:text-xs text-[#6B6B6B] dark:text-gray-400 font-body">Total Chats</p>
              </div>
            </div>
          </div>

          {filtered.length === 0 && search ? (
            <div className="card p-8 text-center">
              <p className="text-[#6B6B6B] dark:text-gray-400 font-body text-sm">No users match "{search}"</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cream-200 dark:border-gray-700 text-left">
                      <th className="pb-3 pr-4 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body">User</th>
                      <th className="pb-3 pr-4 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body hidden lg:table-cell">Email</th>
                      <th className="pb-3 pr-4 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body">Role</th>
                      <th className="pb-3 pr-4 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body hidden xl:table-cell">Joined</th>
                      <th className="pb-3 pr-4 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body text-right">Orders</th>
                      <th className="pb-3 pr-4 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body text-right hidden lg:table-cell">Chats</th>
                      <th className="pb-3 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.id} className="border-b border-cream-100 dark:border-gray-700/50 hover:bg-cream-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={u} />
                            <div>
                              <span className="font-medium text-[#1C1C1C] dark:text-gray-200">{u.full_name || '—'}</span>
                              {u.id === currentUser?.id && (
                                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-cream-100 dark:bg-gray-700 text-[#6B6B6B] dark:text-gray-400 font-medium">You</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 hidden lg:table-cell text-[#6B6B6B] dark:text-gray-400">{u.email}</td>
                        <td className="py-3 pr-4">
                          {u.is_admin ? (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                              <HiOutlineBadgeCheck className="w-3 h-3" /> Admin
                            </span>
                          ) : (
                            <span className="text-xs text-[#6B6B6B] dark:text-gray-400 font-medium">User</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 hidden xl:table-cell text-[#6B6B6B] dark:text-gray-400 text-xs whitespace-nowrap">
                          {formatDate(u.created_at)}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <span className="text-xs font-medium text-[#6B6B6B] dark:text-gray-400">{u.orderCount}</span>
                        </td>
                        <td className="py-3 pr-4 text-right hidden lg:table-cell">
                          <span className="text-xs font-medium text-[#6B6B6B] dark:text-gray-400">{u.chatCount}</span>
                        </td>
                        <td className="py-3 text-right">
                          <AdminToggleButton user={u} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-3">
                {filtered.map((u) => (
                  <UserCard key={u.id} user={u} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
