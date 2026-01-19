import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
      {/* Progress indicator (3 steps - second active) */}
      <div className="progress-bar" style={{ width: '100%' }}>
        <div className="progress-step active"></div>
        <div className="progress-step active"></div>
        <div className="progress-step"></div>
      </div>

      {/* State Flag */}
      <div style={{ width: '160px', height: '107px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', marginBottom: '24px', border: '2px solid var(--border)', background: '#002868', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#FFD700' }}>
          <div style={{ fontSize: '24px', fontWeight: 700 }}>PA</div>
          <div style={{ fontSize: '10px' }}>Pennsylvania</div>
        </div>
      </div>

      {/* Welcome Message */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Welcome, Pennsylvanian!</div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>You've joined 12,847 constituents in your state</div>
      </div>

      {/* District Info Card */}
      <div className="card" style={{ width: '100%', background: 'var(--bg-tertiary)' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '14px' }}>Your Districts</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--gov-federal)' }}>
            <div style={{ fontSize: '10px', color: 'var(--gov-federal)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Federal</div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>PA-8</div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--gov-state)' }}>
            <div style={{ fontSize: '10px', color: 'var(--gov-state)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>State</div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Senate 22</div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--gov-local)' }}>
            <div style={{ fontSize: '10px', color: 'var(--gov-local)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>County</div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Luzerne</div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--gov-local)' }}>
            <div style={{ fontSize: '10px', color: 'var(--gov-local)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Local</div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Wilkes-Barre</div>
          </div>
        </div>
      </div>

      {/* Representatives Preview */}
      <div className="card" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Your Representatives</span>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>8 total</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', padding: '6px 10px', borderRadius: 'var(--radius-full)' }}>
            <div style={{ width: '20px', height: '20px', background: 'var(--bias-left)', borderRadius: '50%', fontSize: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>MC</div>
            <span style={{ fontSize: '11px' }}>M. Cartwright</span>
            <span style={{ fontSize: '9px', color: 'var(--bias-left)', fontWeight: 600 }}>D</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', padding: '6px 10px', borderRadius: 'var(--radius-full)' }}>
            <div style={{ width: '20px', height: '20px', background: 'var(--bias-right)', borderRadius: '50%', fontSize: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>DM</div>
            <span style={{ fontSize: '11px' }}>D. McCormick</span>
            <span style={{ fontSize: '9px', color: 'var(--bias-right)', fontWeight: 600 }}>R</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', padding: '6px 10px' }}>+6 more</div>
        </div>
      </div>

      <Link to="/personalize" className="btn btn-gradient btn-full" style={{ padding: '14px', marginTop: '20px' }}>
        Personalize My Experience
      </Link>
    </div>
  )
}
