import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

let idCounter = 0

export function useRealtimeSubscription(table, event, filter, callback) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const id = ++idCounter
    const channelName = `${table}-${event}-${JSON.stringify(filter) || 'all'}-${id}`
    const channel = supabase.channel(channelName)

    const onChange = (payload) => {
      callbackRef.current(payload)
    }

    channel.on(
      'postgres_changes',
      { event, schema: 'public', table, filter: filter || undefined },
      onChange
    )

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, event, JSON.stringify(filter)])
}
