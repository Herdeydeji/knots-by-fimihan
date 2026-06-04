import { supabase } from './supabase'

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getOrderByNumber(orderNumber) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single()
  if (error) throw error
  return data
}

export async function getOrderStats() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, total, fulfillment_status, payment_status')
  if (error) throw error
  const orders = data || []
  return {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
    pendingOrders: orders.filter((o) => o.fulfillment_status === 'pending').length,
    paidOrders: orders.filter((o) => o.payment_status === 'paid').length,
  }
}

export async function getOrderByReference(reference) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .or(`payment_reference.eq.${reference},order_number.eq.${reference}`)
    .single()
  if (error) throw error
  return data
}

export async function getOrdersByEmail(email) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_email', email)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function updateFulfillmentStatus(id, status, trackingNumber) {
  const updates = { fulfillment_status: status }
  if (trackingNumber !== undefined) updates.tracking_number = trackingNumber
  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}
