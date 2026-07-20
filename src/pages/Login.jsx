import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    try {
      await login(email, password)
      const from = searchParams.get('from') || '/'
      navigate(from)
    } catch (err) {
      setError(err.message || 'Invalid email or password')
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
          <h1 className="text-2xl font-display font-semibold text-emerald-600">Welcome Back</h1>
          <p className="text-[#6B6B6B] dark:text-gray-400 font-body mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 lg:p-8 space-y-4">
          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Enter your password" />
          </div>
          <div className="flex justify-end -mt-2">
            <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Forgot Password?</Link>
          </div>
          <button type="submit" className="btn-gold w-full py-3">Sign In</button>
        </form>

        <p className="text-center text-sm text-[#6B6B6B] dark:text-gray-400 font-body mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-600 font-medium hover:text-emerald-700">Create one</Link>
        </p>
      </div>
    </div>
  )
}
