import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

function getStoredUser() {
  try {
    const stored = localStorage.getItem('kbf-user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [authModal, setAuthModal] = useState({ open: false, returnPath: null })

  const login = useCallback((email, password) => {
    const mockUser = {
      id: 'user_001',
      email,
      name: email.split('@')[0],
    }
    setUser(mockUser)
    localStorage.setItem('kbf-user', JSON.stringify(mockUser))
    return mockUser
  }, [])

  const signup = useCallback((name, email, password) => {
    const mockUser = { id: 'user_' + Date.now(), email, name }
    setUser(mockUser)
    localStorage.setItem('kbf-user', JSON.stringify(mockUser))
    return mockUser
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('kbf-user')
  }, [])

  const openAuthModal = useCallback((returnPath) => {
    setAuthModal({ open: true, returnPath })
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModal({ open: false, returnPath: null })
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, authModal, openAuthModal, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
