import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    signup(name, email, password)
    const from = searchParams.get('from') || '/'
    navigate(from)
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
          <h1 className="text-2xl font-display font-semibold text-emerald-600">Create Account</h1>
          <p className="text-[#6B6B6B] font-body mt-1">Join Knots by Fimihan</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 lg:p-8 space-y-4">
          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-body font-medium text-[#1C1C1C] mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="e.g. Aisha Mohammed" />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-[#1C1C1C] mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-[#1C1C1C] mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="At least 6 characters" />
          </div>
          <button type="submit" className="btn-gold w-full py-3">Create Account</button>
        </form>

        <p className="text-center text-sm text-[#6B6B6B] font-body mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
