import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,

      addItem: (product, quantity = 1, size, color) => {
        set((state) => {
          const key = `${product.id}-${size || ''}-${color || ''}`
          const stock = product.stock ?? 0
          const existing = state.items.find((item) => item.key === key)
          let updated
          if (existing) {
            const newQty = Math.min(existing.quantity + quantity, stock)
            updated = state.items.map((item) =>
              item.key === key ? { ...item, quantity: newQty, stock } : item
            )
          } else {
            const qty = Math.min(quantity, stock)
            updated = [
              ...state.items,
              {
                id: product.id,
                key,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images?.[0] || '',
                quantity: qty,
                size,
                color,
                stock,
              },
            ]
          }
          const itemCount = updated.reduce((sum, i) => sum + i.quantity, 0)
          const subtotal = updated.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: updated, itemCount, subtotal }
        })
      },

      removeItem: (key) => {
        set((state) => {
          const updated = state.items.filter((item) => item.key !== key)
          const itemCount = updated.reduce((sum, i) => sum + i.quantity, 0)
          const subtotal = updated.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: updated, itemCount, subtotal }
        })
      },

      updateQuantity: (key, quantity) => {
        set((state) => {
          const updated = state.items.map((item) =>
            item.key === key ? { ...item, quantity: Math.min(quantity, item.stock) } : item
          )
          const itemCount = updated.reduce((sum, i) => sum + i.quantity, 0)
          const subtotal = updated.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: updated, itemCount, subtotal }
        })
      },

      clearCart: () => set({ items: [], itemCount: 0, subtotal: 0 }),
    }),
    { name: 'kbf-cart' }
  )
)
