import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/stack')
    }
  }, [isAuthenticated, authLoading, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    setLoading(true)

    try {
      await login(email, password)
      navigate('/stack')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '60px', minHeight: '100%' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="logo-gradient" style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px' }}>CIVIQ</div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>Your Political Intelligence</div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--danger)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          marginBottom: '16px',
          color: 'var(--danger)',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <a href="#" style={{ display: 'block', textAlign: 'right', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', marginBottom: '24px' }}>
          Forgot Password?
        </a>

        <button
          type="submit"
          className="btn btn-gradient btn-full"
          style={{ padding: '14px' }}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        <span style={{ padding: '0 16px', fontSize: '12px', color: 'var(--text-tertiary)' }}>or continue with</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
      </div>

      {/* Social Login */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <button className="btn btn-outline" style={{ padding: '12px' }}>
          <span style={{ marginRight: '8px' }}>G</span> Google
        </button>
        <button className="btn btn-outline" style={{ padding: '12px' }}>
          Apple
        </button>
      </div>

      <button className="btn btn-outline btn-full" style={{ padding: '12px' }}>
        <span style={{ marginRight: '8px' }}>X</span> Continue with X
      </button>

      {/* Register CTA */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>New to CIVIQ?</span>
        <Link to="/register" style={{ fontSize: '14px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, marginLeft: '4px' }}>
          Create Account
        </Link>
      </div>

      {/* Tagline */}
      <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '40px', paddingBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Impartiality at all costs.</div>
      </div>
    </div>
  )
}
