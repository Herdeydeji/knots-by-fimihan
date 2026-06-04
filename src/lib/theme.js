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

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const stored = localStorage.getItem('kbf-theme')
if (stored) {
  const parsed = JSON.parse(stored)
  if (parsed?.state?.dark) {
    document.documentElement.classList.add('dark')
  }
} else if (mediaQuery.matches) {
  document.documentElement.classList.add('dark')
  useTheme.getState().setDark(true)
}

mediaQuery.addEventListener('change', (e) => {
  const state = useTheme.getState()
  if (!localStorage.getItem('kbf-theme')) {
    state.setDark(e.matches)
  }
})
