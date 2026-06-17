import { useState, useEffect } from 'react'
import { HiOutlineUserGroup, HiOutlineUser, HiOutlineBadgeCheck, HiOutlineShoppingBag, HiOutlineChatAlt2 } from 'react-icons/hi'
import { supabase } from '../../lib/supabase'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
  }, [])

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
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-cream-100 dark:border-gray-700/50 hover:bg-cream-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="font-medium text-[#1C1C1C] dark:text-gray-200">{u.full_name || '—'}</span>
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
