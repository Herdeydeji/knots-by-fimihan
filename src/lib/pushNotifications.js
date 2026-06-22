export async function requestPermissionAndSubscribe() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
  if (Notification.permission === 'denied') return

  try {
    window.OneSignalDeferred = window.OneSignalDeferred || []
    OneSignalDeferred.push(async function (OneSignal) {
      await OneSignal.Notifications.requestPermission()
    })
  } catch (e) { console.error('OneSignal subscribe error:', e) }
}

function getOnesignalSubId() {
  try {
    return window.OneSignal?.User?.PushSubscription?.id || null
  } catch { return null }
}

export async function sendPushNotification(userId, { title, body, url }) {
  const subId = getOnesignalSubId()
  if (!subId) {
    console.warn('No OneSignal subscription ID available')
    return
  }
  try {
    await fetch('/api/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, subscription_id: subId, title, body, url }),
    })
  } catch (e) { console.error('send-push error:', e) }
}