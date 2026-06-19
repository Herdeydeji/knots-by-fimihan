import { test, expect } from '@playwright/test'

async function scrollAndCheck(page) {
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
  await page.evaluate(() => window.scrollTo(0, 500))
  await page.waitForTimeout(200)
}

async function getBottomNav(page) {
  return page.locator('[class*="fixed"][class*="bottom-0"]')
}

async function getAddToCartBar(page) {
  return page.locator('[class*="fixed"][class*="bottom-0"].safe-bottom')
}

test.describe('Header fixed positioning on mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('header is fixed at top-0 on home page', async ({ page }) => {
    await page.goto('/')
    await scrollAndCheck(page)
    const cs = await page.locator('header').evaluate((el) => window.getComputedStyle(el).position)
    expect(cs).toBe('fixed')
    const top = await page.locator('header').evaluate((el) => el.getBoundingClientRect().top)
    expect(top).toBe(0)
  })

  test('header is fixed at top-0 on shop page', async ({ page }) => {
    await page.goto('/shop')
    await scrollAndCheck(page)
    const cs = await page.locator('header').evaluate((el) => window.getComputedStyle(el).position)
    expect(cs).toBe('fixed')
    const top = await page.locator('header').evaluate((el) => el.getBoundingClientRect().top)
    expect(top).toBe(0)
  })

  test('header is fixed at top-0 on product page', async ({ page }) => {
    await page.goto('/product/premium-crepe-abaya')
    await scrollAndCheck(page)
    const cs = await page.locator('header').evaluate((el) => window.getComputedStyle(el).position)
    expect(cs).toBe('fixed')
  })

  test('header is fixed at top-0 on cart page', async ({ page }) => {
    await page.goto('/cart')
    await scrollAndCheck(page)
    const cs = await page.locator('header').evaluate((el) => window.getComputedStyle(el).position)
    expect(cs).toBe('fixed')
    const top = await page.locator('header').evaluate((el) => el.getBoundingClientRect().top)
    expect(top).toBe(0)
  })
})

test.describe('Header fixed on small phone (320px)', () => {
  test.use({ viewport: { width: 320, height: 568 } })

  test('header is fixed at top-0 on home page at 320px', async ({ page }) => {
    await page.goto('/')
    await scrollAndCheck(page)
    const cs = await page.locator('header').evaluate((el) => window.getComputedStyle(el).position)
    expect(cs).toBe('fixed')
    const top = await page.locator('header').evaluate((el) => el.getBoundingClientRect().top)
    expect(top).toBe(0)
  })

  test('header is fixed at top-0 on shop page at 320px', async ({ page }) => {
    await page.goto('/shop')
    await scrollAndCheck(page)
    const cs = await page.locator('header').evaluate((el) => window.getComputedStyle(el).position)
    expect(cs).toBe('fixed')
    const top = await page.locator('header').evaluate((el) => el.getBoundingClientRect().top)
    expect(top).toBe(0)
  })
})

test.describe('Bottom nav fixed positioning on mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('bottom nav is fixed at bottom on home page', async ({ page }) => {
    await page.goto('/')
    await scrollAndCheck(page)
    const nav = await getBottomNav(page)
    const cs = await nav.evaluate((el) => window.getComputedStyle(el).position)
    expect(cs).toBe('fixed')
    const box = await nav.boundingBox()
    expect(box).not.toBeNull()
    expect(box.y + box.height).toBe(667)
  })

  test('bottom nav is fixed at bottom on shop page', async ({ page }) => {
    await page.goto('/shop')
    await scrollAndCheck(page)
    const nav = await getBottomNav(page)
    const cs = await nav.evaluate((el) => window.getComputedStyle(el).position)
    expect(cs).toBe('fixed')
    const box = await nav.boundingBox()
    expect(box).not.toBeNull()
    expect(box.y + box.height).toBe(667)
  })

  test('add-to-cart bar is fixed at bottom-0 on product page', async ({ page }) => {
    await page.goto('/product/premium-crepe-abaya')
    await scrollAndCheck(page)
    const bar = await getAddToCartBar(page)
    const cs = await bar.evaluate((el) => window.getComputedStyle(el).position)
    expect(cs).toBe('fixed')
    const box = await bar.boundingBox()
    expect(box).not.toBeNull()
    expect(box.y + box.height).toBe(667)
  })

  test('bottom nav is not rendered on product page', async ({ page }) => {
    await page.goto('/product/premium-crepe-abaya')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => page.waitForTimeout(3000))
    const hasBottomNav = await page.locator('nav').evaluateAll((els) =>
      els.some((el) => window.getComputedStyle(el).position === 'fixed')
    )
    expect(hasBottomNav).toBe(false)
  })

  test('bottom nav is fixed at bottom on cart page', async ({ page }) => {
    await page.goto('/cart')
    await scrollAndCheck(page)
    const nav = await getBottomNav(page)
    const cs = await nav.evaluate((el) => window.getComputedStyle(el).position)
    expect(cs).toBe('fixed')
    const box = await nav.boundingBox()
    expect(box).not.toBeNull()
    expect(box.y + box.height).toBe(667)
  })
})

test.describe('Bell icon in fixed header on mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('notification bell is inside fixed header after scroll', async ({ page }) => {
    await page.goto('/')
    await scrollAndCheck(page)
    const bellLink = page.locator('header a[href="/notifications"]')
    await expect(bellLink).toBeVisible()
    const headerBox = await page.locator('header').boundingBox()
    const bellBox = await bellLink.boundingBox()
    expect(headerBox).not.toBeNull()
    expect(bellBox).not.toBeNull()
    expect(bellBox.y).toBeGreaterThanOrEqual(headerBox.y)
    expect(bellBox.y + bellBox.height).toBeLessThanOrEqual(headerBox.y + headerBox.height)
  })
})

test.describe('Cart icon in fixed bottom nav on mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('cart link is inside fixed bottom nav after scroll', async ({ page }) => {
    await page.goto('/shop')
    await scrollAndCheck(page)
    const bottomNav = await getBottomNav(page)
    const cartLink = bottomNav.locator('a[href="/cart"]')
    await expect(cartLink).toBeVisible()
    const navBox = await bottomNav.boundingBox()
    const cartBox = await cartLink.boundingBox()
    expect(navBox).not.toBeNull()
    expect(cartBox).not.toBeNull()
    expect(cartBox.y).toBeGreaterThanOrEqual(navBox.y)
    expect(cartBox.y + cartBox.height).toBeLessThanOrEqual(navBox.y + navBox.height)
  })
})

test.describe('Main content clearance on mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('main content top padding clears header on home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const h = await page.locator('header').evaluate((el) => el.offsetHeight)
    const pt = await page.locator('main').evaluate((el) => parseFloat(window.getComputedStyle(el).paddingTop))
    expect(pt).toBeGreaterThanOrEqual(h - 4)
  })

  test('main content bottom padding clears bottom nav on shop page', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => page.waitForTimeout(3000))
    const pb = await page.locator('main').evaluate((el) => parseFloat(window.getComputedStyle(el).paddingBottom))
    expect(pb).toBeGreaterThanOrEqual(60)
  })
})
