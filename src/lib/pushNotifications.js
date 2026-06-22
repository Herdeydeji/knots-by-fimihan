export async function requestPermissionAndSubscribe(userId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
  if (Notification.permission === 'denied') return

  try {
    window.OneSignalDeferred = window.OneSignalDeferred || []
    OneSignalDeferred.push(async function (OneSignal) {
      await OneSignal.Notifications.requestPermission()
      OneSignal.login(userId)
    })
  } catch (e) { console.error('OneSignal subscribe error:', e) }
}

export async function unsubscribe(userId) {
  try {
    window.OneSignalDeferred = window.OneSignalDeferred || []
    OneSignalDeferred.push(async function (OneSignal) {
      OneSignal.logout()
    })
  } catch {}
}

export async function sendPushNotification(userId, { title, body, url }) {
  try {
    await fetch('/api/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, title, body, url }),
    })
  } catch (e) { console.error('send-push error:', e) }
}