import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('Checkout page mobile layout', () => {
  test('source has pb-36 on main container for mobile clearance', () => {
    const src = fs.readFileSync(
      path.resolve('src/pages/Checkout.jsx'),
      'utf-8',
    )
    expect(src).toContain('pb-36 lg:pb-8')
  })
})
