import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { getMyUnreadCount } from '../lib/notifications'

export const useNotifications = create((set, get) => ({
  unreadCount: 0,
  initialized: false,
  userId: null,

  init: async (user) => {
    const prev = get()._channel
    if (prev) {
      supabase.removeChannel(prev)
    }
    if (!user) {
      set({ unreadCount: 0, initialized: true, userId: null, _channel: null })
      return
    }
    const count = await getMyUnreadCount()
    set({ unreadCount: count, initialized: true, userId: user.id })

    const channel = supabase.channel('user-notifications-' + user.id)

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_notifications',
        filter: `user_id=eq.${user.id}`,
      },
      () => {
        set((s) => ({ unreadCount: s.unreadCount + 1 }))
      }
    )

    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_notifications',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        if (payload.new?.is_read) {
          set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) }))
        }
      }
    )

    channel.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'user_notifications',
        filter: `user_id=eq.${user.id}`,
      },
      () => {
        set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) }))
      }
    )

    channel.subscribe()

    set({ _channel: channel })
  },

  decrement: () => {
    set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) }))
  },

  refresh: async () => {
    const count = await getMyUnreadCount()
    set({ unreadCount: count })
  },

  cleanup: () => {
    const ch = get()._channel
    if (ch) {
      supabase.removeChannel(ch)
    }
    set({ unreadCount: 0, initialized: false, userId: null, _channel: null })
  },
}))
