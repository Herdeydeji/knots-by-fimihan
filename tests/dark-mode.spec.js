import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

test.describe('Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await page.evaluate(() => localStorage.removeItem('kbf-theme'))
  })

  test('toggles via sun/moon button in header', async ({ page }) => {
    const toggle = page.locator('button[aria-label="Toggle theme"]')
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await toggle.click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('persists after navigation', async ({ page }) => {
    const toggle = page.locator('button[aria-label="Toggle theme"]')
    await toggle.click()
    await page.locator('a[href*="shop"]').first().click()
    await page.waitForURL('**/shop*')
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('admin pages render in both modes', async ({ page }) => {
    const toggle = page.locator('button[aria-label="Toggle theme"]')

    for (const mode of ['light', 'dark']) {
      if (mode === 'dark') await toggle.click()
      await page.goto(`${BASE}/admin/dashboard`)
      await page.waitForURL('**/admin/dashboard*')
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('store pages have no flash of wrong colors in dark mode', async ({ page }) => {
    const toggle = page.locator('button[aria-label="Toggle theme"]')
    await toggle.click()

    const pages = ['/', '/shop', '/contact', '/about']
    for (const p of pages) {
      await page.goto(`${BASE}${p}`)
      await expect(page.locator('html')).toHaveClass(/dark/)
    }
  })
})
