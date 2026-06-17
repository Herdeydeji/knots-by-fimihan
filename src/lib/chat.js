import { supabase } from './supabase'

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function sendMessage(userId, message) {
  const { error } = await supabase.from('chat_messages').insert({
    user_id: userId,
    sender: 'user',
    message,
  })
  if (error) throw error
}

export async function getConversation(userId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getAllConversations() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error

  const msgs = data || []
  const grouped = {}
  for (const msg of msgs) {
    if (!grouped[msg.user_id]) {
      grouped[msg.user_id] = { user_id: msg.user_id, messages: [], user: null }
    }
    grouped[msg.user_id].messages.push(msg)
  }

  const userIds = Object.keys(grouped)
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', userIds)
    if (profiles) {
      for (const p of profiles) {
        if (grouped[p.id]) grouped[p.id].user = p
      }
    }
  }

  return Object.values(grouped).sort((a, b) => {
    const aLast = a.messages[0]?.created_at || ''
    const bLast = b.messages[0]?.created_at || ''
    return bLast.localeCompare(aLast)
  })
}

export async function sendAdminReply(userId, message) {
  const { error } = await supabase.rpc('admin_send_chat_reply', {
    p_user_id: userId,
    p_message: message,
  })
  if (error) throw error
}

export async function markConversationRead(userId) {
  const { error } = await supabase
    .from('chat_messages')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('sender', 'user')
    .eq('read', false)
  if (error) throw error
}

export async function getUnreadConversationCount() {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('user_id')
    .eq('sender', 'user')
    .eq('read', false)
  if (error) return 0
  const unique = new Set(data?.map(r => r.user_id) || [])
  return unique.size
}
