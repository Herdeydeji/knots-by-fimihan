import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('Checkout page mobile layout', () => {
  test('source has pb-28 on main container for mobile clearance', () => {
    const src = fs.readFileSync(
      path.resolve('src/pages/Checkout.jsx'),
      'utf-8',
    )
    expect(src).toContain('pb-28 lg:pb-8')
  })

  test('Pay Now bar is fixed at bottom-0', () => {
    const src = fs.readFileSync(
      path.resolve('src/pages/Checkout.jsx'),
      'utf-8',
    )
    expect(src).toContain('fixed bottom-0 left-0 right-0')
    expect(src).toContain('Pay Now')
  })
})
