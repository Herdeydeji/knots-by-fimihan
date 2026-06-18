import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

function seedCart(page, items) {
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  return page.evaluate(
    ({ items, itemCount, subtotal }) => {
      localStorage.setItem(
        'kbf-cart',
        JSON.stringify({ state: { items, itemCount, subtotal }, version: 0 })
      )
    },
    { items, itemCount, subtotal }
  )
}

test.describe('Cart Stock Validation', () => {
  test('+ button is disabled when quantity equals stock', async ({ page }) => {
    await page.goto(BASE)
    await page.evaluate(() => localStorage.removeItem('kbf-cart'))
    await seedCart(page, [{
      id: 'test-1',
      key: 'test-1--',
      name: 'Test Abaya',
      slug: 'test-abaya',
      price: 15000,
      image: '',
      quantity: 2,
      size: null,
      color: null,
      stock: 2,
    }])
    await page.goto(`${BASE}/cart`)
    await page.waitForURL('**/cart')

    const plusBtn = page.locator('.card button').nth(1)
    await expect(plusBtn).toBeDisabled()
  })

  test('+ button becomes enabled after decrementing below stock', async ({ page }) => {
    await page.goto(BASE)
    await page.evaluate(() => localStorage.removeItem('kbf-cart'))
    await seedCart(page, [{
      id: 'test-2',
      key: 'test-2--',
      name: 'Test Hijab',
      slug: 'test-hijab',
      price: 5000,
      image: '',
      quantity: 2,
      size: null,
      color: null,
      stock: 3,
    }])
    await page.goto(`${BASE}/cart`)
    await page.waitForURL('**/cart')

    const buttons = page.locator('.card button')
    const minusBtn = buttons.nth(0)
    const plusBtn = buttons.nth(1)

    await expect(plusBtn).not.toBeDisabled()
    await minusBtn.click()
    await expect(plusBtn).toBeEnabled()
  })

  test('shows low stock warning when stock is 5 or less', async ({ page }) => {
    await page.goto(BASE)
    await page.evaluate(() => localStorage.removeItem('kbf-cart'))
    await seedCart(page, [{
      id: 'test-3',
      key: 'test-3--',
      name: 'Test Kaftan',
      slug: 'test-kaftan',
      price: 25000,
      image: '',
      quantity: 1,
      size: null,
      color: null,
      stock: 3,
    }])
    await page.goto(`${BASE}/cart`)
    await page.waitForURL('**/cart')

    await expect(page.getByText('Only 3 left')).toBeVisible()
  })

  test('does not show low stock warning when stock > 5', async ({ page }) => {
    await page.goto(BASE)
    await page.evaluate(() => localStorage.removeItem('kbf-cart'))
    await seedCart(page, [{
      id: 'test-4',
      key: 'test-4--',
      name: 'Test Accessory',
      slug: 'test-accessory',
      price: 3000,
      image: '',
      quantity: 1,
      size: null,
      color: null,
      stock: 10,
    }])
    await page.goto(`${BASE}/cart`)
    await page.waitForURL('**/cart')

    await expect(page.getByText('Only')).toHaveCount(0)
  })
})
