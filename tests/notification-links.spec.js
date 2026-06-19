import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('Notification links', () => {
  test('admin reply notification links to style-assistant with mode=support', () => {
    const src = fs.readFileSync(path.resolve('src/lib/chat.js'), 'utf-8')
    expect(src).toContain("/style-assistant?mode=support")
  })

  test('StyleAssistant.jsx reads mode from searchParams', () => {
    const src = fs.readFileSync(path.resolve('src/pages/StyleAssistant.jsx'), 'utf-8')
    expect(src).toContain('useSearchParams')
    expect(src).toContain("searchParams.get('mode')")
  })

  test('App.jsx has redirect from /wishlist to /shop', () => {
    const src = fs.readFileSync(path.resolve('src/App.jsx'), 'utf-8')
    expect(src).toContain("/wishlist")
    expect(src).toContain("Navigate to=\"/shop\"")
  })
})
