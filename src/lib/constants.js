import { supabase } from './supabase'

export const SITE_NAME = "Knots by Fimihan"
export const SITE_TAGLINE = "Dress Modestly, Live Beautifully"
export const WHATSAPP_NUMBER = "+2348057370277"
export const SHIPPING_FEE = 2500
export const FREE_SHIPPING_THRESHOLD = 25000
export const INSTAGRAM_HANDLE = ""
export const EMAIL = "knotbyfimihan121@gmail.com"

export const CATEGORIES = [
  { id: 1, name: "Abayas", slug: "abayas", description: "Full-length Islamic outer garments", icon: "Abayas" },
  { id: 2, name: "Hijabs", slug: "hijabs", description: "Scarves, turbans & ready-to-wear hijabs", icon: "Hijabs" },
  { id: 3, name: "Kaftans", slug: "kaftans", description: "Traditional Nigerian kaftans", icon: "Kaftans" },
  { id: 4, name: "Sets", slug: "sets", description: "Matching abaya + hijab sets", icon: "Sets" },
  { id: 5, name: "Accessories", slug: "accessories", description: "Pins, bags, prayer mats & more", icon: "Accessories" },
]

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
  if (error) throw error
  const settings = {}
  if (data) {
    data.forEach(s => { settings[s.key] = s.value })
  }
  return settings
}

export const PAYSTACK_PUBLIC_KEY = 'pk_test_8a6efcfbff945ad50ec6e4978b6368d73ef391b8'

function getShippingFee(state) {
  const lagosStates = ['lagos']
  const southWest = ['oyo', 'ogun', 'osun', 'ekiti', 'ondo']
  const s = (state || '').toLowerCase()
  if (lagosStates.includes(s)) return 2000
  if (southWest.includes(s)) return 2500
  return 3500
}

export function calculateShipping(subtotal, state) {
  const threshold = FREE_SHIPPING_THRESHOLD
  if (subtotal >= threshold) return { fee: 0, free: true }
  return { fee: getShippingFee(state), free: false }
}
