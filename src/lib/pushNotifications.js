import { supabase } from './supabase'

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - base64.length % 4) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(b64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export async function requestPermissionAndSubscribe(userId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
  if (Notification.permission === 'denied') return

  let permission = Notification.permission
  if (permission === 'default') {
    permission = await Notification.requestPermission()
  }
  if (permission !== 'granted') return

  try {
    const registration = await navigator.serviceWorker.ready
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
    if (!vapidKey) return

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    })

    await supabase.from('push_subscriptions').upsert(
      { user_id: userId, subscription: JSON.parse(JSON.stringify(subscription)) },
      { onConflict: 'user_id' }
    )
  } catch {}
}

export async function unsubscribe(userId) {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
      }
    }
  } catch {}

  try {
    await supabase.from('push_subscriptions').delete().eq('user_id', userId)
  } catch {}
}

export async function sendPushNotification(userId, { title, body, url }) {
  try {
    await fetch('/api/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, title, body, url }),
    })
  } catch {} // push is a bonus
}
