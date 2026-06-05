import { useState, useEffect } from 'react'
import { HiOutlineInbox, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi'
import { getAllComplaints, updateComplaintStatus } from '../../lib/notifications'
import { useRealtimeSubscription } from '../../hooks/useRealtime'

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    getAllComplaints().then(setComplaints).catch(() => setError('Failed to load messages')).finally(() => setLoading(false))
  }, [])

  useRealtimeSubscription('complaints', 'INSERT', null, (payload) => {
    setComplaints((prev) => [payload.new, ...prev])
  })

  useRealtimeSubscription('complaints', 'UPDATE', null, (payload) => {
    setComplaints((prev) => prev.map((c) => c.id === payload.new.id ? { ...c, ...payload.new } : c))
  })

  const filtered = filter === 'all'
    ? complaints
    : complaints.filter((c) => c.status === filter)

  const handleStatus = async (id, status) => {
    try {
      await updateComplaintStatus(id, status)
      setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status } : c))
      if (selected?.id === id) setSelected({ ...selected, status })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-emerald-600 mb-6">Complaints / Messages</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'open', label: 'Open' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'resolved', label: 'Resolved' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`chip text-xs capitalize ${
              filter === key
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-gray-700 border border-cream-300 dark:border-gray-600 text-[#6B6B6B] dark:text-gray-300 hover:border-emerald-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`${selected ? 'hidden lg:block' : 'block'} lg:col-span-2 space-y-3`}>
          {loading ? (
            <div className="card p-8 text-center">
              <p className="text-[#6B6B6B] dark:text-gray-400 font-body text-sm">Loading messages...</p>
            </div>
          ) : error ? (
            <div className="card p-8 text-center">
              <p className="text-red-500 font-body text-sm">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary mt-4 text-sm">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-cream-200 dark:bg-gray-700 flex items-center justify-center">
                <HiOutlineInbox className="w-6 h-6 text-[#6B6B6B] dark:text-gray-400" />
              </div>
              <p className="text-[#6B6B6B] dark:text-gray-400 font-body text-sm">No {filter !== 'all' ? filter : ''} messages</p>
            </div>
          ) : filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`card p-4 w-full text-left transition-colors ${selected?.id === c.id ? 'ring-2 ring-emerald-600' : 'hover:border-emerald-600/20 dark:hover:border-emerald-600/40'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#1C1C1C] dark:text-gray-200">{c.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.status === 'open' ? 'bg-yellow-50 text-yellow-600' :
                      c.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                      'bg-green-50 text-green-600'
                    }`}>{c.status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm font-medium text-[#1C1C1C] dark:text-gray-200 mb-0.5">{c.subject}</p>
                  <p className="text-xs text-[#6B6B6B] dark:text-gray-400 line-clamp-1">{c.message}</p>
                </div>
                <span className="text-xs text-[#6B6B6B] dark:text-gray-400 whitespace-nowrap">
                  {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="card p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                selected.status === 'open' ? 'bg-yellow-50 text-yellow-600' :
                selected.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                'bg-green-50 text-green-600'
              }`}>{selected.status.replace('_', ' ')}</span>
              <button onClick={() => setSelected(null)} className="text-sm text-[#6B6B6B] dark:text-gray-400 hover:text-[#1C1C1C] dark:hover:text-gray-200 lg:hidden">Close</button>
            </div>
            <h3 className="font-display font-semibold text-lg text-[#1C1C1C] dark:text-gray-200 mb-1">{selected.subject}</h3>
            <p className="text-sm text-[#6B6B6B] dark:text-gray-400 mb-4">
              From <strong>{selected.name}</strong> ({selected.email})
              &middot; {new Date(selected.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
            <div className="bg-cream-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-[#1C1C1C] dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-[#6B6B6B] dark:text-gray-400 font-medium uppercase tracking-wider">Update Status</p>
              <div className="flex gap-2">
                {selected.status !== 'in_progress' && (
                  <button onClick={() => handleStatus(selected.id, 'in_progress')} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors">
                    <HiOutlineCheckCircle className="w-4 h-4" /> In Progress
                  </button>
                )}
                {selected.status !== 'resolved' && (
                  <button onClick={() => handleStatus(selected.id, 'resolved')} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-600 text-sm font-medium hover:bg-green-100 transition-colors">
                    <HiOutlineCheckCircle className="w-4 h-4" /> Resolve
                  </button>
                )}
              </div>
              <button onClick={() => handleStatus(selected.id, 'open')} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-50 text-yellow-600 text-sm font-medium hover:bg-yellow-100 transition-colors">
                <HiOutlineXCircle className="w-4 h-4" /> Reopen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
