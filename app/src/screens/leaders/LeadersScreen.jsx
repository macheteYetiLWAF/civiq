import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { getOfficials } from '../../services/api';
import './LeadersScreen.css';

// Get initials from name (stripping title prefixes)
const getInitials = (name) => {
  return name
    .replace(/^(Rep\.|Sen\.|Gov\.|Lt\. Gov\.|Mayor)\s+/i, '')
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

// Pennsylvania Banner Component
const PennsylvaniaBanner = () => (
  <div className="leaders-banner">
    <div className="leaders-banner-inner-border"></div>

    <div className="leaders-banner-content">
      <div className="leaders-banner-title">
        {/* Pennsylvania Keystone - proper keystone shape with dramatic taper */}
        <svg width="40" height="36" viewBox="0 0 40 36" className="leaders-banner-keystone">
          <defs>
            <linearGradient id="keystoneGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#D4AF37' }} />
              <stop offset="50%" style={{ stopColor: '#BF9D3B' }} />
              <stop offset="100%" style={{ stopColor: '#A68B2E' }} />
            </linearGradient>
          </defs>
          {/* Outer keystone: wider at top (2-38=36), narrower at bottom (10-30=20) */}
          <path d="M2 0 L38 0 L30 36 L10 36 Z" fill="url(#keystoneGold)" />
          {/* Inner cutout for depth effect */}
          <path d="M5 3 L35 3 L28 33 L12 33 Z" fill="#0A1628" />
          {/* PA text */}
          <text x="20" y="22" textAnchor="middle" fill="#BF9D3B" fontSize="13" fontWeight="bold">PA</text>
        </svg>
        <div className="leaders-banner-state-name">PENNSYLVANIA</div>
      </div>

      <div className="leaders-banner-motto">
        <div className="leaders-banner-motto-item">
          <i className="fa-solid fa-scale-balanced"></i>
          <span>Virtue</span>
        </div>
        <div className="leaders-banner-motto-dot"></div>
        <div className="leaders-banner-motto-item">
          <i className="fa-solid fa-bell"></i>
          <span>Liberty</span>
        </div>
        <div className="leaders-banner-motto-dot"></div>
        <div className="leaders-banner-motto-item">
          <i className="fa-solid fa-feather"></i>
          <span>Independence</span>
        </div>
      </div>
    </div>
  </div>
);

// Leader Card Component
const LeaderCard = ({ leader, level, onClick }) => {
  const avatarClass = `leader-avatar leader-avatar--${leader.party === 'D' ? 'democrat' : leader.party === 'R' ? 'republican' : 'independent'}`;
  const cardClass = `leader-card leader-card--${level}`;

  return (
    <div className={cardClass} onClick={onClick}>
      {/* Election badge - positioned upper right */}
      {leader.upForElection && (
        <span className="leader-election-badge">
          <i className="fa-solid fa-calendar"></i>
          Up {leader.nextElection}
        </span>
      )}

      <div className={avatarClass}>
        {getInitials(leader.name)}
      </div>

      <div className="leader-info">
        <h4 className="leader-name">{leader.name}</h4>
        <p className="leader-role">{leader.displayRole || leader.title}</p>

        <div className="leader-badges">
          <span className={`leader-party-badge leader-party-badge--${leader.party}`}>
            {leader.party}
          </span>
          {leader.termStart && (
            <span className="leader-tenure-badge">
              Since {leader.termStart} ({leader.yearsServed} yrs)
            </span>
          )}
        </div>
      </div>

      {(leader.partyVotePct || leader.approvalRating) && (
        <div className="leader-stats">
          {leader.partyVotePct && (
            <span className="leader-stat">
              <span className="leader-stat-label">Party: </span>
              <span className="leader-stat-value">{leader.partyVotePct}%</span>
            </span>
          )}
          {leader.approvalRating && (
            <span className="leader-stat">
              <span className="leader-stat-label">Approval: </span>
              <span className={`leader-stat-value ${leader.approvalRating >= 55 ? 'leader-stat-value--success' : ''}`}>
                {leader.approvalRating}%
              </span>
            </span>
          )}
        </div>
      )}

      <span className="leader-chevron">›</span>
    </div>
  );
};

// Section Component
const LeadersSection = ({ title, level, leaders, onLeaderClick }) => {
  if (!leaders || leaders.length === 0) return null;

  return (
    <div className="leaders-section">
      <div className={`leaders-section-header leaders-section-header--${level}`}>
        <span className={`leaders-section-accent leaders-section-accent--${level}`}></span>
        {title}
      </div>
      <div className="leaders-cards">
        {leaders.map((leader) => (
          <LeaderCard
            key={leader.id}
            leader={leader}
            level={level}
            onClick={() => onLeaderClick(leader.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Collapsible Section for "other" state representatives
const CollapsibleLeadersSection = ({ title, level, leaders, onLeaderClick }) => {
  const [expanded, setExpanded] = useState(false);

  if (!leaders || leaders.length === 0) return null;

  return (
    <div className="leaders-section leaders-section--collapsible">
      <button
        className={`leaders-section-header leaders-section-header--${level} leaders-section-header--clickable`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`leaders-section-accent leaders-section-accent--${level}`}></span>
        {title}
        <span className="leaders-section-count">({leaders.length})</span>
        <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} leaders-section-chevron`}></i>
      </button>
      {expanded && (
        <div className="leaders-cards">
          {leaders.map((leader) => (
            <LeaderCard
              key={leader.id}
              leader={leader}
              level={level}
              onClick={() => onLeaderClick(leader.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function LeadersScreen() {
  const navigate = useNavigate();
  const [officials, setOfficials] = useState({
    federal: [],
    stateDirect: [],
    stateOther: [],
    local: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOfficials() {
      try {
        setLoading(true);
        // TODO: Pass user's county_id for proper filtering
        const data = await getOfficials();
        if (data.success) {
          const stateOfficials = data.officials.state;

          // Handle state data - API returns {direct: [], other: []}
          let stateDirect = [];
          let stateOther = [];

          if (Array.isArray(stateOfficials)) {
            // Old format - all state officials together
            stateDirect = stateOfficials;
          } else {
            // New format with direct/other split
            stateDirect = stateOfficials.direct || [];
            stateOther = stateOfficials.other || [];
          }

          setOfficials({
            federal: data.officials.federal || [],
            stateDirect,
            stateOther,
            local: data.officials.local || []
          });
        } else {
          setError('Failed to load officials');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOfficials();
  }, []);

  const handleLeaderClick = (leaderId) => {
    navigate(`/leaders/${leaderId}`);
  };

  if (loading) {
    return (
      <>
        <Header title="Leaders" />
        <Screen>
          <PennsylvaniaBanner />
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
            <p style={{ marginTop: '12px', fontSize: '14px' }}>Loading officials...</p>
          </div>
        </Screen>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Leaders" />
        <Screen>
          <PennsylvaniaBanner />
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '24px', marginBottom: '12px' }}></i>
            <p>{error}</p>
          </div>
        </Screen>
      </>
    );
  }

  return (
    <>
      <Header title="Leaders" />
      <Screen>
        <PennsylvaniaBanner />
        {/* Local representatives for user's county */}
        <LeadersSection
          title="Local - Luzerne County"
          level="local"
          leaders={officials.local}
          onLeaderClick={handleLeaderClick}
        />

        {/* State - user's direct representatives */}
        <LeadersSection
          title="State - Your Representatives"
          level="state"
          leaders={officials.stateDirect}
          onLeaderClick={handleLeaderClick}
        />

        {/* State - other PA representatives (collapsible) */}
        <CollapsibleLeadersSection
          title="Other PA State Officials"
          level="state"
          leaders={officials.stateOther}
          onLeaderClick={handleLeaderClick}
        />

        {/* Federal representatives */}
        <LeadersSection
          title="Federal - PA-8"
          level="federal"
          leaders={officials.federal}
          onLeaderClick={handleLeaderClick}
        />
      </Screen>
    </>
  );
}
