import { test, expect } from '@playwright/test'

test.describe('Cart/bell icon swap', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('cart link is NOT in header', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const cartInHeader = page.locator('header a[href="/cart"]')
    await expect(cartInHeader).toHaveCount(0)
  })

  test('notification bell IS in header', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bellInHeader = page.locator('header a[href="/notifications"]')
    await expect(bellInHeader).toBeVisible()
  })

  test('cart link IS in bottom nav', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('[class*="fixed"][class*="bottom-0"]')
    const cartInNav = bottomNav.locator('a[href="/cart"]')
    await expect(cartInNav).toBeVisible()
  })

  test('notification bell is NOT in bottom nav', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('[class*="fixed"][class*="bottom-0"]')
    const bellInNav = bottomNav.locator('a[href="/notifications"]')
    await expect(bellInNav).toHaveCount(0)
  })

  test('clicking cart in bottom nav navigates to /cart', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('[class*="fixed"][class*="bottom-0"]')
    const cartLink = bottomNav.locator('a[href="/cart"]')
    await cartLink.click()
    await page.waitForURL('**/cart')
    await expect(page.locator('h1, h2').filter({ hasText: /Cart|Bag/i }).first()).toBeVisible()
  })

  test('clicking bell in header navigates to /notifications', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bellLink = page.locator('header a[href="/notifications"]')
    await bellLink.click()
    await page.waitForURL('**/notifications')
    await expect(page.locator('h1, h2').filter({ hasText: /Notifications|Alerts|Sign in/i }).first()).toBeVisible()
  })
})
