export default function StreakBadge({ days }) {
  return (
    <div
      className="streak-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
        color: '#FFFFFF',
        fontSize: '13px',
        fontWeight: 600
      }}
    >
      <i className="fas fa-fire" style={{ fontSize: '14px' }} />
      <span>{days} day{days !== 1 ? 's' : ''}</span>
    </div>
  );
}
