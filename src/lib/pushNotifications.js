let cachedSubId = null

export async function requestPermissionAndSubscribe() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false
  if (Notification.permission === 'denied') return false
  if (Notification.permission === 'granted') return true

  try {
    window.OneSignalDeferred = window.OneSignalDeferred || []
    OneSignalDeferred.push(async function (OneSignal) {
      await OneSignal.Notifications.requestPermission()
      cachedSubId = await _waitForSubId(OneSignal)
    })
    return true
  } catch (e) { console.error('OneSignal subscribe error:', e) }
  return false
}

function _waitForSubId(OneSignal, timeout = 5000) {
  return new Promise((resolve) => {
    const deadline = Date.now() + timeout
    function poll() {
      const id = OneSignal.User?.PushSubscription?.id
      if (id) return resolve(id)
      if (Date.now() >= deadline) return resolve(null)
      setTimeout(poll, 200)
    }
    poll()
  })
}

function _getOnesignalSubId() {
  if (cachedSubId) return cachedSubId
  try {
    return window.OneSignal?.User?.PushSubscription?.id || null
  } catch { return null }
}

export async function sendPushNotification(userId, { title, body, url }) {
  let subId = _getOnesignalSubId()
  if (!subId) {
    subId = await _waitForSubId(window.OneSignal, 3000)
    if (subId) cachedSubId = subId
  }
  if (!subId) {
    console.warn('No OneSignal subscription ID available — push skipped')
    return false
  }
  try {
    const res = await fetch('/api/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, subscription_id: subId, title, body, url }),
    })
    if (!res.ok) console.error('send-push server error:', await res.text())
    return res.ok
  } catch (e) { console.error('send-push network error:', e) }
  return false
}