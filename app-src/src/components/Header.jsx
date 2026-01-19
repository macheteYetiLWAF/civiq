import { Link } from 'react-router-dom'

export default function Header({ showSearch = true }) {
  return (
    <div style={{
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'var(--bg-primary)'
    }}>
      <Link to="/stack" style={{ textDecoration: 'none' }}>
        <div className="logo-gradient" style={{ fontSize: '28px', fontWeight: 800 }}>CIVIQ</div>
      </Link>
      {showSearch && (
        <div style={{
          width: '36px',
          height: '36px',
          background: 'var(--bg-tertiary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-secondary)' }}></i>
        </div>
      )}
    </div>
  )
}
