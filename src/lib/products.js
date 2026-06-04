import { supabase } from './supabase'

export const categoryHeroImages = {
  abayas: "https://images.pexels.com/photos/13776836/pexels-photo-13776836.jpeg?auto=compress&cs=tinysrgb&w=1200",
  hijabs: "https://images.pexels.com/photos/8350562/pexels-photo-8350562.jpeg?auto=compress&cs=tinysrgb&w=1200",
  kaftans: "https://images.pexels.com/photos/29060901/pexels-photo-29060901.jpeg?auto=compress&cs=tinysrgb&w=1200",
  sets: "https://images.pexels.com/photos/15751052/pexels-photo-15751052.jpeg?auto=compress&cs=tinysrgb&w=1200",
  accessories: "https://images.pexels.com/photos/4646225/pexels-photo-4646225.jpeg?auto=compress&cs=tinysrgb&w=1200",
}

export const heroImage = "https://images.pexels.com/photos/30723894/pexels-photo-30723894.jpeg?auto=compress&cs=tinysrgb&w=1920"

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getProductsByCategory(category) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
  if (error) throw error
  return data || []
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
  if (error) throw error
  return data || []
}

export async function getRelatedProducts(product) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(4)
  if (error) throw error
  return data || []
}

export async function searchProducts(query) {
  const q = `%${query.toLowerCase()}%`
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.${q},description.ilike.${q},tags.cs.{${query.toLowerCase()}},category.ilike.${q}`)
  if (error) throw error
  return data || []
}

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
  if (error) throw error
  return data || []
}

export async function getAdminProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id)
  if (error) throw error
}
