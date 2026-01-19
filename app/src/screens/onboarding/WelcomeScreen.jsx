import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout';
import { Button } from '../../components/ui';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/engagement');
  };

  return (
    <Screen noNav>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <i
            className="fas fa-check-circle"
            style={{
              fontSize: '64px',
              color: 'var(--accent-green)',
              marginBottom: '24px',
              display: 'block'
            }}
          ></i>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
            Welcome to CIVIQ!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.5 }}>
            Your account has been created successfully.
          </p>
        </div>

        <div className="content-card" style={{ width: '100%', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <i className="fas fa-map-marker-alt" style={{ fontSize: '20px', color: 'var(--accent-purple)' }}></i>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Location Verified</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Eastern Pennsylvania
              </p>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            We've identified your local, state, and federal representatives based on your ZIP code.
          </p>
        </div>

        <div style={{ width: '100%' }}>
          <Button variant="primary" fullWidth onClick={handleContinue}>
            Continue Setup
          </Button>
        </div>
      </div>
    </Screen>
  );
}
