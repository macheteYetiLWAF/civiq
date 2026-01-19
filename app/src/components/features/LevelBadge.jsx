export default function LevelBadge({ level }) {
  return (
    <div
      className="level-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
        color: '#FFFFFF',
        fontSize: '13px',
        fontWeight: 600
      }}
    >
      <i className="fas fa-star" style={{ fontSize: '12px' }} />
      <span>Level {level}</span>
    </div>
  );
}
