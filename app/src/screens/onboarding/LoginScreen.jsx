import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ssoMessage, setSsoMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  const handleSsoClick = (provider) => {
    setSsoMessage(`${provider} login coming soon`);
    setTimeout(() => setSsoMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 20px',
    }}>
      {/* Logo Section */}
      <div style={{ textAlign: 'center', marginTop: '80px', marginBottom: '40px' }}>
        <h1 className="logo-gradient" style={{
          fontSize: '48px',
          fontWeight: 800,
          letterSpacing: '-2px',
          marginBottom: '8px'
        }}>
          CIVIQ
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Your Political Intelligence
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

      {/* SSO Coming Soon Message */}
      {ssoMessage && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '8px',
          color: '#8B5CF6',
          fontSize: '14px',
          textAlign: 'center',
        }}>
          {ssoMessage}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '6px',
          }}>
            Email or Phone
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

        <div style={{ marginBottom: '8px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '6px',
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <Link to="/forgot-password" style={{
            fontSize: '13px',
            color: 'var(--accent-purple)',
            textDecoration: 'none',
          }}>
            Forgot Password?
          </Link>
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
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '24px 0',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        <span style={{ padding: '0 16px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          or continue with
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
      </div>

      {/* Social Login */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleSsoClick('Google')}
          style={{
            padding: '12px',
            background: 'transparent',
            border: '2px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <i className="fab fa-google"></i> Google
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleSsoClick('Apple')}
          style={{
            padding: '12px',
            background: 'transparent',
            border: '2px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <i className="fab fa-apple"></i> Apple
        </button>
      </div>

      <button
        type="button"
        disabled={isLoading}
        onClick={() => handleSsoClick('X')}
        style={{
          width: '100%',
          padding: '12px',
          background: 'transparent',
          border: '2px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <i className="fab fa-x-twitter"></i> Continue with X
      </button>

      {/* Register CTA */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>New to CIVIQ? </span>
        <Link to="/register" style={{
          fontSize: '14px',
          color: 'var(--accent-purple)',
          textDecoration: 'none',
          fontWeight: 600,
        }}>
          Create Account
        </Link>
      </div>

      {/* Tagline */}
      <div style={{ marginTop: 'auto', paddingBottom: '40px', paddingTop: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
          Impartiality at all costs.
        </p>
      </div>
    </div>
  );
}
