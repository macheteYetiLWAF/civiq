import { useState } from 'react';
import { Link } from 'react-router-dom';

// Color scheme for each government level
const LEVEL_COLORS = {
  federal: '#64748B', // Slate
  state: '#8B5CF6',   // Purple
  local: '#F59E0B',   // Orange
};

/**
 * Single progress circle component for election countdown
 */
function ElectionCircle({
  daysRemaining,
  totalDays,
  label,
  color,
  size = 72
}) {
  const progress = totalDays > 0
    ? Math.max(0, Math.min(1, (totalDays - daysRemaining) / totalDays))
    : 0;

  const radius = (size / 2) - 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
    }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            color: color,
            lineHeight: 1,
          }}>
            {daysRemaining}
          </div>
          <div style={{
            fontSize: '8px',
            color: 'var(--text-muted, #94A3B8)',
            marginTop: '1px',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
          }}>
            days
          </div>
        </div>
      </div>
      <div style={{
        marginTop: '4px',
        fontSize: '9px',
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
 * Unified Stats Panel - combines user stats (streaks, reading balance, bills)
 * with election countdown circles in one cohesive data panel.
 * Collapsible with state persisted to localStorage.
 */
export default function UserStatsHeader({
  user,
  federalDays = 0,
  stateDays = 0,
  localDays = 0,
  federalTotal = 730,
  stateTotal = 548,
  localTotal = 365,
  sortByDays = false,
  billsTracked = 0,
}) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('civiq-stats-collapsed') === 'true';
  });

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('civiq-stats-collapsed', newState.toString());
  };

  const readStreakDays = user?.read_streak_days || user?.streak_days || 7;
  const learnStreakDays = user?.learn_streak_days || 3;

  // Default reading balance percentages
  const readingBalance = user?.reading_balance || {
    left: 35,
    center: 20,
    right: 45,
  };

  // Build election data array and optionally sort by days
  const elections = [
    { key: 'federal', days: federalDays, total: federalTotal, label: 'Federal', color: LEVEL_COLORS.federal },
    { key: 'state', days: stateDays, total: stateTotal, label: 'State', color: LEVEL_COLORS.state },
    { key: 'local', days: localDays, total: localTotal, label: 'Local', color: LEVEL_COLORS.local },
  ];

  const orderedElections = sortByDays
    ? [...elections].sort((a, b) => a.days - b.days)
    : elections;

  // Collapsed state - clickable bar to expand
  if (collapsed) {
    return (
      <div
        onClick={toggleCollapsed}
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #262640 50%, #1a2a35 100%)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '10px 16px',
          marginBottom: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <i className="fas fa-chart-bar" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}></i>
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
          Stats hidden · tap to expand
        </span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #262640 50%, #1a2a35 100%)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      marginBottom: '16px',
      position: 'relative',
    }}>
      {/* Collapse button */}
      <button
        onClick={toggleCollapsed}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '22px',
          height: '22px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1,
        }}
      >
        <i className="fas fa-chevron-up" style={{ fontSize: '9px', color: 'var(--text-secondary)' }}></i>
      </button>

      {/* Row 1: Read Streak | Learn Streak | Bills Tracked */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '12px',
        paddingRight: '28px', // Space for collapse chevron
      }}>
        {/* Read Streak */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {readStreakDays}
          </div>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--xp-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}>
              <i className="fas fa-fire" style={{ fontSize: '10px' }}></i>
              Read
            </div>
            <div style={{
              fontSize: '9px',
              color: 'var(--text-tertiary)',
            }}>
              streak
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{
          width: '1px',
          height: '32px',
          background: 'rgba(255, 255, 255, 0.15)',
        }}></div>

        {/* Learn Streak */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          justifyContent: 'center',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {learnStreakDays}
          </div>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}>
              <i className="fas fa-graduation-cap" style={{ fontSize: '10px' }}></i>
              Learn
            </div>
            <div style={{
              fontSize: '9px',
              color: 'var(--text-tertiary)',
            }}>
              streak
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{
          width: '1px',
          height: '32px',
          background: 'rgba(255, 255, 255, 0.15)',
        }}></div>

        {/* Bills Tracked */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          justifyContent: 'flex-end',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {billsTracked}
          </div>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}>
              <i className="fas fa-file-lines" style={{ fontSize: '10px' }}></i>
              Bills
            </div>
            <div style={{
              fontSize: '9px',
              color: 'var(--text-tertiary)',
            }}>
              tracked
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Reading Balance label + Rebalance button on same line, bar below */}
      <div style={{
        paddingBottom: '14px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '14px',
      }}>
        {/* Label row with Rebalance button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}>
            Reading Balance
          </div>
          <Link
            to="/rebalance"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              color: '#8B5CF6',
              fontSize: '10px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            <i className="fas fa-scale-balanced"></i>
            Rebalance
          </Link>
        </div>
        {/* Full-width bar */}
        <div style={{
          display: 'flex',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden',
          background: 'rgba(0, 0, 0, 0.2)',
        }}>
          <div style={{ flex: readingBalance.left, background: '#2563EB' }}></div>
          <div style={{ flex: readingBalance.center, background: '#8B5CF6' }}></div>
          <div style={{ flex: readingBalance.right, background: '#DC2626' }}></div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '2px',
          fontSize: '8px',
        }}>
          <span style={{ color: '#2563EB' }}>{readingBalance.left}%</span>
          <span style={{ color: '#8B5CF6' }}>{readingBalance.center}%</span>
          <span style={{ color: '#DC2626' }}>{readingBalance.right}%</span>
        </div>
      </div>

      {/* Bottom row: Election countdown circles */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
      }}>
        {orderedElections.map((election) => (
          <ElectionCircle
            key={election.key}
            daysRemaining={election.days}
            totalDays={election.total}
            label={election.label}
            color={election.color}
          />
        ))}
      </div>
    </div>
  );
}
