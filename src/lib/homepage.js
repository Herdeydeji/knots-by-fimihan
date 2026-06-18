import { supabase } from './supabase'

export async function getHeroSlides() {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getAdminHeroSlides() {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createHeroSlide(slide) {
  const { data, error } = await supabase
    .from('hero_slides')
    .insert([slide])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateHeroSlide(id, updates) {
  const { data, error } = await supabase
    .from('hero_slides')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteHeroSlide(id) {
  const { error } = await supabase
    .from('hero_slides')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getAdvertisements() {
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getAdminAdvertisements() {
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createAdvertisement(ad) {
  const { data, error } = await supabase
    .from('advertisements')
    .insert([ad])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateAdvertisement(id, updates) {
  const { data, error } = await supabase
    .from('advertisements')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAdvertisement(id) {
  const { error } = await supabase
    .from('advertisements')
    .delete()
    .eq('id', id)
  if (error) throw error
}
