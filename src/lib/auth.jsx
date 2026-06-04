import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'
import { getWishlist, toggleWishlist } from './wishlist'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authModal, setAuthModal] = useState({ open: false, returnPath: null })
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        getWishlist(u.id).then(setWishlist).catch(() => setWishlist([]))
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        getWishlist(u.id).then(setWishlist).catch(() => setWishlist([]))
      } else {
        setWishlist([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  }, [])

  const signup = useCallback(async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    if (error) throw error
    return data.user
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const openAuthModal = useCallback((returnPath) => {
    setAuthModal({ open: true, returnPath })
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModal({ open: false, returnPath: null })
  }, [])

  const handleToggleLike = useCallback(async (productId) => {
    if (!user) return
    const isLiked = await toggleWishlist(user.id, productId)
    setWishlist((prev) =>
      isLiked ? [...prev, productId] : prev.filter((id) => id !== productId)
    )
    return isLiked
  }, [user])

  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, authModal, openAuthModal, closeAuthModal, wishlist, toggleLike: handleToggleLike }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
