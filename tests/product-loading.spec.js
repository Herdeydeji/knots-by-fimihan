import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('Product page loading state', () => {
  test('ProductDetail has loading state before product data', () => {
    const src = fs.readFileSync(path.resolve('src/pages/ProductDetail.jsx'), 'utf-8')
    expect(src).toContain('const [loading, setLoading] = useState(true)')
    expect(src).toContain('if (loading)')
    expect(src).toContain('animate-scale-in-out')
  })

  test('ProductDetail shows loading before checking product', () => {
    const src = fs.readFileSync(path.resolve('src/pages/ProductDetail.jsx'), 'utf-8')
    const loadingIdx = src.indexOf('if (loading)')
    const productIdx = src.indexOf('if (!product)')
    expect(loadingIdx).toBeGreaterThan(-1)
    expect(productIdx).toBeGreaterThan(-1)
    expect(loadingIdx).toBeLessThan(productIdx)
  })
})
