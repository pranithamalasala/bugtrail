import { useState } from 'react'
import { login, register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const { saveAuth } = useAuth()
  const [mode, setMode]   = useState('login')
  const [form, setForm]   = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const switchMode = (next) => {
    setMode(next)
    setError('')
    setForm({ name: '', email: '', password: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await login(form.email, form.password)
        saveAuth(res.data.token, res.data.user)
      } else {
        await register(form.name, form.email, form.password)
        const loginRes = await login(form.email, form.password)
        saveAuth(loginRes.data.token, loginRes.data.user)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand-icon" aria-hidden="true">🐛</span>
          <span className="auth-brand-name">BugTrail</span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to continue to your workspace'
              : 'Start tracking issues in seconds'}
          </p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                autoFocus
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              autoFocus={mode === 'login'}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading
              ? 'Please wait…'
              : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true" />

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button
            type="button"
            className="link-btn"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Sign up for free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
