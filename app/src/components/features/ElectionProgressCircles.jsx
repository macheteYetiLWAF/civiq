/**
 * ElectionProgressCircles Component
 *
 * Displays three circular progress indicators showing days until
 * the next election at Federal, State, and Local levels.
 * Each circle has a thick border that fills based on how soon the election is.
 */

// Color scheme for each government level
const LEVEL_COLORS = {
  federal: '#64748B', // Slate
  state: '#8B5CF6',   // Purple
  local: '#F59E0B',   // Orange
};

/**
 * Single progress circle component
 */
function SingleProgressCircle({
  daysRemaining,
  totalDays,
  label,
  color,
  size = 90
}) {
  // Calculate progress (inverted: less days = more progress shown)
  const progress = totalDays > 0
    ? Math.max(0, Math.min(1, (totalDays - daysRemaining) / totalDays))
    : 0;

  const radius = (size / 2) - 8; // Account for stroke width
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const viewBox = `0 0 ${size} ${size}`;
  const center = size / 2;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
    }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size} viewBox={viewBox}>
          {/* Background circle (track) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--surface-elevated, #1E1E2E)"
            strokeWidth="8"
          />
          {/* Progress circle (filled portion) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{
              transition: 'stroke-dashoffset 0.8s ease-out',
            }}
          />
        </svg>
        {/* Center content */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontSize: '22px',
            fontWeight: 700,
            color: color,
            lineHeight: 1,
          }}>
            {daysRemaining}
          </div>
          <div style={{
            fontSize: '9px',
            color: 'var(--text-muted, #94A3B8)',
            marginTop: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            days
          </div>
        </div>
      </div>
      {/* Label below circle */}
      <div style={{
        marginTop: '8px',
        fontSize: '11px',
        fontWeight: 600,
        color: color,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {label}
      </div>
    </div>
  );
}

/**
 * Main ElectionProgressCircles component
 * Displays three circles side by side for Federal, State, and Local elections
 * When sortByDays is true, circles are sorted by days remaining (ascending)
 */
export default function ElectionProgressCircles({
  federalDays = 0,
  stateDays = 0,
  localDays = 0,
  federalTotal = 365,
  stateTotal = 365,
  localTotal = 365,
  sortByDays = false,
}) {
  // Build array of election data
  const elections = [
    { key: 'federal', days: federalDays, total: federalTotal, label: 'Federal', color: LEVEL_COLORS.federal },
    { key: 'state', days: stateDays, total: stateTotal, label: 'State', color: LEVEL_COLORS.state },
    { key: 'local', days: localDays, total: localTotal, label: 'Local', color: LEVEL_COLORS.local },
  ];

  // Sort by days remaining (ascending) if sortByDays is true
  const orderedElections = sortByDays
    ? [...elections].sort((a, b) => a.days - b.days)
    : elections;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      padding: '16px 8px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #262640 50%, #1a2a35 100%)',
      borderRadius: 'var(--radius-lg, 12px)',
      border: '1px solid var(--border, #2D2D3D)',
      marginBottom: '16px',
    }}>
      {orderedElections.map((election) => (
        <SingleProgressCircle
          key={election.key}
          daysRemaining={election.days}
          totalDays={election.total}
          label={election.label}
          color={election.color}
        />
      ))}
    </div>
  );
}
