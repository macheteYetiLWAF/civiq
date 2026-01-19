import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { Card, Accordion } from '../../components/ui';
import './ElectionDetailScreen.css';

// Mock election data - full election with multiple races
const MOCK_ELECTION = {
  id: 'pa-primary-2025',
  title: 'PA Primary Election',
  date: '2025-05-20',
  type: 'Primary',
  pollingPlace: {
    name: 'St. Aloysius Parish Hall',
    address: '340 W Division St, Wilkes-Barre PA 18706',
    hours: '7:00 AM - 8:00 PM',
    coordinates: { lat: 41.2454, lng: -75.8796 },
  },
  keyDates: {
    voterRegistration: { date: '2025-05-05', status: 'completed' },
    electionDay: { date: '2025-05-20' },
  },
  races: [
    {
      id: 'city-council-a',
      title: 'Wilkes-Barre City Council - District A',
      level: 'local',
      type: 'Primary',
      seats: 1,
      candidates: [
        { id: 'jm', name: 'John Murphy', party: 'D', title: 'Former Council Member' },
        { id: 'mr', name: 'Maria Rodriguez', party: 'D', title: 'Community Organizer' },
        { id: 'tk', name: 'Thomas Kelly', party: 'D', title: 'Small Business Owner' },
      ],
    },
    {
      id: 'school-board',
      title: 'WB Area School Board',
      level: 'local',
      type: 'Primary',
      seats: 2,
      candidates: [
        { id: 'sb1', name: 'Lisa Chen', party: 'D', title: 'Parent Advocate' },
        { id: 'sb2', name: 'Robert Davis', party: 'D', title: 'Educator' },
        { id: 'sb3', name: 'Angela White', party: 'D', title: 'Business Owner' },
        { id: 'sb4', name: 'Michael Brown', party: 'D', title: 'Community Leader' },
        { id: 'sb5', name: 'Sarah Johnson', party: 'D', title: 'Attorney' },
      ],
    },
    {
      id: 'court-common-pleas',
      title: 'Court of Common Pleas',
      level: 'local',
      type: 'Primary',
      seats: 1,
      candidates: [
        { id: 'cp1', name: 'Judge Patricia Miller', party: 'D', title: 'Incumbent Judge' },
        { id: 'cp2', name: 'Attorney James Wilson', party: 'D', title: 'Defense Attorney' },
      ],
    },
  ],
  coverage: [
    {
      id: 1,
      title: "City Council Race: What's at Stake",
      source: "Citizens' Voice",
      time: '1d ago',
      bias: 'center',
      url: '#',
    },
    {
      id: 2,
      title: 'School Board Candidates Debate Funding',
      source: 'Times Leader',
      time: '3d ago',
      bias: 'center-left',
      url: '#',
    },
  ],
};

// Countdown hook
function useCountdown(targetDate) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculateCountdown() {
      const now = new Date();
      const target = new Date(targetDate + 'T07:00:00'); // Polls open at 7am
      const diff = target - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    }

    setCountdown(calculateCountdown());
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}

// Bias label component
function BiasLabel({ bias }) {
  const BIAS_COLORS = {
    'left': { bg: 'rgba(37, 99, 235, 0.2)', text: '#3B82F6' },
    'center-left': { bg: 'rgba(59, 130, 246, 0.2)', text: '#60A5FA' },
    'center': { bg: 'rgba(34, 197, 94, 0.2)', text: '#22C55E' },
    'center-right': { bg: 'rgba(239, 68, 68, 0.2)', text: '#F87171' },
    'right': { bg: 'rgba(220, 38, 38, 0.2)', text: '#EF4444' },
  };

  const colors = BIAS_COLORS[bias] || BIAS_COLORS.center;
  const label = bias.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');

  return (
    <span
      className="election-bias-label"
      style={{ background: colors.bg, color: colors.text }}
    >
      {label}
    </span>
  );
}

// Party badge component
function PartyBadge({ party }) {
  const colors = {
    D: { bg: '#2563EB', border: '#60A5FA' },
    R: { bg: '#DC2626', border: '#F87171' },
    I: { bg: '#8B5CF6', border: '#C4B5FD' },
  };
  const c = colors[party] || colors.I;

  return (
    <span
      className="election-party-badge"
      style={{ background: c.bg, borderColor: c.border }}
    >
      {party}
    </span>
  );
}

// Candidate row
function CandidateRow({ candidate, onCompare }) {
  const initials = candidate.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="election-candidate-row">
      <div
        className={`election-candidate-avatar election-candidate-avatar--${candidate.party.toLowerCase()}`}
      >
        {initials}
      </div>
      <div className="election-candidate-info">
        <div className="election-candidate-name">{candidate.name}</div>
        <div className="election-candidate-title">{candidate.title}</div>
      </div>
      <PartyBadge party={candidate.party} />
    </div>
  );
}

// Race accordion
function RaceAccordion({ race, defaultOpen = false }) {
  const navigate = useNavigate();

  return (
    <Accordion
      title={race.title}
      subtitle={`${race.candidates.length} candidates${race.seats > 1 ? ` · ${race.seats} seats` : ''} · ${race.type}`}
      defaultOpen={defaultOpen}
    >
      <div className="election-race-candidates">
        {race.candidates.map((candidate) => (
          <CandidateRow key={candidate.id} candidate={candidate} />
        ))}

        {race.candidates.length > 1 && (
          <button
            className="election-compare-btn"
            onClick={() => navigate(`/compare/${race.id}`)}
          >
            Compare Candidates
          </button>
        )}
      </div>
    </Accordion>
  );
}

// Key date item
function KeyDateItem({ icon, iconBg, title, subtitle, subtitleColor }) {
  return (
    <div className="election-key-date-item">
      <div className="election-key-date-icon" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="election-key-date-info">
        <div className="election-key-date-title">{title}</div>
        <div className="election-key-date-subtitle" style={{ color: subtitleColor }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

// Coverage item
function CoverageItem({ article }) {
  return (
    <Link to={article.url} className="election-coverage-item">
      <div className="election-coverage-headline">{article.title}</div>
      <div className="election-coverage-meta">
        <BiasLabel bias={article.bias} />
        <span>{article.source} - {article.time}</span>
      </div>
    </Link>
  );
}

export default function ElectionDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In production, fetch election by ID
  const election = MOCK_ELECTION;
  const countdown = useCountdown(election.date);

  // Calculate days until election
  const daysUntil = (dateStr) => {
    const now = new Date();
    const target = new Date(dateStr);
    return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
  };

  // Open directions in maps
  const openDirections = () => {
    const address = encodeURIComponent(election.pollingPlace.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  };

  // Add to calendar (generates ICS-like behavior)
  const addToCalendar = () => {
    const title = encodeURIComponent(election.title);
    const location = encodeURIComponent(election.pollingPlace.address);
    const details = encodeURIComponent(`Vote at ${election.pollingPlace.name}. Polls open ${election.pollingPlace.hours}.`);
    const date = election.date.replace(/-/g, '');
    // Google Calendar link
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}/${date}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Header
        title="Election"
        subtitle="Event details"
        backTo="/home"
        showSearch={true}
      />
      <Screen>
        {/* Election Header with Countdown */}
        <div className="election-header">
          <div className="election-header-label">Upcoming Election</div>
          <h1 className="election-header-title">{election.title}</h1>
          <div className="election-header-date">
            {new Date(election.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>

          {/* Countdown Display */}
          <div className="election-countdown">
            <div className="election-countdown-item election-countdown-item--primary">
              <div className="election-countdown-value">{countdown.days}</div>
              <div className="election-countdown-label">DAYS</div>
            </div>
            <div className="election-countdown-item">
              <div className="election-countdown-value">{countdown.hours}</div>
              <div className="election-countdown-label">HOURS</div>
            </div>
            <div className="election-countdown-item">
              <div className="election-countdown-value">{countdown.minutes}</div>
              <div className="election-countdown-label">MIN</div>
            </div>
          </div>
        </div>

        {/* Polling Place Card */}
        <Card className="election-polling-card">
          <div className="election-polling-label">Your Polling Place</div>
          <div className="election-polling-name">{election.pollingPlace.name}</div>
          <div className="election-polling-address">{election.pollingPlace.address}</div>
          <div className="election-polling-hours">Polls: {election.pollingPlace.hours}</div>

          <div className="election-polling-actions">
            <button className="election-btn election-btn--secondary" onClick={openDirections}>
              Get Directions
            </button>
            <button className="election-btn election-btn--outline" onClick={addToCalendar}>
              Add to Calendar
            </button>
          </div>
        </Card>

        {/* Races on Your Ballot */}
        <div className="election-section">
          <div className="election-section-title">Races on Your Ballot</div>

          {election.races.map((race, index) => (
            <RaceAccordion
              key={race.id}
              race={race}
              defaultOpen={index === 0}
            />
          ))}
        </div>

        {/* Key Dates */}
        <div className="election-section">
          <div className="election-section-title">Key Dates</div>

          <Card className="election-key-dates-card">
            <KeyDateItem
              icon={<i className="fas fa-check" style={{ color: 'white' }}></i>}
              iconBg="var(--success)"
              title="Voter Registration Deadline"
              subtitle={election.keyDates.voterRegistration.status === 'completed'
                ? "Completed - You're registered"
                : new Date(election.keyDates.voterRegistration.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              }
              subtitleColor={election.keyDates.voterRegistration.status === 'completed' ? 'var(--success)' : 'var(--text-tertiary)'}
            />

            <KeyDateItem
              icon="🗳️"
              iconBg="#F59E0B"
              title="Election Day"
              subtitle={`${new Date(election.keyDates.electionDay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ${daysUntil(election.keyDates.electionDay.date)} days`}
              subtitleColor="#F59E0B"
            />
          </Card>
        </div>

        {/* Related Coverage */}
        <div className="election-section">
          <div className="election-section-title">Related Coverage</div>

          <Card className="election-coverage-card">
            {election.coverage.map((article) => (
              <CoverageItem key={article.id} article={article} />
            ))}
          </Card>
        </div>

        <div style={{ height: '100px' }}></div>
      </Screen>
    </>
  );
}
