import { create } from 'zustand'

let nextId = 1

export const useToast = create((set, get) => ({
  toasts: [],

  addToast: (message, type = 'success', duration = 3000) => {
    const id = nextId++
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration, createdAt: Date.now(), removing: false }],
    }))
    setTimeout(() => get().removeToast(id), duration)
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, removing: true } : t)),
    }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 300)
  },
}))
