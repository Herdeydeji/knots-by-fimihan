import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const files = {
  layout: 'src/components/layout/Layout.jsx',
  toasts: 'src/components/ui/Toasts.jsx',
  toastStore: 'src/stores/useToast.js',
  productDetail: 'src/pages/ProductDetail.jsx',
  productCard: 'src/components/ui/ProductCard.jsx',
  cart: 'src/pages/Cart.jsx',
  checkout: 'src/pages/Checkout.jsx',
  profile: 'src/pages/Profile.jsx',
  orders: 'src/pages/Orders.jsx',
  footer: 'src/components/layout/Footer.jsx',
  addProduct: 'src/pages/admin/AddProduct.jsx',
  editProduct: 'src/pages/admin/EditProduct.jsx',
  adminProducts: 'src/pages/admin/AdminProducts.jsx',
  heroSlides: 'src/pages/admin/HeroSlides.jsx',
  advertisements: 'src/pages/admin/Advertisements.jsx',
  adminUsers: 'src/pages/admin/AdminUsers.jsx',
}

function read(fp) {
  return fs.readFileSync(path.resolve(fp), 'utf-8')
}

test.describe('Toast infrastructure', () => {
  test('useToast store exists with correct API', () => {
    const src = read(files.toastStore)
    expect(src).toContain('addToast')
    expect(src).toContain('removeToast')
    expect(src).toContain('toasts')
    expect(src).toContain('zustand')
  })

  test('Toasts component renders with sound and haptic', () => {
    const src = read(files.toasts)
    expect(src).toContain('AudioContext')
    expect(src).toContain('ctx.resume()')
    expect(src).toContain('createOscillator')
    expect(src).toContain('navigator.vibrate')
    expect(src).toContain('bottom-20')
    expect(src).toContain('z-[9999]')
  })

  test('Layout.jsx includes Toasts component', () => {
    const src = read(files.layout)
    expect(src).toContain('import Toasts')
    expect(src).toContain('<Toasts />')
  })
})

test.describe('Toast integration in pages', () => {
  test('ProductDetail — like, add-to-cart, review toasts', () => {
    const src = read(files.productDetail)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Added to Bag")
    expect(src).toContain("addToast(wasLiked ? 'Added to Wishlist")
    expect(src).toContain("addToast('Review submitted")
    expect(src).toContain("addToast('Failed to submit review")
  })

  test('ProductCard — like toast', () => {
    const src = read(files.productCard)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast(wasLiked ? 'Added to Wishlist")
    expect(src).toContain("addToast('Failed to update wishlist")
  })

  test('Cart — remove-item toast', () => {
    const src = read(files.cart)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Removed from Bag")
  })

  test('Checkout — payment error toasts', () => {
    const src = read(files.checkout)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Payment system is still loading")
    expect(src).toContain("addToast('Payment popup was blocked")
  })

  test('Profile — save profile toast', () => {
    const src = read(files.profile)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Profile updated")
    expect(src).toContain("addToast(error.message, 'error')")
  })

  test('Orders — cancel order toast', () => {
    const src = read(files.orders)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Order cancelled")
    expect(src).toContain("addToast('Failed to cancel order")
  })

  test('Footer — newsletter subscribe toast', () => {
    const src = read(files.footer)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Subscribed!")
    expect(src).toContain("addToast('Failed to subscribe")
  })
})

test.describe('Toast integration in admin pages', () => {
  test('AddProduct — upload and submit toasts', () => {
    const src = read(files.addProduct)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Error uploading images")
    expect(src).toContain("addToast('Error: ")
  })

  test('EditProduct — load, upload, submit toasts', () => {
    const src = read(files.editProduct)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Product not found")
    expect(src).toContain("addToast('Error uploading images")
    expect(src).toContain("addToast('Product updated successfully!")
  })

  test('AdminProducts — delete toast', () => {
    const src = read(files.adminProducts)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Product deleted'")
    expect(src).toContain("addToast('Failed to delete product")
  })

  test('HeroSlides — save, delete, toggle toasts', () => {
    const src = read(files.heroSlides)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Error: ")
    expect(src).toContain("addToast('Failed to delete slide")
    expect(src).toContain("addToast('Failed to update slide")
  })

  test('Advertisements — save, delete, toggle toasts', () => {
    const src = read(files.advertisements)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast('Error: ")
    expect(src).toContain("addToast('Failed to delete advertisement")
    expect(src).toContain("addToast('Failed to update advertisement")
  })

  test('AdminUsers — toggle admin toast', () => {
    const src = read(files.adminUsers)
    expect(src).toContain('useToast')
    expect(src).toContain("addToast(error.message, 'error')")
    expect(src).toContain("addToast(alreadyAdmin ? 'Admin access revoked'")
  })
})
