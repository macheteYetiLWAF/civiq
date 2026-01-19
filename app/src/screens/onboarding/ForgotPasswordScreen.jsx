import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // For now, just simulate - real implementation needs backend
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 20px',
      }}>
        <div style={{ textAlign: 'center', marginTop: '80px', marginBottom: '40px' }}>
          <h1 className="logo-gradient" style={{
            fontSize: '48px',
            fontWeight: 800,
            letterSpacing: '-2px',
            marginBottom: '8px'
          }}>
            CIVIQ
          </h1>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
        }}>
          <i className="fas fa-check-circle" style={{
            fontSize: '48px',
            color: '#10B981',
            marginBottom: '16px',
            display: 'block'
          }}></i>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--text-primary)'
          }}>
            Check Your Email
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: '24px'
          }}>
            If an account exists for {email}, you'll receive a password reset link shortly.
          </p>
          <Link to="/login" style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'var(--accent-purple)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
          }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 20px',
    }}>
      {/* Back button */}
      <Link to="/login" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '14px',
        marginTop: '20px',
      }}>
        <i className="fas fa-arrow-left"></i> Back to Login
      </Link>

      {/* Logo Section */}
      <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '40px' }}>
        <h1 className="logo-gradient" style={{
          fontSize: '48px',
          fontWeight: 800,
          letterSpacing: '-2px',
          marginBottom: '8px'
        }}>
          CIVIQ
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Reset Your Password
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#ef4444',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          lineHeight: 1.5,
        }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '6px',
          }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '16px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-gradient"
          style={{
            width: '100%',
            padding: '14px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {/* Tagline */}
      <div style={{ marginTop: 'auto', paddingBottom: '40px', paddingTop: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
          Impartiality at all costs.
        </p>
      </div>
    </div>
  );
}
