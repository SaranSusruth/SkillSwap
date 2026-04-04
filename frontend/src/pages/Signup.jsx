/**
 * Signup Page Component
 * User registration form with validation
 */
import React, { useState } from 'react'
import BrandLogo from '../components/BrandLogo'

const isGmailAddress = (value) => String(value || '').trim().toLowerCase().endsWith('@gmail.com')

const Signup = ({ onSignup, onSendVerificationCode, onVerifyEmailCode, onPageChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationToken, setVerificationToken] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === 'email') {
      setCodeSent(false)
      setEmailVerified(false)
      setVerificationCode('')
      setVerificationToken('')
      setMessage('')
      setError('')
    }
  }

  const handleSendCode = async () => {
    if (!formData.email) {
      setError('Enter your Gmail address first')
      return
    }

    if (!isGmailAddress(formData.email)) {
      setError('Please use a Gmail address')
      return
    }

    try {
      setError('')
      setMessage('Sending verification code...')
      setLoading(true)
      const response = await onSendVerificationCode(formData.email)
      setVerificationToken(response.verificationToken)
      setCodeSent(true)
      setEmailVerified(false)
      if (response.delivery === 'fallback' && response.verificationCode) {
        setVerificationCode(String(response.verificationCode))
        setMessage(`Email service is currently unavailable. Use this code to continue: ${response.verificationCode}`)
      } else {
        setMessage('Verification code sent to your Gmail address')
      }
    } catch (err) {
      setMessage('')
      setError(err.response?.data?.error || 'Unable to send verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || !verificationToken) {
      setError('Enter the verification code sent to your email')
      return
    }

    try {
      setError('')
      setMessage('Verifying code...')
      setLoading(true)
      await onVerifyEmailCode({
        email: formData.email,
        code: verificationCode,
        verificationToken,
      })
      setEmailVerified(true)
      setMessage('Email verified successfully')
    } catch (err) {
      setMessage('')
      setError(err.response?.data?.error || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!emailVerified || !verificationToken) {
      setError('Please verify your Gmail address before creating the account')
      return
    }

    setError('')
    setLoading(true)

    try {
      await onSignup({
        ...formData,
        emailVerificationToken: verificationToken,
      })
      onPageChange('dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.')
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
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Create Account</h1>
        <p className="text-sm text-slate-500 mb-6">Join the Skill Swap community</p>

        {error && <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 border border-rose-200">{error}</div>}
        {message && !error && <div className="mb-4 rounded-lg bg-cyan-50 px-3 py-2 text-sm text-cyan-700 border border-cyan-200">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-slate-700">Full Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@gmail.com"
            />
            <p className="mt-1 text-xs text-slate-500">Gmail addresses only.</p>
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading || !formData.email}
              className="flex-1 rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-100 disabled:opacity-70"
            >
              Send Verification Code
            </button>
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={loading || !codeSent || !verificationCode}
              className="flex-1 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-70"
            >
              Verify Code
            </button>
          </div>

          {codeSent && (
            <label className="block">
              <span className="text-sm text-slate-700">Verification Code</span>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-[0.35em] text-center text-lg font-semibold"
                placeholder="123456"
                maxLength={6}
              />
            </label>
          )}

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            {emailVerified ? 'Email verified. You can create your account now.' : 'Use a Gmail address, request a verification code, and enter it before signing up.'}
          </div>

          <label className="block">
            <span className="text-sm text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimum 6 characters"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-700">Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-3 text-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-md hover:shadow-lg"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          <div className="mt-2">
            <button
              onClick={() => onPageChange('login')}
              className="text-blue-600 hover:text-blue-700 font-bold underline text-base"
              type="button"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup