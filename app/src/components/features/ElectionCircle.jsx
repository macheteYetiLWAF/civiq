export default function ElectionCircle({
  daysUntil,
  level = 'local',
  electionName,
  date
}) {
  const levelColors = {
    local: '#F59E0B',
    state: '#8B5CF6',
    federal: '#64748B'
  };

  const color = levelColors[level] || levelColors.local;

  // Calculate circle progress (assuming max 365 days for full circle)
  const maxDays = 365;
  const progress = Math.max(0, Math.min(1, daysUntil / maxDays));
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="election-circle" style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--surface-elevated, #1E1E2E)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color }}>
            {daysUntil}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted, #94A3B8)' }}>
            days
          </div>
        </div>
      </div>
      {electionName && (
        <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary, #FFFFFF)' }}>
          {electionName}
        </div>
      )}
      {date && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>
          {date}
        </div>
      )}
    </div>
  );
}
