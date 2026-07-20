import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Please enter your email address')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset email')
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
          <h1 className="text-2xl font-display font-semibold text-emerald-600">Reset Password</h1>
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body mt-1">
            {sent ? 'Check your email' : 'Enter your email to receive a reset link'}
          </p>
        </div>

        {sent ? (
          <div className="card p-6 lg:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[#1C1C1C] dark:text-gray-200 font-body">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <p className="text-sm text-[#6B6B6B] dark:text-gray-400 font-body">
              Didn't receive it?{' '}
              <button onClick={() => { setSent(false); setError('') }} className="text-emerald-600 hover:text-emerald-700 font-medium bg-transparent border-none p-0 underline cursor-pointer">
                Try again
              </button>
            </p>
            <Link to="/login" className="btn-gold inline-block px-6 py-2.5 text-sm">Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 lg:p-8 space-y-4">
            {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">{error}</p>}
            <div>
              <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="your@email.com" />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-3 disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-[#6B6B6B] dark:text-gray-400 font-body mt-4">
          Remember your password?{' '}
          <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
