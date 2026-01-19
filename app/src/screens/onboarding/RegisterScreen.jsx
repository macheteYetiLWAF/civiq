import { useState, useEffect, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout';
import { Button } from '../../components/ui';
import { register, getDivisions, geocode } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Lazy load map component (heavy dependency)
const LocationPicker = lazy(() => import('../../components/features/LocationPicker'));

// Government level colors
const LEVEL_COLORS = {
  federal: '#64748B',  // Slate
  state: '#8B5CF6',    // Purple
  local: '#F59E0B',    // Orange
};

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Division lookup state
  const [divisions, setDivisions] = useState(null);
  const [divisionsLoading, setDivisionsLoading] = useState(false);
  const [divisionsError, setDivisionsError] = useState('');
  const [normalizedAddress, setNormalizedAddress] = useState(null);
  const [geoLocation, setGeoLocation] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  // Debounced location lookup when zip changes
  useEffect(() => {
    if (!/^\d{5}$/.test(zipCode)) {
      setDivisions(null);
      setNormalizedAddress(null);
      setDivisionsError('');
      setGeoLocation(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setDivisionsLoading(true);
      setDivisionsError('');

      // Run geocode and divisions lookup in parallel
      const [geoResult, divResult] = await Promise.allSettled([
        geocode(zipCode),
        getDivisions(zipCode)
      ]);

      // Handle geocode result
      if (geoResult.status === 'fulfilled' && geoResult.value.success) {
        setGeoLocation(geoResult.value);
        // Use geocode result for normalized address if divisions API fails
        setNormalizedAddress({
          city: geoResult.value.components?.city,
          state: geoResult.value.components?.state,
          zip: geoResult.value.components?.zip || zipCode
        });
      }

      // Handle divisions result
      if (divResult.status === 'fulfilled' && divResult.value.success) {
        setDivisions(divResult.value.divisions);
        // Prefer division API normalized address
        if (divResult.value.normalizedAddress) {
          setNormalizedAddress(divResult.value.normalizedAddress);
        }
      } else if (divResult.status === 'rejected') {
        console.warn('Division lookup failed:', divResult.reason?.message);
      }

      setDivisionsLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [zipCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate zip code format (5 digits)
    if (!/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code.');
      return;
    }

    setIsLoading(true);

    try {
      // Include division OCD IDs if we have them
      const divisionIds = divisions?.map(d => d.ocdId) || [];
      await register({
        email,
        password,
        displayName,
        zipCode,
        divisions: divisionIds,
        normalizedAddress,
        coordinates: geoLocation?.center || null // [lng, lat]
      });
      // Refresh session to update auth context with new user
      if (refreshSession) {
        await refreshSession();
      }
      navigate('/welcome');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen noNav>
      <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '24px' }}>
        <h1 className="logo-gradient" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
          CIVIQ
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Create your account
        </p>
      </div>

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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            className="form-input"
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="zipCode">ZIP Code</label>
          <input
            type="text"
            id="zipCode"
            className="form-input"
            placeholder="Enter your ZIP code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
            maxLength={5}
            pattern="[0-9]{5}"
            required
            disabled={isLoading}
          />
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Used to find your local representatives
          </p>

          {/* Map picker toggle */}
          <button
            type="button"
            onClick={() => setShowMapPicker(!showMapPicker)}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              padding: '8px 12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <i className={`fas fa-map-marker-alt`} style={{ color: '#8B5CF6' }} />
            {showMapPicker ? 'Hide Map' : 'Or pick location on map'}
            <i className={`fas fa-chevron-${showMapPicker ? 'up' : 'down'}`} style={{ marginLeft: 'auto', fontSize: '10px' }} />
          </button>

          {/* Map picker (lazy loaded) */}
          {showMapPicker && (
            <div style={{ marginTop: '12px' }}>
              <Suspense fallback={
                <div style={{
                  height: '200px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-tertiary)',
                  fontSize: '13px'
                }}>
                  Loading map...
                </div>
              }>
                <LocationPicker
                  disabled={isLoading}
                  onLocationSelect={(location) => {
                    if (location.components?.zip) {
                      setZipCode(location.components.zip);
                    }
                    setGeoLocation({
                      success: true,
                      center: location.center,
                      components: location.components,
                      formatted_address: location.formatted_address,
                    });
                    setNormalizedAddress(location.components);
                  }}
                />
              </Suspense>
            </div>
          )}

          {/* Division lookup results */}
          {divisionsLoading && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}>
              Looking up your districts...
            </div>
          )}

          {divisionsError && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#ef4444'
            }}>
              {divisionsError}
            </div>
          )}

          {divisions && divisions.length > 0 && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px'
            }}>
              {normalizedAddress && (
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Location: {normalizedAddress.city}, {normalizedAddress.state} {normalizedAddress.zip}
                </p>
              )}
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Your Districts
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {divisions.slice(0, 6).map((div, idx) => (
                  <div
                    key={div.ocdId || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: LEVEL_COLORS[div.level] || LEVEL_COLORS.local,
                      flexShrink: 0
                    }} />
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {div.name}
                    </span>
                  </div>
                ))}
                {divisions.length > 6 && (
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                    +{divisions.length - 6} more districts
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '24px' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--accent-purple)', fontWeight: 500 }}>
          Sign in
        </Link>
      </p>
    </Screen>
  );
}
