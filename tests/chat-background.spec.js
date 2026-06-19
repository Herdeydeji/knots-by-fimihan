import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('Chat WhatsApp-style background', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('chat page message area has warm background', async ({ page }) => {
    await page.goto('/style-assistant')
    await page.waitForLoadState('networkidle')

    const chatContainer = page.locator('div.flex-1.overflow-y-auto').first()
    await expect(chatContainer).toBeAttached()

    const bg = await chatContainer.evaluate((el) => {
      const cs = window.getComputedStyle(el)
      return {
        backgroundColor: cs.backgroundColor,
        backgroundImage: cs.backgroundImage,
      }
    })

    expect(bg.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(bg.backgroundColor).not.toBe('transparent')
    expect(bg.backgroundImage).not.toBe('none')
  })

  test('admin chat source has WhatsApp background class', () => {
    const src = fs.readFileSync(path.resolve('src/pages/admin/AdminChat.jsx'), 'utf-8')
    expect(src).toContain('bg-[#e8ddd3]')
    expect(src).toContain('repeating-linear-gradient')
  })
})
