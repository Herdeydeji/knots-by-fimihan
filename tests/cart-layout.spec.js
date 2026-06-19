import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('Cart page mobile layout', () => {
  test('source has pb-28 on main container for mobile clearance', () => {
    const src = fs.readFileSync(path.resolve('src/pages/Cart.jsx'), 'utf-8')
    expect(src).toContain('pb-28 lg:pb-8')
  })

  test('checkout bar is fixed at bottom-0', () => {
    const src = fs.readFileSync(path.resolve('src/pages/Cart.jsx'), 'utf-8')
    expect(src).toContain('fixed bottom-0 left-0 right-0')
  })

  test('bottom nav is not rendered on cart page', async ({ page }) => {
    await page.goto('/cart')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => page.waitForTimeout(3000))
    const hasBottomNav = await page.locator('nav').evaluateAll((els) =>
      els.some((el) => window.getComputedStyle(el).position === 'fixed')
    )
    expect(hasBottomNav).toBe(false)
  })
})
