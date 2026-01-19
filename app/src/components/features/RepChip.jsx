export default function RepChip({
  name,
  role,
  party = 'I',
  avatarInitials,
  onClick
}) {
  const partyStyles = {
    D: {
      background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
      border: '1px solid #60A5FA'
    },
    R: {
      background: 'linear-gradient(135deg, #EF4444, #B91C1C)',
      border: '1px solid #F87171'
    },
    I: {
      background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
      border: '1px solid #A78BFA'
    }
  };

  const style = partyStyles[party] || partyStyles.I;

  return (
    <button
      className="rep-chip"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        borderRadius: '24px',
        background: 'var(--surface-elevated, #1E1E2E)',
        border: '1px solid var(--border-subtle, #2D2D3D)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      <div
        className="rep-avatar"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 700,
          color: '#FFFFFF'
        }}
      >
        {avatarInitials || name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #FFFFFF)' }}>
          {name}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>
          {role}
        </div>
      </div>
      <i
        className="fas fa-chevron-right"
        style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted, #94A3B8)' }}
      />
    </button>
  );
}
