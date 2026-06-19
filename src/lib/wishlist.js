import { supabase } from './supabase'

export async function getWishlist(userId) {
  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', userId)
  if (error) throw error
  return data.map((w) => w.product_id)
}

export async function toggleWishlist(userId, productId) {
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', existing.id)
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
    return false
  }

  const { error } = await supabase
    .from('wishlists')
    .insert({ user_id: userId, product_id: productId })
  if (error) throw new Error(error.message)

  try {
    await supabase.rpc('create_user_notification', {
      p_user_id: userId,
      p_type: 'product_like',
      p_title: 'First Like! 💕',
      p_message: `You liked a product! We'll keep you updated on similar styles.`,
      p_link: '/shop',
    })
  } catch {} // notification is a bonus

  return true
}
