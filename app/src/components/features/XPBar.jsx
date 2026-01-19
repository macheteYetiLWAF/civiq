export default function XPBar({
  current,
  max,
  label
}) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className="xp-bar-container" style={{ width: '100%' }}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px'
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted, #94A3B8)' }}>
            {label}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary, #FFFFFF)' }}>
            {current} / {max} XP
          </span>
        </div>
      )}
      <div
        className="xp-bar-track"
        style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          background: 'var(--surface-elevated, #1E1E2E)',
          overflow: 'hidden'
        }}
      >
        <div
          className="xp-bar-fill"
          style={{
            width: `${percentage}%`,
            height: '100%',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #F59E0B, #F97316)',
            transition: 'width 0.5s ease'
          }}
        />
      </div>
    </div>
  );
}
