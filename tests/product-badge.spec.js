import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('Product discount badge position', () => {
  test('discount badge uses bottom-4 left-4 instead of top-4 left-4', () => {
    const src = fs.readFileSync(path.resolve('src/pages/ProductDetail.jsx'), 'utf-8')
    expect(src).toContain('absolute bottom-4 left-4 bg-gold-500')
    expect(src).not.toContain('absolute top-4 left-4 bg-gold-500')
  })
})
