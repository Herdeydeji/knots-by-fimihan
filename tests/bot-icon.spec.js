import { test, expect } from '@playwright/test'

test.describe('Bot icon positioning on mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('bot icon has correct bottom position on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('button[aria-label="Open AI style assistant"]')

    const botIcon = page.locator('button[aria-label="Open AI style assistant"]')

    const bottom = await botIcon.evaluate(el => window.getComputedStyle(el).bottom)

    expect(bottom).toBe('112px')
  })

  test('bot icon is visible and above bottom nav on mobile', async ({ page }) => {
    await page.goto('/')
    const botIcon = page.locator('button[aria-label="Open AI style assistant"]')
    await expect(botIcon).toBeVisible()

    const box = await botIcon.boundingBox()
    expect(box).not.toBeNull()
    // bot bottom should be well above viewport bottom (112px from bottom)
    expect(box.y + box.height).toBeLessThanOrEqual(667 - 112 + 5)
  })
})
