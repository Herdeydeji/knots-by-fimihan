import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTheme = create(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        const next = !get().dark
        document.documentElement.classList.toggle('dark', next)
        set({ dark: next })
      },
      setDark: (val) => {
        document.documentElement.classList.toggle('dark', val)
        set({ dark: val })
      },
    }),
    { name: 'kbf-theme' }
  )
)

const stored = localStorage.getItem('kbf-theme')
if (stored) {
  const parsed = JSON.parse(stored)
  if (parsed?.state?.dark) {
    document.documentElement.classList.add('dark')
  }
}
