import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export default function AuthModal() {
  const { authModal, closeAuthModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authModal?.open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [authModal?.open])

  if (!authModal?.open) return null

  const returnPath = authModal.returnPath || '/'

  const handleSignIn = () => {
    closeAuthModal()
    navigate(`/login?from=${encodeURIComponent(returnPath)}`)
  }

  const handleSignUp = () => {
    closeAuthModal()
    navigate(`/signup?from=${encodeURIComponent(returnPath)}`)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAuthModal} />
      <div className="relative bg-cream-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-cream-200 dark:border-gray-700">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gold-100 dark:bg-gold-900/40 flex items-center justify-center">
          <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-lg text-[#1C1C1C] dark:text-gray-200">Sign In Required</h3>
        <p className="text-sm text-[#6B6B6B] dark:text-gray-400 mt-2 leading-relaxed">
          Please sign in or create an account to continue with this action.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleSignIn}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-body font-medium hover:bg-emerald-700 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUp}
            className="w-full border-2 border-emerald-600 text-emerald-600 py-2.5 rounded-xl font-body font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
          >
            Create Account
          </button>
          <button
            onClick={closeAuthModal}
            className="text-sm text-[#6B6B6B] dark:text-gray-400 hover:text-[#1C1C1C] dark:hover:text-gray-200 transition-colors py-1"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  )
}
