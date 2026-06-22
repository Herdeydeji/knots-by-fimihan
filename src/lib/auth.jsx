import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from './supabase'
import { getWishlist, toggleWishlist } from './wishlist'
import { useNotifications } from '../hooks/useNotifications'
import { requestPermissionAndSubscribe, unsubscribe as unsubscribePush, sendPushNotification } from './pushNotifications'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authModal, setAuthModal] = useState({ open: false, returnPath: null })
  const [wishlist, setWishlist] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const userIdRef = useRef(null)

  const notifStore = useNotifications

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      userIdRef.current = u?.id || null
      if (u) {
        await Promise.all([
          getWishlist(u.id).then(setWishlist).catch(() => setWishlist([])),
          checkAdmin(u.id).then(setIsAdmin).catch(() => setIsAdmin(false)),
        ])
        notifStore.getState().init(u)
        requestPermissionAndSubscribe(u.id)
      } else {
        notifStore.getState().cleanup()
        if (userIdRef.current) unsubscribePush(userIdRef.current)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      const prevId = userIdRef.current
      userIdRef.current = u?.id || null
      if (u) {
        getWishlist(u.id).then(setWishlist).catch(() => setWishlist([]))
        checkAdmin(u.id).then(setIsAdmin).catch(() => setIsAdmin(false))
        notifStore.getState().init(u)
        requestPermissionAndSubscribe(u.id)
      } else {
        setWishlist([])
        setIsAdmin(false)
        notifStore.getState().cleanup()
        if (prevId) unsubscribePush(prevId)
      }
    })

    return () => {
      subscription.unsubscribe()
      notifStore.getState().cleanup()
    }
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

  const checkAdmin = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()
    return data?.is_admin ?? false
  }

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const openAuthModal = useCallback((returnPath) => {
    setAuthModal({ open: true, returnPath })
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModal({ open: false, returnPath: null })
  }, [])

  const handleToggleLike = useCallback(async (productId, productName) => {
    if (!user) return
    const isLiked = await toggleWishlist(user.id, productId)
    setWishlist((prev) =>
      isLiked ? [...prev, productId] : prev.filter((id) => id !== productId)
    )
    if (isLiked && productName) {
      sendPushNotification(user.id, {
        title: 'Added to Wishlist',
        body: `${productName} has been added to your wishlist.`,
        url: '/wishlist',
      })
    }
    return isLiked
  }, [user])

  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, authModal, openAuthModal, closeAuthModal, wishlist, toggleLike: handleToggleLike, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
