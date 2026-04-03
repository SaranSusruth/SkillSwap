/**
 * Login Page Component
 * Simple first-version login form with clear controls.
 */
import React, { useState } from 'react'
import BrandLogo from '../components/BrandLogo'

const Login = ({ onLogin, onPageChange }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setError('')
    setLoading(true)

    try {
      await onLogin({ email, password })
      onPageChange('dashboard')
    } catch (err) {
      const backendMessage = err?.response?.data?.error
      setError(backendMessage || 'Login failed. Please check your credentials.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="mb-4">
          <BrandLogo textSize="text-lg" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Skill Swap Login</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>

        {error && <div className="mb-4 text-sm text-rose-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@college.edu"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-3 text-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-md hover:shadow-lg"
          >
            {loading ? 'Signing in...' : '🔐 SIGN IN'}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          <div className="mt-2">
            <button
              onClick={() => onPageChange('signup')}
              className="text-blue-600 hover:text-blue-700 font-bold underline text-base"
              type="button"
            >
              ➕ Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
