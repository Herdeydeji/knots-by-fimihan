import { supabase } from './supabase'

export async function getProductReviews(productId) {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('id, rating, comment, created_at, user_id, profiles!inner(full_name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getProductRating(productId) {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('rating')
    .eq('product_id', productId)
  if (error) return { average: 0, count: 0 }
  const ratings = data || []
  if (ratings.length === 0) return { average: 0, count: 0 }
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0)
  return { average: Math.round((sum / ratings.length) * 10) / 10, count: ratings.length }
}

export async function createReview(productId, rating, comment) {
  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) throw new Error('You must be logged in to leave a review')

  const { data, error } = await supabase
    .from('product_reviews')
    .insert([{ product_id: productId, user_id: user.user.id, rating, comment }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getReviewDistribution(productId) {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('rating')
    .eq('product_id', productId)
  if (error) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  const ratings = data || []
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ratings.forEach((r) => { dist[r.rating] = (dist[r.rating] || 0) + 1 })
  return dist
}
