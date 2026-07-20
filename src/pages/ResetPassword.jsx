import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    async function init() {
      const code = searchParams.get('code')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setError(error.message)
          return
        }
        setReady(true)
      } else if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        if (error) {
          setError(error.message)
          return
        }
        setReady(true)
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setReady(true)
        } else {
          setError('Invalid or expired reset link. Please request a new one.')
        }
      }
    }
    init()
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!password || !confirm) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-gold-500 font-display">KBF</span>
            </div>
          </Link>
          <h1 className="text-2xl font-display font-semibold text-emerald-600">
            {success ? 'Password Updated' : 'Set New Password'}
          </h1>
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body mt-1">
            {success ? 'Redirecting to sign in...' : 'Enter your new password below'}
          </p>
        </div>

        {success ? (
          <div className="card p-6 lg:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[#1C1C1C] dark:text-gray-200 font-body">
              Your password has been reset successfully.
            </p>
            <Link to="/login" className="btn-gold inline-block px-6 py-2.5 text-sm">Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 lg:p-8 space-y-4">
            {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">{error}</p>}
            {!ready && !error && <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-lg">Verifying your reset link...</p>}
            {error && (
              <Link to="/forgot-password" className="btn-gold w-full py-3 text-center inline-block">Request New Reset Link</Link>
            )}
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="At least 6 characters" disabled={!ready} />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Confirm New Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field" placeholder="Re-enter your new password" disabled={!ready} />
            </div>
            <button type="submit" disabled={loading || !ready} className="btn-gold w-full py-3 disabled:opacity-50">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-[#6B6B6B] dark:text-gray-400 font-body mt-4">
          <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">Back to Sign In</Link>
        </p>
      </div>
    </div>
  )
}
