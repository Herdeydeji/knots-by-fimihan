import { supabase } from './supabase'

export async function submitComplaint({ name, email, subject, message }) {
  let userId = null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id || null
  } catch { }
  const { error } = await supabase.from('complaints').insert({
    user_id: userId,
    name,
    email,
    subject,
    message,
    status: 'open',
  })
  if (error) throw error

  try {
    await supabase.from('admin_notifications').insert({
      type: 'new_complaint',
      title: 'New Complaint',
      message: `${name} submitted a complaint: ${subject}`,
      link: '/admin/complaints',
    })
  } catch {} // notification is a bonus, don't block complaint submission
}

export async function getAllComplaints() {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function updateComplaintStatus(id, status) {
  const { error } = await supabase
    .from('complaints')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function getNotifications() {
  const { data, error } = await supabase
    .from('admin_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data || []
}

export async function markNotificationRead(id) {
  const { error } = await supabase
    .from('admin_notifications')
    .update({ is_read: true })
    .eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsRead() {
  const { error } = await supabase
    .from('admin_notifications')
    .update({ is_read: true })
    .eq('is_read', false)
  if (error) throw error
}

export async function getUnreadNotificationCount() {
  const { count, error } = await supabase
    .from('admin_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)
  if (error) return 0
  return count || 0
}
