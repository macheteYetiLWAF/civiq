import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validation
    if (!email || !password || !confirmPassword || !zipCode) {
      setError('All fields are required')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code')
      return
    }

    setLoading(true)

    try {
      await register(email, password, zipCode)
      navigate('/welcome')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Back header */}
      <div className="back-header">
        <Link to="/" className="back-button">&lt;</Link>
        <span className="header-title">Create Account</span>
      </div>

      <div className="content">
        {/* Progress indicator (3 steps - first active) */}
        <div className="progress-bar">
          <div className="progress-step active"></div>
          <div className="progress-step"></div>
          <div className="progress-step"></div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>Join as a Constituent</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Start your journey to informed citizenship</div>
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

        <form onSubmit={handleSubmit}>
          {/* Registration Form */}
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
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">ZIP Code</label>
            <input
              type="text"
              className="input-field"
              placeholder="18701"
              maxLength="5"
              style={{ width: '120px' }}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
              disabled={loading}
            />
          </div>

          {/* Inline Map for District Selection */}
          <div style={{ marginTop: '16px' }}>
            <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
              Drop a pin on your address
            </label>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              {/* Map placeholder */}
              <div style={{ position: 'relative', height: '180px', background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)' }}>
                {/* Location Pin (centered) */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)' }}>
                  <div style={{ width: '36px', height: '36px', background: 'var(--accent)', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.5)' }}>
                    <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%', transform: 'rotate(45deg)' }}></div>
                  </div>
                </div>

                {/* Zoom controls */}
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button type="button" style={{ width: '32px', height: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '18px' }}>+</button>
                  <button type="button" style={{ width: '32px', height: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '18px' }}>-</button>
                </div>
              </div>

              {/* District preview */}
              <div style={{ padding: '12px 14px', background: 'var(--accent-light)', borderTop: '1px solid var(--accent)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '6px' }}>District Detected</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong>Congressional:</strong> PA-8 | <strong>State:</strong> Senate 22, House 121
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gradient btn-full"
            style={{ padding: '14px', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </>
  )
}
