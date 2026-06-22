import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

function read(fp) {
  return fs.readFileSync(path.resolve(fp), 'utf-8')
}

test.describe('OneSignal push notification migration', () => {
  test('index.html includes OneSignal SDK script', () => {
    const src = read('index.html')
    expect(src).toContain('cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js')
  })

  test('sw.js imports OneSignalSDKWorker', () => {
    const src = read('public/sw.js')
    expect(src.startsWith("importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js')")).toBe(true)
  })

  test('sw.js no longer has push/notificationclick handlers', () => {
    const src = read('public/sw.js')
    expect(src).not.toContain("self.addEventListener('push'")
    expect(src).not.toContain("self.addEventListener('notificationclick'")
  })

  test('api/send-push.mjs uses OneSignal REST API, not web-push', () => {
    const src = read('api/send-push.mjs')
    expect(src).not.toContain('web-push')
    expect(src).not.toContain('webPush')
    expect(src).not.toContain('VAPID')
    expect(src).toContain('onesignal.com/api/v1/notifications')
    expect(src).toContain('ONESIGNAL_APP_ID')
    expect(src).toContain('ONESIGNAL_API_KEY')
    expect(src).toContain('include_subscription_ids')
    expect(src).toContain('include_external_user_ids')
  })

  test('server/index.js uses OneSignal REST API, not web-push', () => {
    const src = read('server/index.js')
    expect(src).not.toContain('web-push')
    expect(src).not.toContain('webPush')
    expect(src).not.toContain('VAPID')
    expect(src).toContain('onesignal.com/api/v1/notifications')
    expect(src).toContain('ONESIGNAL_APP_ID')
    expect(src).toContain('ONESIGNAL_API_KEY')
  })

  test('main.tsx initializes OneSignal', () => {
    const src = read('src/main.tsx')
    expect(src).toContain('OneSignalDeferred')
    expect(src).toContain('OneSignal.init')
    expect(src).toContain('VITE_ONESIGNAL_APP_ID')
    expect(src).toContain('serviceWorkerPath')
  })

  test('pushNotifications.js uses OneSignal SDK methods', () => {
    const src = read('src/lib/pushNotifications.js')
    expect(src).toContain('OneSignal.Notifications.requestPermission')
    expect(src).toContain('PushSubscription')
    expect(src).toContain('subscription_id')
    expect(src).not.toContain('VAPID')
    expect(src).not.toContain('supabase')
    expect(src).not.toContain('push_subscriptions')
  })

  test('push_subscriptions.sql migration file is deleted', () => {
    expect(fs.existsSync(path.resolve('supabase/migrations/push_subscriptions.sql'))).toBe(false)
  })

  test('verify-payment edge function sends push notification via OneSignal', () => {
    const src = read('supabase/functions/verify-payment/index.ts')
    expect(src).toContain('ONESIGNAL_APP_ID')
    expect(src).toContain('ONESIGNAL_API_KEY')
    expect(src).toContain('onesignal.com/api/v1/notifications')
    expect(src).toContain('sendPushToOneSignal')
    expect(src).toContain('include_external_user_ids')
    expect(src).toContain('target_channel')
  })
})
