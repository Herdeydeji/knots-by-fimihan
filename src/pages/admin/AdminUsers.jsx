import { useState, useEffect } from 'react'
import { HiOutlineUserGroup, HiOutlineUser, HiOutlineBadgeCheck, HiOutlineShoppingBag, HiOutlineChatAlt2, HiOutlineShieldCheck, HiOutlineShieldExclamation } from 'react-icons/hi'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(null)

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
      alert(error.message)
      return
    }

    setUsers((prev) => prev.map((u) => u.id === target.id ? { ...u, is_admin: !alreadyAdmin } : u))
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-emerald-600 mb-6">Users</h1>

      {loading ? (
        <div className="card p-8 text-center">
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body text-sm">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center">
            <HiOutlineUserGroup className="w-6 h-6 text-[#6B6B6B] dark:text-gray-400" />
          </div>
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body text-sm">No users found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineUserGroup className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">{users.length}</p>
                <p className="text-xs text-[#6B6B6B] dark:text-gray-400 font-body">Total Users</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineBadgeCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-[#1C1C1C] dark:text-gray-200">{users.filter(u => u.is_admin).length}</p>
                <p className="text-xs text-[#6B6B6B] dark:text-gray-400 font-body">Admins</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 dark:border-gray-700 text-left">
                <th className="pb-3 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body">Name</th>
                <th className="pb-3 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body hidden sm:table-cell">Email</th>
                <th className="pb-3 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body">Role</th>
                <th className="pb-3 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body hidden md:table-cell">Joined</th>
                <th className="pb-3 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body text-right">Orders</th>
                <th className="pb-3 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body text-right">Chats</th>
                <th className="pb-3 font-semibold text-[#1C1C1C] dark:text-gray-200 font-body text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-cream-100 dark:border-gray-700/50 hover:bg-cream-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="font-medium text-[#1C1C1C] dark:text-gray-200">{u.full_name || '—'}</span>
                    {u.id === currentUser?.id && <span className="ml-2 text-xs text-[#6B6B6B] dark:text-gray-500">(you)</span>}
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell text-[#6B6B6B] dark:text-gray-400">{u.email}</td>
                  <td className="py-3 pr-4">
                    {u.is_admin ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                        <HiOutlineBadgeCheck className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-xs text-[#6B6B6B] dark:text-gray-400">User</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell text-[#6B6B6B] dark:text-gray-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B6B6B] dark:text-gray-400">
                      <HiOutlineShoppingBag className="w-3.5 h-3.5" /> {u.orderCount}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B6B6B] dark:text-gray-400">
                      <HiOutlineChatAlt2 className="w-3.5 h-3.5" /> {u.chatCount}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {u.id === currentUser?.id ? (
                      <span className="text-xs text-[#6B6B6B] dark:text-gray-500">—</span>
                    ) : (
                      <button
                        onClick={() => handleToggleAdmin(u)}
                        disabled={toggling === u.id}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                          u.is_admin
                            ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30'
                            : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {toggling === u.id ? (
                          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : u.is_admin ? (
                          <HiOutlineShieldExclamation className="w-3.5 h-3.5" />
                        ) : (
                          <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                        )}
                        {toggling === u.id ? '...' : u.is_admin ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  )
}
