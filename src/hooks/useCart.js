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
          const existing = state.items.find(
            (item) => item.id === product.id && item.size === size && item.color === color
          )
          let updated
          if (existing) {
            updated = state.items.map((item) =>
              item.id === product.id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          } else {
            updated = [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0],
                quantity,
                size,
                color,
              },
            ]
          }
          const itemCount = updated.reduce((sum, i) => sum + i.quantity, 0)
          const subtotal = updated.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: updated, itemCount, subtotal }
        })
      },

      removeItem: (productId, size, color) => {
        set((state) => {
          const updated = state.items.filter(
            (item) => !(item.id === productId && item.size === size && item.color === color)
          )
          const itemCount = updated.reduce((sum, i) => sum + i.quantity, 0)
          const subtotal = updated.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: updated, itemCount, subtotal }
        })
      },

      updateQuantity: (productId, size, color, quantity) => {
        set((state) => {
          const updated = state.items.map((item) =>
            item.id === productId && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
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
